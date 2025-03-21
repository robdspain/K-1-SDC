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
              // Create a base result to return when awaited
              const baseResult = { data: null, error: new Error('Supabase configuration missing') };

              // Create a query builder that is also awaitable (thenable)
              const queryBuilder: any = {
                eq: (column: string, value: any) => {
                  return {
                    single: async () => baseResult,
                    limit: (limit: number) => ({
                      single: async () => baseResult
                    }),
                    // Make this level awaitable too
                    then: (onfulfilled: any) => Promise.resolve(baseResult).then(onfulfilled)
                  };
                },
                limit: (limit: number) => ({
                  single: async () => baseResult,
                  // Make this level awaitable too
                  then: (onfulfilled: any) => Promise.resolve(baseResult).then(onfulfilled)
                }),
                order: (column: string, options?: { ascending?: boolean }) => {
                  return queryBuilder;
                },
                single: async () => baseResult,
                // Make the query builder awaitable
                then: (onfulfilled: any) => Promise.resolve(baseResult).then(onfulfilled)
              };

              return queryBuilder;
            },
            insert: (data: any) => {
              const baseResult = { data: null, error: new Error('Supabase configuration missing') };
              const insertBuilder: any = {
                select: (columns: string) => ({
                  single: async () => baseResult,
                  then: (onfulfilled: any) => Promise.resolve(baseResult).then(onfulfilled)
                }),
                then: (onfulfilled: any) => Promise.resolve(baseResult).then(onfulfilled)
              };
              return insertBuilder;
            },
            update: (data: any) => {
              const baseResult = { data: null, error: new Error('Supabase configuration missing') };
              const updateBuilder: any = {
                eq: (column: string, value: any) => ({
                  single: async () => baseResult,
                  then: (onfulfilled: any) => Promise.resolve(baseResult).then(onfulfilled)
                }),
                then: (onfulfilled: any) => Promise.resolve(baseResult).then(onfulfilled)
              };
              return updateBuilder;
            },
            delete: () => {
              const baseResult = { data: null, error: new Error('Supabase configuration missing') };
              const deleteBuilder: any = {
                eq: (column: string, value: any) => ({
                  single: async () => baseResult,
                  then: (onfulfilled: any) => Promise.resolve(baseResult).then(onfulfilled)
                }),
                then: (onfulfilled: any) => Promise.resolve(baseResult).then(onfulfilled)
              };
              return deleteBuilder;
            }
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