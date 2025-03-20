import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

// Get user role from Auth0 user
export const getUserRole = (user: any): string | null => {
    // Check if user has roles assigned via Auth0 permissions
    if (user && user[`${process.env.AUTH0_ISSUER_BASE_URL}/roles`]) {
        const roles = user[`${process.env.AUTH0_ISSUER_BASE_URL}/roles`];
        if (Array.isArray(roles) && roles.includes('admin')) {
            return 'admin';
        }
    }

    // Check for a specific role claim
    if (user && user.role) {
        return user.role;
    }

    return null;
};

// Check if user is an admin
export const isAdmin = (user: any): boolean => {
    const role = getUserRole(user);
    return role === 'admin';
};

// Middleware to check if user is an admin
export const withAdminRequired = (handler: any) => {
    return withPageAuthRequired({
        getServerSideProps: async (context: any) => {
            // Get the user from the session
            const { req, res } = context;
            const session = await getSession(req, res);

            // If no user or not an admin, redirect to the home page
            if (!session || !session.user || !isAdmin(session.user)) {
                return {
                    redirect: {
                        destination: '/',
                        permanent: false,
                    },
                };
            }

            // Call the handler with the session
            return handler(context, session);
        },
    });
};

// API route middleware to check if user is an admin
export const withApiAdminRequired = async (req: NextRequest, res: NextResponse) => {
    try {
        const session = await getSession(req, res);

        if (!session || !session.user || !isAdmin(session.user)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        return null; // Continue if authorized
    } catch (error) {
        console.error('Admin authorization error:', error);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
}; 