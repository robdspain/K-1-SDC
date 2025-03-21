import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase-server';

// GET handler to fetch a specific observation
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();

        // Get the authenticated user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const id = params.id;

        const { data, error } = await supabase
            .from('drdp_observations')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching DRDP observation:', error);
        return NextResponse.json({ error: 'Failed to fetch DRDP observation' }, { status: 500 });
    }
}

// PATCH handler to update an observation
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();

        // Get the authenticated user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const id = params.id;

        // Parse request body
        const requestData = await request.json();
        const { observation_date, observation_text } = requestData;

        // Validate required fields
        if (!observation_date && !observation_text) {
            return NextResponse.json({
                error: 'At least one field (observation_date or observation_text) is required to update'
            }, { status: 400 });
        }

        // Update fields
        const updateData: any = {
            updated_at: new Date().toISOString()
        };

        if (observation_date) updateData.observation_date = observation_date;
        if (observation_text) updateData.observation_text = observation_text;

        // Update the observation
        const { data, error } = await supabase
            .from('drdp_observations')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error updating DRDP observation:', error);
        return NextResponse.json({ error: 'Failed to update DRDP observation' }, { status: 500 });
    }
}

// DELETE handler to delete an observation
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();

        // Get the authenticated user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const id = params.id;

        // Delete the observation
        const { error } = await supabase
            .from('drdp_observations')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting DRDP observation:', error);
        return NextResponse.json({ error: 'Failed to delete DRDP observation' }, { status: 500 });
    }
} 