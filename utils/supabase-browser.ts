import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// Define types for the mock database responses
interface MockResponse<T = any> {
  data: T | null;
  error: Error | null;
}

// Define interfaces for the query builder methods
interface MockQueryBuilder<T = any> {
  eq: (column: string, value: any) => MockQueryFilterBuilder<T>;
  limit: (limit: number) => MockQueryLimitBuilder<T>;
  order: (column: string, options?: { ascending?: boolean }) => MockQueryBuilder<T>;
  single: () => Promise<MockResponse<T>>;
  then: <R>(onfulfilled: (value: MockResponse<T>) => R | PromiseLike<R>) => Promise<R>;
}

interface MockQueryFilterBuilder<T = any> {
  single: () => Promise<MockResponse<T>>;
  limit: (limit: number) => { single: () => Promise<MockResponse<T>> };
  then: <R>(onfulfilled: (value: MockResponse<T>) => R | PromiseLike<R>) => Promise<R>;
}

interface MockQueryLimitBuilder<T = any> {
  single: () => Promise<MockResponse<T>>;
  then: <R>(onfulfilled: (value: MockResponse<T>) => R | PromiseLike<R>) => Promise<R>;
}

// Function to create the mock response
function createMockResponse<T>(data: T | null = null): MockResponse<T> {
  return {
    data,
    error: data ? null : new Error('Supabase configuration missing')
  };
}

/**
 * Helper function to create a properly typed Promise.then implementation
 */
function createThenMethod<T>(baseResult: MockResponse<T>) {
  return <R>(onfulfilled: (value: MockResponse<T>) => R | PromiseLike<R>): Promise<R> => {
    return Promise.resolve(baseResult).then(onfulfilled);
  };
}

// Create the mock Supabase client
function createMockClient() {
  // Base error response
  const baseResult = createMockResponse(null);

  // Create a mock client that mimics Supabase functionality
  return {
    auth: {
      getUser: async () => createMockResponse({ user: null }),
      signInWithPassword: async () => createMockResponse(null),
      signUp: async () => createMockResponse(null)
    },
    from: (table: string) => {
      return {
        select: (columns: string): MockQueryBuilder => {
          const queryBuilder: MockQueryBuilder = {
            eq: (column: string, value: any): MockQueryFilterBuilder => {
              return {
                single: async () => baseResult,
                limit: (limit: number) => ({
                  single: async () => baseResult
                }),
                then: createThenMethod(baseResult)
              };
            },
            limit: (limit: number): MockQueryLimitBuilder => ({
              single: async () => baseResult,
              then: createThenMethod(baseResult)
            }),
            order: (column: string, options?: { ascending?: boolean }) => {
              return queryBuilder;
            },
            single: async () => baseResult,
            then: createThenMethod(baseResult)
          };

          return queryBuilder;
        },
        insert: (data: any) => {
          return {
            select: (columns: string) => ({
              single: async () => baseResult,
              then: createThenMethod(baseResult)
            }),
            then: createThenMethod(baseResult)
          };
        },
        update: (data: any) => {
          return {
            eq: (column: string, value: any) => ({
              single: async () => baseResult,
              then: createThenMethod(baseResult)
            }),
            then: createThenMethod(baseResult)
          };
        },
        delete: () => {
          return {
            eq: (column: string, value: any) => ({
              single: async () => baseResult,
              then: createThenMethod(baseResult)
            }),
            then: createThenMethod(baseResult)
          };
        }
      };
    }
  };
}

/**
 * Creates a Supabase client for browser environments
 * 
 * @returns A Supabase client or a mock client if configuration is missing
 */
export function createClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If environment variables are missing, provide defaults or warn
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase URL or Anon Key missing. Auth functionality will be limited.');

    // Return mock client if in production (build) environment
    if (process.env.NODE_ENV === 'production') {
      return createMockClient() as unknown as SupabaseClient;
    }
  }

  // Create and return a real Supabase client
  return createBrowserClient(
    supabaseUrl || 'https://placeholder-url.supabase.co',
    supabaseKey || 'placeholder-key'
  );
} 