import { NextResponse, NextRequest } from 'next/server';
import { getSession, withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// This middleware protects routes that require authentication
export default withMiddlewareAuthRequired({
  returnTo: (req) => req.url,
  middleware: async (req: NextRequest) => {
    try {
      const res = NextResponse.next();

      // Get Auth0 session
      const session = await getSession(req, res);

      // If user is logged in with Auth0, check/sync with Supabase
      if (session?.user) {
        // Create Supabase client
        const supabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

        // Sync Auth0 user with Supabase
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', session.user.email)
          .single();

        // If user doesn't exist in Supabase or needs to be updated
        if (!existingUser) {
          // Get role from Auth0 user
          let role = 'user';

          // Check if user has roles assigned via Auth0 permissions
          if (session.user[`${process.env.AUTH0_ISSUER_BASE_URL}/roles`]) {
            const roles = session.user[`${process.env.AUTH0_ISSUER_BASE_URL}/roles`];
            if (Array.isArray(roles) && roles.includes('admin')) {
              role = 'admin';
            }
          }

          // Create or update profile in Supabase
          await supabase.from('profiles').upsert({
            id: session.user.sub,
            email: session.user.email,
            name: session.user.name,
            role: role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      }

      return res;
    } catch (error) {
      console.error('Middleware error:', error);
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