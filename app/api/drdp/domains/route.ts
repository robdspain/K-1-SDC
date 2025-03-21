import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase-server';

// GET handler to fetch all domains with their measures
export async function GET() {
    try {
        const supabase = await createClient();

        // Get all domains ordered by sort_order
        const { data: domains, error: domainsError } = await supabase
            .from('drdp_domains')
            .select('*')
            .order('sort_order');

        if (domainsError) {
            throw domainsError;
        }

        // Get all measures
        const { data: measures, error: measuresError } = await supabase
            .from('drdp_measures')
            .select('*')
            .order('sort_order');

        if (measuresError) {
            throw measuresError;
        }

        // Group measures by domain_id
        const domainsWithMeasures = domains.map(domain => {
            const domainMeasures = measures.filter(measure => measure.domain_id === domain.id);
            return {
                ...domain,
                measures: domainMeasures
            };
        });

        return NextResponse.json(domainsWithMeasures);
    } catch (error) {
        console.error('Error fetching DRDP domains:', error);
        return NextResponse.json({ error: 'Failed to fetch DRDP domains' }, { status: 500 });
    }
} 