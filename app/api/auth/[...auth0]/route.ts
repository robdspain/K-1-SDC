import { handleAuth, getSession } from '@auth0/nextjs-auth0/edge';
import { syncAuth0UserToSupabase } from '@/utils/auth0-sync';

// Set the runtime to edge explicitly
export const runtime = 'edge';

// Standard Auth0 routes handler for Next.js App Router
export const GET = handleAuth();
export const POST = handleAuth();

// We'll implement syncing Auth0 user to Supabase in middleware or profile page
// This ensures compatibility during the transition from Supabase Auth to Auth0 