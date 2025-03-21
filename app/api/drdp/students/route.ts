import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase-server';

// GET handler to fetch all students
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
        const search = url.searchParams.get('search');

        // Build query
        let query = supabase
            .from('students')
            .select('*')
            .order('last_name', { ascending: true });

        // Filter by search term if provided
        if (search) {
            query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching students:', error);
        return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
    }
}

// POST handler to create a new student
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
        const { first_name, last_name, birthdate, grade, class_name, notes } = requestData;

        // Validate required fields
        if (!first_name || !last_name) {
            return NextResponse.json({ error: 'First name and last name are required' }, { status: 400 });
        }

        // Create the student
        const { data, error } = await supabase
            .from('students')
            .insert({
                first_name,
                last_name,
                birthdate,
                grade,
                class: class_name,
                notes
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error creating student:', error);
        return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
    }
} 