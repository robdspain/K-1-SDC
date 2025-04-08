import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { syncAuth0UserToSupabase } from '@/utils/auth0-sync';

// Mark as dynamic to prevent static generation (needed due to cookie usage)
export const dynamic = 'force-dynamic';

// Set runtime to nodejs explicitly as Auth0 client requires Node.js APIs
export const runtime = 'nodejs';

/**
 * API route to sync Auth0 user profile to Supabase
 * This can be called after login or profile updates to ensure data consistency
 */
export async function GET(req: NextRequest) {
    try {
        // Get Auth0 session
        const res = NextResponse.next();
        const session = await getSession(req, res);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized: No active session' },
                { status: 401 }
            );
        }

        // Sync Auth0 user to Supabase
        const result = await syncAuth0UserToSupabase(session.user);

        if (!result.success) {
            console.error('Profile sync failed:', result.error);
            return NextResponse.json(
                { error: 'Failed to sync profile', message: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Profile synced successfully',
            user: {
                id: result.profile?.id,
                email: result.profile?.email,
                name: result.profile?.name,
                role: result.profile?.role,
            }
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error in sync-profile API route:', error);

        return NextResponse.json(
            { error: 'Server error', message: errorMessage },
            { status: 500 }
        );
    }
}

/**
 * POST handler for more explicit syncing with potential body parameters
 */
export async function POST(req: NextRequest) {
    try {
        // Get Auth0 session
        const res = NextResponse.next();
        const session = await getSession(req, res);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized: No active session' },
                { status: 401 }
            );
        }

        // Parse any additional data from request body
        let additionalData = {};
        try {
            additionalData = await req.json();
        } catch (e) {
            // If body parsing fails, just continue with the session data
        }

        // Sync Auth0 user to Supabase with merged data
        const result = await syncAuth0UserToSupabase({
            ...session.user,
            ...additionalData,
        });

        if (!result.success) {
            console.error('Profile sync failed:', result.error);
            return NextResponse.json(
                { error: 'Failed to sync profile', message: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Profile synced successfully',
            user: {
                id: result.profile?.id,
                email: result.profile?.email,
                name: result.profile?.name,
                role: result.profile?.role,
            }
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error in sync-profile API route:', error);

        return NextResponse.json(
            { error: 'Server error', message: errorMessage },
            { status: 500 }
        );
    }
} 