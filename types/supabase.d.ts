declare module '@supabase/ssr' {
  import { SupabaseClient } from '@supabase/supabase-js';

  export interface CookieOptions {
    domain?: string;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    sameSite?: 'strict' | 'lax' | 'none';
    secure?: boolean;
  }

  export function createBrowserClient(supabaseUrl: string, supabaseKey: string, options?: any): SupabaseClient;

  export function createServerClient(
    supabaseUrl: string,
    supabaseKey: string,
    options: {
      cookies: {
        getAll: () => { name: string; value: string }[];
        setAll: (cookies: Array<{ name: string; value: string; options?: CookieOptions }>) => void;
      };
    }
  ): SupabaseClient;
} 