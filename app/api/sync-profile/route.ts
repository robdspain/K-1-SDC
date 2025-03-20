import { NextResponse, NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';
import { syncAuth0UserToSupabase } from '@/utils/auth0-sync';

// API route to sync Auth0 user to Supabase
export async function GET(req: NextRequest) {
    try {
        // Get Auth0 session using the request
        const session = await getSession(req);

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Sync the user to Supabase
        const profile = await syncAuth0UserToSupabase(session.user);

        if (!profile) {
            return NextResponse.json({ error: 'Failed to sync profile' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Profile synchronized successfully',
            profile
        });
    } catch (error) {
        console.error('Profile sync error:', error);
        return NextResponse.json({
            error: 'Failed to sync profile',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 