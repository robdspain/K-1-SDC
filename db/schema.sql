-- Schema for Supabase database
-- This file is for documentation purposes to keep track of the database schema

-- Profiles table (for users)
CREATE TABLE public.profiles (
    id TEXT PRIMARY KEY, -- Auth ID (from Auth0 or Supabase Auth)
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'user', -- 'user', 'admin', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.profiles IS 'User profiles for the application, compatible with both Auth0 and Supabase Auth';

-- RLS for profiles (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles
    FOR SELECT
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING ((auth.uid() = id));

CREATE POLICY "Admin can update any profile"
    ON public.profiles
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Features table (for feature checklist)
CREATE TABLE public.features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'planned' NOT NULL, -- 'planned', 'in_progress', 'completed'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.features IS 'Features for the application feature checklist';

-- RLS for features
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;

-- Policies for features
CREATE POLICY "Features are viewable by everyone"
    ON public.features
    FOR SELECT
    USING (true);

CREATE POLICY "Only admins can insert features"
    ON public.features
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can update features"
    ON public.features
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete features"
    ON public.features
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for features table
CREATE TRIGGER update_features_updated_at
BEFORE UPDATE ON public.features
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 