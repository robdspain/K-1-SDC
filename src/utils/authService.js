import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Auth0 context for managing authentication state
export const Auth0Context = createContext();

export const useAuth0 = () => useContext(Auth0Context);

export function Auth0Provider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is already authenticated on mount
        fetchUser();
    }, []);

    // Function to fetch user profile from Auth0
    const fetchUser = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/me');

            if (response.ok) {
                const userData = await response.json();
                if (userData && userData.user) {
                    setUser(userData.user);
                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (err) {
            console.error('Failed to fetch user', err);
            setError(err);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Redirect to Auth0 login
    const loginWithRedirect = () => {
        const domain = process.env.REACT_APP_AUTH0_DOMAIN;
        const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
        const redirectUri = process.env.REACT_APP_AUTH0_REDIRECT_URI || window.location.origin + '/api/auth/callback';

        // If environment variables are available, use them
        if (domain && clientId) {
            console.log('Using Auth0 environment config:', { domain, redirectUri });
            window.location.href = `https://${domain}/authorize?` +
                `response_type=code&` +
                `client_id=${clientId}&` +
                `redirect_uri=${encodeURIComponent(redirectUri)}&` +
                `scope=${encodeURIComponent(process.env.REACT_APP_AUTH0_SCOPE || 'openid profile email')}`;
        } else {
            // Fallback to default API path (will use server-side config)
            console.log('Using default API auth path');
            window.location.href = '/api/auth/login';
        }
    };

    // Logout from Auth0
    const logout = () => {
        const domain = process.env.REACT_APP_AUTH0_DOMAIN;
        const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
        const returnTo = window.location.origin;

        // If environment variables are available, use them
        if (domain && clientId) {
            console.log('Using Auth0 environment config for logout');
            window.location.href = `https://${domain}/v2/logout?` +
                `client_id=${clientId}&` +
                `returnTo=${encodeURIComponent(returnTo)}`;
        } else {
            // Fallback to default API path (will use server-side config)
            console.log('Using default API auth logout path');
            window.location.href = '/api/auth/logout';
        }
    };

    // Get user role from Auth0 user
    const getUserRole = () => {
        if (!user) return null;

        // Get the audience from environment variable or use a default
        const audience = process.env.REACT_APP_AUTH0_AUDIENCE || 'https://k1-sdc-assessment-api';

        // Check if user has roles assigned via Auth0 permissions
        if (user[`${audience}/roles`]) {
            const roles = user[`${audience}/roles`];
            if (Array.isArray(roles) && roles.includes('admin')) {
                return 'admin';
            }
        }

        // Check for a specific role claim
        if (user.role) {
            return user.role;
        }

        // Check the Auth0 app_metadata which is commonly used for roles
        if (user['https://k1-sdc-assessment/app_metadata'] &&
            user['https://k1-sdc-assessment/app_metadata'].role) {
            return user['https://k1-sdc-assessment/app_metadata'].role;
        }

        return 'teacher'; // Default role
    };

    // Check if user is an admin
    const isAdmin = () => {
        const role = getUserRole();
        return role === 'admin';
    };

    return (
        <Auth0Context.Provider
            value={{
                isAuthenticated,
                user,
                isLoading,
                error,
                loginWithRedirect,
                logout,
                getUserRole,
                isAdmin,
            }}
        >
            {children}
        </Auth0Context.Provider>
    );
} 