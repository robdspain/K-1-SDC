import { createClient } from '@/utils/supabase-browser';
import { getUserRole } from './auth0';

/**
 * Syncs Auth0 user data to Supabase profiles table
 * This ensures compatibility during the transition from Supabase Auth to Auth0
 */
export const syncAuth0UserToSupabase = async (auth0User: any) => {
    if (!auth0User) return null;

    const supabase = createClient();

    try {
        // Check if user already exists in Supabase
        const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', auth0User.email)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error('Error fetching existing profile:', fetchError);
            return null;
        }

        // Get role from Auth0 user
        const role = getUserRole(auth0User);

        const userData = {
            id: auth0User.sub,
            email: auth0User.email,
            name: auth0User.name,
            role: role,
            updated_at: new Date().toISOString()
        };

        if (!existingProfile) {
            // Create a new profile if not exists
            const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .insert([{
                    ...userData,
                    created_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (insertError) {
                console.error('Error creating profile in Supabase:', insertError);
                return null;
            }

            return newProfile;
        } else {
            // Update existing profile
            const { data: updatedProfile, error: updateError } = await supabase
                .from('profiles')
                .update(userData)
                .eq('email', auth0User.email)
                .select()
                .single();

            if (updateError) {
                console.error('Error updating profile in Supabase:', updateError);
                return null;
            }

            return updatedProfile;
        }
    } catch (error) {
        console.error('Error syncing Auth0 user to Supabase:', error);
        return null;
    }
}; 