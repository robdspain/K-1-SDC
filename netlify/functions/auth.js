const { AuthenticationClient } = require('auth0');

// Initialize Auth0 client
const auth0 = new AuthenticationClient({
    domain: process.env.NETLIFY_AUTH0_DOMAIN,
    clientId: process.env.NETLIFY_AUTH0_CLIENT_ID,
    clientSecret: process.env.NETLIFY_AUTH0_CLIENT_SECRET
});

// Handle callback from Auth0
exports.handler = async (event, context) => {
    const path = event.path.replace(/\/\.netlify\/functions\/[^/]+/, '');
    const segments = path.split('/').filter(Boolean);

    try {
        switch (segments[0]) {
            case 'callback':
                return handleCallback(event);
            case 'login':
                return handleLogin(event);
            case 'logout':
                return handleLogout(event);
            case 'me':
                return handleMe(event);
            default:
                return {
                    statusCode: 404,
                    body: JSON.stringify({ error: 'Not found' })
                };
        }
    } catch (error) {
        console.error('Auth function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error', details: error.message })
        };
    }
};

// Handle Auth0 login
async function handleLogin(event) {
    const redirectUri = `${process.env.URL}/.netlify/functions/auth/callback`;
    const auth0Domain = process.env.NETLIFY_AUTH0_DOMAIN;
    const clientId = process.env.NETLIFY_AUTH0_CLIENT_ID;
    const scope = 'openid profile email';

    const url = `https://${auth0Domain}/authorize?` +
        `response_type=code&` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scope)}`;

    return {
        statusCode: 302,
        headers: {
            Location: url,
            'Cache-Control': 'no-cache'
        },
        body: ''
    };
}

// Handle Auth0 callback
async function handleCallback(event) {
    const { code } = event.queryStringParameters;
    const redirectUri = `${process.env.URL}/.netlify/functions/auth/callback`;

    if (!code) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing code parameter' })
        };
    }

    try {
        // Exchange code for tokens
        const tokenResponse = await auth0.oauth.authorizationCodeGrant({
            code,
            redirect_uri: redirectUri
        });

        const { access_token, id_token, expires_in } = tokenResponse.data;

        // Set secure cookies
        const secure = process.env.NODE_ENV === 'production';
        const cookieOptions = `Max-Age=${expires_in}; Path=/; ${secure ? 'Secure; ' : ''}HttpOnly; SameSite=Lax`;

        // Redirect to homepage with cookies
        return {
            statusCode: 302,
            headers: {
                Location: '/',
                'Set-Cookie': [
                    `auth0_access_token=${access_token}; ${cookieOptions}`,
                    `auth0_id_token=${id_token}; ${cookieOptions}`
                ],
                'Cache-Control': 'no-cache'
            },
            body: ''
        };
    } catch (error) {
        console.error('Error exchanging code for tokens:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to exchange code for tokens' })
        };
    }
}

// Handle Auth0 logout
async function handleLogout(event) {
    const domain = process.env.NETLIFY_AUTH0_DOMAIN;
    const clientId = process.env.NETLIFY_AUTH0_CLIENT_ID;
    const returnTo = process.env.NETLIFY_AUTH0_AFTER_LOGOUT_URL || process.env.URL;

    // Clear cookies
    const clearCookieOptions = 'Max-Age=0; Path=/; HttpOnly; SameSite=Lax';

    return {
        statusCode: 302,
        headers: {
            Location: `https://${domain}/v2/logout?client_id=${clientId}&returnTo=${encodeURIComponent(returnTo)}`,
            'Set-Cookie': [
                `auth0_access_token=; ${clearCookieOptions}`,
                `auth0_id_token=; ${clearCookieOptions}`
            ],
            'Cache-Control': 'no-cache'
        },
        body: ''
    };
}

// Get user profile
async function handleMe(event) {
    const cookies = parseCookies(event.headers.cookie || '');
    const accessToken = cookies.auth0_access_token;

    if (!accessToken) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Not authenticated' })
        };
    }

    try {
        const userInfo = await auth0.users.getInfo(accessToken);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: userInfo })
        };
    } catch (error) {
        console.error('Error getting user info:', error);
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Invalid token' })
        };
    }
}

// Parse cookies from header
function parseCookies(cookieString) {
    const cookies = {};

    if (!cookieString) return cookies;

    cookieString.split(';').forEach(cookie => {
        const parts = cookie.split('=');
        const name = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        if (name) cookies[name] = value;
    });

    return cookies;
} 