import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase-server';

// GET handler to fetch all assessments
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
        const student_id = url.searchParams.get('student_id');

        // Build query
        let query = supabase
            .from('drdp_assessments')
            .select(`
        *,
        student:students(*)
      `)
            .order('assessment_date', { ascending: false });

        // Filter by student_id if provided
        if (student_id) {
            query = query.eq('student_id', student_id);
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching DRDP assessments:', error);
        return NextResponse.json({ error: 'Failed to fetch DRDP assessments' }, { status: 500 });
    }
}

// POST handler to create a new assessment
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
        const { student_id, assessment_date, assessment_period, notes } = requestData;

        // Validate required fields
        if (!student_id || !assessment_date || !assessment_period) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create the assessment
        const { data, error } = await supabase
            .from('drdp_assessments')
            .insert({
                student_id,
                assessor_id: user.id,
                assessment_date,
                assessment_period,
                notes,
                status: 'draft'
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error creating DRDP assessment:', error);
        return NextResponse.json({ error: 'Failed to create DRDP assessment' }, { status: 500 });
    }
} 