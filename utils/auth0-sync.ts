import { createClient } from '@/utils/supabase-browser';
import { getUserRole } from './auth0';

/**
 * Auth0 User profile interface
 */
interface Auth0User {
    sub?: string;
    email?: string;
    name?: string;
    [key: string]: any;
}

/**
 * Supabase profile interface
 */
interface UserProfile {
    id: string;
    email: string;
    name: string;
    role: string;
    created_at?: string;
    updated_at: string;
    [key: string]: any;
}

/**
 * Result of the sync operation
 */
interface SyncResult {
    success: boolean;
    profile: UserProfile | null;
    error?: string;
}

/**
 * Syncs Auth0 user data to Supabase profiles table
 * This ensures compatibility during the transition from Supabase Auth to Auth0
 * 
 * @param auth0User The Auth0 user object
 * @returns A promise resolving to the sync result
 */
export const syncAuth0UserToSupabase = async (auth0User: Auth0User | null | undefined): Promise<SyncResult> => {
    // Default error response
    const errorResult = (message: string): SyncResult => ({
        success: false,
        profile: null,
        error: message
    });

    // Validate input
    if (!auth0User) {
        return errorResult('No Auth0 user provided');
    }

    if (!auth0User.email) {
        return errorResult('Auth0 user is missing email');
    }

    // Create Supabase client
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
            return errorResult(`Error fetching profile: ${fetchError.message}`);
        }

        // Get role from Auth0 user
        const role = getUserRole(auth0User) || 'user';

        // Prepare user data
        const userData: UserProfile = {
            id: auth0User.sub || '',
            email: auth0User.email,
            name: auth0User.name || auth0User.email.split('@')[0],
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
                return errorResult(`Error creating profile: ${insertError.message}`);
            }

            return {
                success: true,
                profile: newProfile
            };
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
                return errorResult(`Error updating profile: ${updateError.message}`);
            }

            return {
                success: true,
                profile: updatedProfile
            };
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error syncing Auth0 user to Supabase:', error);
        return errorResult(`Error syncing user: ${errorMessage}`);
    }
}; 