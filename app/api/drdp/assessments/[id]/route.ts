import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase-server';

// GET handler to fetch a specific assessment with its ratings
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

        // Fetch the assessment with student info
        const { data: assessment, error: assessmentError } = await supabase
            .from('drdp_assessments')
            .select(`
        *,
        student:students(*)
      `)
            .eq('id', id)
            .single();

        if (assessmentError) {
            throw assessmentError;
        }

        // Fetch ratings for this assessment
        const { data: ratings, error: ratingsError } = await supabase
            .from('drdp_ratings')
            .select(`
        *,
        measure:drdp_measures(*),
        developmental_level:drdp_developmental_levels(*)
      `)
            .eq('assessment_id', id);

        if (ratingsError) {
            throw ratingsError;
        }

        // Combine data
        const result = {
            ...assessment,
            ratings: ratings || []
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching DRDP assessment:', error);
        return NextResponse.json({ error: 'Failed to fetch DRDP assessment' }, { status: 500 });
    }
}

// PATCH handler to update an assessment
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
        const { assessment_date, assessment_period, notes, status } = requestData;

        // Update fields
        const updateData: any = {
            updated_at: new Date().toISOString()
        };

        if (assessment_date) updateData.assessment_date = assessment_date;
        if (assessment_period) updateData.assessment_period = assessment_period;
        if (notes !== undefined) updateData.notes = notes;
        if (status) updateData.status = status;

        // Update the assessment
        const { data, error } = await supabase
            .from('drdp_assessments')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error updating DRDP assessment:', error);
        return NextResponse.json({ error: 'Failed to update DRDP assessment' }, { status: 500 });
    }
}

// DELETE handler to delete an assessment
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

        // Delete associated ratings first (cascade delete should handle observations)
        const { error: ratingsError } = await supabase
            .from('drdp_ratings')
            .delete()
            .eq('assessment_id', id);

        if (ratingsError) {
            throw ratingsError;
        }

        // Delete the assessment
        const { error } = await supabase
            .from('drdp_assessments')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting DRDP assessment:', error);
        return NextResponse.json({ error: 'Failed to delete DRDP assessment' }, { status: 500 });
    }
} 