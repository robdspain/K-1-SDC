import { NextResponse, NextRequest } from 'next/server';
import { getSession, withMiddlewareAuthRequired, Session } from '@auth0/nextjs-auth0/edge';
import { createServerClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { getUserRole } from './utils/auth0';

// Explicitly set the runtime to experimental-edge
export const runtime = 'experimental-edge';

/**
 * Interface for Auth0 user profile with required fields
 */
interface Auth0UserProfile {
  sub?: string;
  email?: string;
  name?: string;
  [key: string]: any;
}

/**
 * Creates a Supabase client for server-side operations
 * 
 * @param res The NextResponse object for setting cookies
 * @returns A Supabase client or null if configuration is missing
 */
function createSupabaseServerClient(res: NextResponse): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase URL or key missing. Database operations will be limited.');
    return null;
  }

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll: () => {
          const cookieStore = cookies();
          return Array.from(cookieStore.getAll()).map(cookie => ({
            name: cookie.name,
            value: cookie.value,
          }));
        },
        setAll: (cookies) => {
          cookies.forEach(cookie => {
            res.cookies.set(cookie.name, cookie.value, cookie.options);
          });
        },
      },
    }
  );
}

/**
 * Synchronizes Auth0 user with Supabase profile
 * 
 * @param supabase The Supabase client
 * @param user The Auth0 user profile
 * @returns A promise that resolves when synchronization is complete
 */
async function syncUserToSupabase(supabase: SupabaseClient, user: Auth0UserProfile): Promise<void> {
  try {
    // Check if user exists in Supabase
    const { data: existingUser, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', user.email)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error fetching existing profile:', fetchError);
      return;
    }

    // Get role from Auth0 user
    const role = getUserRole(user) || 'user';

    // Prepare user data for upsert
    const userData = {
      id: user.sub,
      email: user.email,
      name: user.name,
      role: role,
      updated_at: new Date().toISOString()
    };

    // Create or update profile in Supabase
    const { error: upsertError } = await supabase.from('profiles').upsert({
      ...userData,
      created_at: existingUser ? undefined : new Date().toISOString()
    });

    if (upsertError) {
      console.error('Error upserting profile:', upsertError);
    }
  } catch (error) {
    console.error('Error syncing user to Supabase:', error);
  }
}

// This middleware protects routes that require authentication
export default withMiddlewareAuthRequired({
  returnTo: (req) => req.url,
  middleware: async (req: NextRequest) => {
    try {
      const res = NextResponse.next();

      // Get Auth0 session
      const session = await getSession(req, res);

      // If user is logged in with Auth0, sync with Supabase
      if (session?.user) {
        const supabase = createSupabaseServerClient(res);

        if (supabase) {
          await syncUserToSupabase(supabase, session.user as Auth0UserProfile);
        }
      }

      return res;
    } catch (error) {
      console.error('Middleware error:', error instanceof Error ? error.message : 'Unknown error');
      return NextResponse.next();
    }
  }
});

// Only run on specific paths that require authentication
export const config = {
  matcher: [
    '/profile',
    '/dashboard/:path*',
    '/assessments/:path*',
    '/students/:path*',
    '/settings',
    '/admin/:path*'
  ],
}; 