import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase-server';

// GET handler to fetch observations for a specific rating
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Get the authenticated user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get query params
        const url = new URL(request.url);
        const rating_id = url.searchParams.get('rating_id');

        if (!rating_id) {
            return NextResponse.json({ error: 'Rating ID is required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('drdp_observations')
            .select('*')
            .eq('rating_id', rating_id)
            .order('observation_date', { ascending: false });

        if (error) {
            throw error;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching DRDP observations:', error);
        return NextResponse.json({ error: 'Failed to fetch DRDP observations' }, { status: 500 });
    }
}

// POST handler to create a new observation
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Get the authenticated user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Parse request body
        const requestData = await request.json();
        const { rating_id, observation_date, observation_text } = requestData;

        // Validate required fields
        if (!rating_id || !observation_date || !observation_text) {
            return NextResponse.json({
                error: 'Rating ID, observation date, and observation text are required'
            }, { status: 400 });
        }

        // Create the observation
        const { data, error } = await supabase
            .from('drdp_observations')
            .insert({
                rating_id,
                observation_date,
                observation_text
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error creating DRDP observation:', error);
        return NextResponse.json({ error: 'Failed to create DRDP observation' }, { status: 500 });
    }
} 