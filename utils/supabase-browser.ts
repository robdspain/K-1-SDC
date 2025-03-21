import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If environment variables are missing, provide defaults or warn
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase URL or Anon Key missing. Auth functionality will be limited.');

    // Return mock client if in production (build) environment
    if (process.env.NODE_ENV === 'production') {
      // Create a mock client with both auth and database methods
      const mockClient = {
        auth: {
          getUser: async () => ({ data: { user: null }, error: null }),
          signInWithPassword: async () => ({ data: null, error: new Error('Supabase configuration missing') }),
          signUp: async () => ({ data: null, error: new Error('Supabase configuration missing') })
        },
        from: (table: string) => {
          return {
            select: (columns: string) => {
              const queryBuilder = {
                eq: (column: string, value: any) => {
                  return {
                    single: async () => ({
                      data: null,
                      error: new Error('Supabase configuration missing')
                    }),
                    limit: (limit: number) => ({
                      single: async () => ({
                        data: null,
                        error: new Error('Supabase configuration missing')
                      })
                    })
                  };
                },
                limit: (limit: number) => ({
                  single: async () => ({
                    data: null,
                    error: new Error('Supabase configuration missing')
                  })
                }),
                order: (column: string, options?: { ascending?: boolean }) => {
                  return queryBuilder;
                },
                single: async () => ({
                  data: null,
                  error: new Error('Supabase configuration missing')
                })
              };
              return queryBuilder;
            },
            insert: (data: any) => ({
              select: (columns: string) => ({
                single: async () => ({
                  data: null,
                  error: new Error('Supabase configuration missing')
                })
              })
            }),
            update: (data: any) => ({
              eq: (column: string, value: any) => ({
                single: async () => ({
                  data: null,
                  error: new Error('Supabase configuration missing')
                })
              })
            }),
            delete: () => ({
              eq: (column: string, value: any) => ({
                single: async () => ({
                  data: null,
                  error: new Error('Supabase configuration missing')
                })
              })
            })
          };
        }
      };

      return mockClient;
    }
  }

  return createBrowserClient(
    supabaseUrl || 'https://placeholder-url.supabase.co',
    supabaseKey || 'placeholder-key'
  )
} 