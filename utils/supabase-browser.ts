import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If environment variables are missing, provide defaults or warn
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase URL or Anon Key missing. Auth functionality will be limited.');

    // Return mock client if in production (build) environment
    if (process.env.NODE_ENV === 'production') {
      return {
        auth: {
          getUser: async () => ({ data: { user: null }, error: null }),
          signInWithPassword: async () => ({ data: null, error: new Error('Supabase configuration missing') }),
          signUp: async () => ({ data: null, error: new Error('Supabase configuration missing') })
        }
      };
    }
  }

  return createBrowserClient(
    supabaseUrl || 'https://placeholder-url.supabase.co',
    supabaseKey || 'placeholder-key'
  )
} 