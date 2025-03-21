import { getSession, withPageAuthRequired, Session } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Auth0 User with potential role information
 */
interface Auth0User {
    sub?: string;
    email?: string;
    name?: string;
    [key: string]: any; // For custom claims
}

/**
 * Role types used in the application
 */
type UserRole = 'admin' | 'teacher' | 'user' | null;

/**
 * Gets the role of an Auth0 user from their claims
 * 
 * @param user The Auth0 user object
 * @returns The user's role or null if no role is found
 */
export const getUserRole = (user: Auth0User | undefined | null): UserRole => {
    if (!user) return null;

    // Get the namespace for roles from environment variables
    const rolesNamespace = process.env.AUTH0_ISSUER_BASE_URL;

    if (!rolesNamespace) {
        console.warn('AUTH0_ISSUER_BASE_URL environment variable is not set');
        return null;
    }

    // Check if user has roles assigned via Auth0 permissions
    const rolesPath = `${rolesNamespace}/roles`;

    if (user[rolesPath]) {
        const roles = user[rolesPath];
        if (Array.isArray(roles)) {
            if (roles.includes('admin')) return 'admin';
            if (roles.includes('teacher')) return 'teacher';
        }
    }

    // Check for a specific role claim
    if (user.role) {
        return user.role as UserRole;
    }

    return 'user'; // Default role
};

/**
 * Checks if a user is an admin
 * 
 * @param user The Auth0 user object
 * @returns True if the user is an admin, false otherwise
 */
export const isAdmin = (user: Auth0User | undefined | null): boolean => {
    const role = getUserRole(user);
    return role === 'admin';
};

/**
 * Checks if a user is a teacher
 * 
 * @param user The Auth0 user object
 * @returns True if the user is a teacher, false otherwise
 */
export const isTeacher = (user: Auth0User | undefined | null): boolean => {
    const role = getUserRole(user);
    return role === 'teacher';
};

/**
 * Higher-order function to require admin access for page routes
 * 
 * @param handler The handler function for the page
 * @returns A wrapped handler that checks for admin access
 */
export const withAdminRequired = (handler: Function) => {
    return withPageAuthRequired({
        getServerSideProps: async (context: any) => {
            try {
                // Get the user from the session
                const { req, res } = context;
                const session = await getSession(req, res);

                // If no user or not an admin, redirect to the home page
                if (!session?.user || !isAdmin(session.user as Auth0User)) {
                    return {
                        redirect: {
                            destination: '/',
                            permanent: false,
                        },
                    };
                }

                // Call the handler with the session
                return handler(context, session);
            } catch (error) {
                console.error('Admin authorization error:', error);

                // Redirect to home page on error
                return {
                    redirect: {
                        destination: '/',
                        permanent: false,
                    },
                };
            }
        },
    });
};

/**
 * Middleware to check if a user is an admin for API routes
 * 
 * @param req The Next.js request object
 * @param res The Next.js response object
 * @returns A response if unauthorized, null if authorized
 */
export const withApiAdminRequired = async (req: NextRequest, res: NextResponse) => {
    try {
        const session = await getSession(req, res);

        if (!session?.user || !isAdmin(session.user as Auth0User)) {
            return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
        }

        return null; // Continue if authorized
    } catch (error) {
        console.error('Admin authorization error:', error);
        return NextResponse.json({
            error: 'Unauthorized',
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        }, { status: 403 });
    }
}; 