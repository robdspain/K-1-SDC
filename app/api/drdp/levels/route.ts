import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase-server';

// GET handler to fetch all developmental levels
export async function GET() {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('drdp_developmental_levels')
            .select('*')
            .order('sort_order');

        if (error) {
            throw error;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching DRDP developmental levels:', error);
        return NextResponse.json({ error: 'Failed to fetch DRDP developmental levels' }, { status: 500 });
    }
} 