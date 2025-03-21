import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase-server';

// GET handler to fetch ratings for a specific assessment
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
        const assessment_id = url.searchParams.get('assessment_id');

        if (!assessment_id) {
            return NextResponse.json({ error: 'Assessment ID is required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('drdp_ratings')
            .select(`
        *,
        measure:drdp_measures(*),
        developmental_level:drdp_developmental_levels(*),
        observations:drdp_observations(*)
      `)
            .eq('assessment_id', assessment_id);

        if (error) {
            throw error;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching DRDP ratings:', error);
        return NextResponse.json({ error: 'Failed to fetch DRDP ratings' }, { status: 500 });
    }
}

// POST handler to create or update a rating
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
        const { assessment_id, measure_id, developmental_level_id, observation_notes } = requestData;

        // Validate required fields
        if (!assessment_id || !measure_id || !developmental_level_id) {
            return NextResponse.json({
                error: 'Assessment ID, measure ID, and developmental level ID are required'
            }, { status: 400 });
        }

        // Check if rating already exists
        const { data: existingRating } = await supabase
            .from('drdp_ratings')
            .select('id')
            .eq('assessment_id', assessment_id)
            .eq('measure_id', measure_id)
            .maybeSingle();

        let result;

        if (existingRating) {
            // Update existing rating
            result = await supabase
                .from('drdp_ratings')
                .update({
                    developmental_level_id,
                    observation_notes,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existingRating.id)
                .select(`
          *,
          measure:drdp_measures(*),
          developmental_level:drdp_developmental_levels(*)
        `)
                .single();
        } else {
            // Create new rating
            result = await supabase
                .from('drdp_ratings')
                .insert({
                    assessment_id,
                    measure_id,
                    developmental_level_id,
                    observation_notes
                })
                .select(`
          *,
          measure:drdp_measures(*),
          developmental_level:drdp_developmental_levels(*)
        `)
                .single();
        }

        // Update assessment status to in-progress
        await supabase
            .from('drdp_assessments')
            .update({ status: 'in-progress', updated_at: new Date().toISOString() })
            .eq('id', assessment_id);

        if (result.error) {
            throw result.error;
        }

        return NextResponse.json(result.data);
    } catch (error) {
        console.error('Error saving DRDP rating:', error);
        return NextResponse.json({ error: 'Failed to save DRDP rating' }, { status: 500 });
    }
} 