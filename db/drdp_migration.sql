-- Create drdp_domains table to hold the assessment domains
CREATE TABLE IF NOT EXISTS public.drdp_domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER
);

-- Create drdp_measures table for individual measures within domains
CREATE TABLE IF NOT EXISTS public.drdp_measures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    domain_id UUID REFERENCES public.drdp_domains(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER
);

-- Create drdp_developmental_levels table for measure ratings
CREATE TABLE IF NOT EXISTS public.drdp_developmental_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER
);

-- Create students table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    birthdate DATE,
    grade TEXT,
    class TEXT,
    notes TEXT
);

-- Create drdp_assessments table to store assessment records
CREATE TABLE IF NOT EXISTS public.drdp_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    assessor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assessment_date DATE NOT NULL,
    assessment_period TEXT NOT NULL, -- Fall, Winter, Spring
    notes TEXT,
    status TEXT NOT NULL CHECK (status IN ('draft', 'complete')) DEFAULT 'draft'
);

-- Create drdp_ratings table to store individual measure ratings
CREATE TABLE IF NOT EXISTS public.drdp_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    assessment_id UUID REFERENCES public.drdp_assessments(id) ON DELETE CASCADE,
    measure_id UUID REFERENCES public.drdp_measures(id) ON DELETE CASCADE,
    developmental_level_id UUID REFERENCES public.drdp_developmental_levels(id) ON DELETE CASCADE,
    observation_notes TEXT,
    UNIQUE(assessment_id, measure_id)
);

-- Create drdp_observations table to store observation evidence
CREATE TABLE IF NOT EXISTS public.drdp_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    rating_id UUID REFERENCES public.drdp_ratings(id) ON DELETE CASCADE,
    observation_date DATE NOT NULL,
    observation_text TEXT NOT NULL
);

-- Row level security policies

-- Students table security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view students" ON public.students
    FOR SELECT
    USING (true);
    
CREATE POLICY "Authenticated users can manage students" ON public.students
    FOR ALL
    USING (auth.role() = 'authenticated');

-- DRDP Assessments security
ALTER TABLE public.drdp_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all assessments" ON public.drdp_assessments
    FOR SELECT
    USING (true);
    
CREATE POLICY "Users can manage their own assessments" ON public.drdp_assessments
    FOR ALL
    USING (auth.uid() = assessor_id);
    
CREATE POLICY "Admins can manage all assessments" ON public.drdp_assessments
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT id FROM public.profiles
            WHERE role = 'admin'
        )
    );

-- DRDP Ratings security
ALTER TABLE public.drdp_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all ratings" ON public.drdp_ratings
    FOR SELECT
    USING (true);
    
CREATE POLICY "Users can manage ratings on their assessments" ON public.drdp_ratings
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT assessor_id FROM public.drdp_assessments
            WHERE id = drdp_ratings.assessment_id
        )
    );
    
CREATE POLICY "Admins can manage all ratings" ON public.drdp_ratings
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT id FROM public.profiles
            WHERE role = 'admin'
        )
    );

-- Seed data for domains and developmental levels

-- Insert TK domains
INSERT INTO public.drdp_domains (name, description, sort_order)
VALUES
('Approaches to Learning - Self-Regulation (ATL-REG)', 'How children learn through play and reflection', 1),
('Social and Emotional Development (SED)', 'How children develop social and emotional understanding', 2),
('Language and Literacy Development (LLD)', 'How children develop language and literacy', 3),
('Cognition: Math (COG:MATH)', 'How children develop mathematical understanding', 4);

-- Insert developmental levels
INSERT INTO public.drdp_developmental_levels (code, name, description, sort_order)
VALUES
('R', 'Responding', 'Child responds to environmental stimuli in basic ways', 1),
('E', 'Exploring', 'Child explores objects and people in environment', 2),
('B', 'Building', 'Child builds fundamental skills', 3),
('I', 'Integrating', 'Child integrates learned skills', 4),
('E/I', 'Earlier/Integrating', 'Transitional period between earlier and integrating', 5);

-- Insert some sample measures for ATL-REG domain
INSERT INTO public.drdp_measures (domain_id, code, name, description, sort_order)
SELECT 
    id as domain_id,
    'ATL-REG 1' as code,
    'Attention Maintenance' as name,
    'Child develops the capacity to pay attention to people, things, or the environment when interacting with others or exploring play materials' as description,
    1 as sort_order
FROM public.drdp_domains
WHERE name = 'Approaches to Learning - Self-Regulation (ATL-REG)';

INSERT INTO public.drdp_measures (domain_id, code, name, description, sort_order)
SELECT 
    id as domain_id,
    'ATL-REG 2' as code,
    'Self-Comforting' as name,
    'Child develops the capacity to comfort or soothe self in response to distress from internal or external stimulation' as description,
    2 as sort_order
FROM public.drdp_domains
WHERE name = 'Approaches to Learning - Self-Regulation (ATL-REG)';

INSERT INTO public.drdp_measures (domain_id, code, name, description, sort_order)
SELECT 
    id as domain_id,
    'ATL-REG 3' as code,
    'Imitation' as name,
    'Child mirrors, repeats, and practices the actions or words of others in increasingly complex ways' as description,
    3 as sort_order
FROM public.drdp_domains
WHERE name = 'Approaches to Learning - Self-Regulation (ATL-REG)';

-- Insert sample measures for SED domain
INSERT INTO public.drdp_measures (domain_id, code, name, description, sort_order)
SELECT 
    id as domain_id,
    'SED 1' as code,
    'Identity of Self in Relation to Others' as name,
    'Child shows increasing awareness of self as distinct from and also related to others' as description,
    1 as sort_order
FROM public.drdp_domains
WHERE name = 'Social and Emotional Development (SED)';

INSERT INTO public.drdp_measures (domain_id, code, name, description, sort_order)
SELECT 
    id as domain_id,
    'SED 2' as code,
    'Social and Emotional Understanding' as name,
    'Child shows developing understanding of people's behaviors, feelings, thoughts, and individual characteristics' as description,
    2 as sort_order
FROM public.drdp_domains
WHERE name = 'Social and Emotional Development (SED)';

-- Insert sample measures for LLD domain
INSERT INTO public.drdp_measures (domain_id, code, name, description, sort_order)
SELECT 
    id as domain_id,
    'LLD 1' as code,
    'Understanding of Language (Receptive)' as name,
    'Child understands increasingly complex communication and language' as description,
    1 as sort_order
FROM public.drdp_domains
WHERE name = 'Language and Literacy Development (LLD)';

INSERT INTO public.drdp_measures (domain_id, code, name, description, sort_order)
SELECT 
    id as domain_id,
    'LLD 2' as code,
    'Responsiveness to Language' as name,
    'Child communicates or acts in response to language and responds to increasingly complex language' as description,
    2 as sort_order
FROM public.drdp_domains
WHERE name = 'Language and Literacy Development (LLD)';

-- Insert sample measures for COG:MATH domain
INSERT INTO public.drdp_measures (domain_id, code, name, description, sort_order)
SELECT 
    id as domain_id,
    'COG:MATH 1' as code,
    'Classification' as name,
    'Child shows an increasing ability to compare, match, and sort objects into groups according to their attributes' as description,
    1 as sort_order
FROM public.drdp_domains
WHERE name = 'Cognition: Math (COG:MATH)';

INSERT INTO public.drdp_measures (domain_id, code, name, description, sort_order)
SELECT 
    id as domain_id,
    'COG:MATH 2' as code,
    'Number Sense of Quantity' as name,
    'Child shows developing understanding of number and quantity' as description,
    2 as sort_order
FROM public.drdp_domains
WHERE name = 'Cognition: Math (COG:MATH)'; 