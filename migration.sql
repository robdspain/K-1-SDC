-- Create features table for tracking DRDP feature implementation status
CREATE TABLE IF NOT EXISTS public.features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL CHECK (status IN ('yes', 'no', 'planned')) DEFAULT 'planned',
    notes TEXT
);

-- Create RLS policies to secure features table
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;

-- Anyone can view features (they can see the read-only version)
CREATE POLICY "Anyone can view features" ON public.features
    FOR SELECT
    USING (true);

-- Only admins can insert/update/delete features
CREATE POLICY "Admins can manage features" ON public.features
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT id FROM public.profiles
            WHERE role = 'admin'
        )
    );

-- Add admin field to profiles table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'role'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT;
    END IF;
END
$$;

-- Create initial features based on the checklist
INSERT INTO public.features (title, description, status, notes)
VALUES
    ('User Authentication', 'Login, registration, and profile management', 'yes', 'Core functionality implemented'),
    ('DRDP Measure Management', 'Ability to create, view, and edit DRDP measures', 'planned', 'Planned for next sprint'),
    ('Observation Recording', 'Record and link observations to measures', 'no', 'Requires UI design'),
    ('Assessment Dashboard', 'Overview of all assessments and their status', 'planned', 'In wireframe stage'),
    ('Admin Features', 'Administrative tools and reports', 'planned', 'Security model being designed'); 