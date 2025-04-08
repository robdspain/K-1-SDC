# Auth0 Integration Setup

This project uses Auth0 for authentication and authorization. Follow these steps to set up Auth0 for your application.

## Setting Up Auth0

1. **Create an Auth0 Account**
   - Go to [Auth0](https://auth0.com/) and sign up for an account if you don't already have one.

2. **Create a New Application**
   - In your Auth0 dashboard, go to "Applications" → "Create Application"
   - Name your application (e.g., "K-1 SDC Assessment App")
   - Select "Regular Web Applications" (for Next.js) or "Single Page Application" (for React) depending on your setup
   - Click "Create"

3. **Configure Application Settings**
   - In your application settings, configure the following:
     - Allowed Callback URLs: `http://localhost:3000/api/auth/callback` (for development)
     - Allowed Logout URLs: `http://localhost:3000` (for development)
     - Allowed Web Origins: `http://localhost:3000` (for development)
   - For production, add your production URLs as well

4. **Create API (Optional, but recommended for secure backend)**
   - Go to "APIs" → "Create API"
   - Name your API (e.g., "K-1 SDC Assessment API")
   - Set an identifier (audience), e.g., `https://k1-sdc-assessment-api`
   - Select the signing algorithm (RS256 recommended)

5. **Set Up Roles and Permissions (Optional, but recommended)**
   - Go to "User Management" → "Roles" to create roles such as "admin" and "teacher"
   - You can assign these roles to users in the "Users & Roles" section

## Environment Configuration

1. **Create Environment Variables**
   - Copy the `.env.example` file to `.env.local` (for Next.js) or `.env` (for React)
   - Fill in the Auth0 configuration values from your Auth0 dashboard

2. **Required Environment Variables**:
   - `AUTH0_SECRET`: A long random string used to encrypt cookies (Next.js)
   - `AUTH0_BASE_URL`: Your application's base URL (e.g., `http://localhost:3000` for development)
   - `AUTH0_ISSUER_BASE_URL`: Your Auth0 domain (e.g., `https://your-auth0-domain.auth0.com`)
   - `AUTH0_CLIENT_ID`: Your Auth0 application client ID
   - `AUTH0_CLIENT_SECRET`: Your Auth0 application client secret
   - `AUTH0_AUDIENCE`: Your API identifier (if you created an API)
   - `AUTH0_SCOPE`: The scopes you want to request (e.g., `openid profile email`)

3. **For React Applications**:
   - React applications need environment variables prefixed with `REACT_APP_`
   - Example: `REACT_APP_AUTH0_DOMAIN`, `REACT_APP_AUTH0_CLIENT_ID`, etc.

## Netlify Deployment

If you're deploying to Netlify, you'll need to set up environment variables in the Netlify dashboard.

1. **Netlify Environment Variables**
   - In your Netlify project dashboard, go to "Settings" → "Environment variables"
   - Add the Auth0 environment variables with the `NETLIFY_` prefix
   - Example: `NETLIFY_AUTH0_DOMAIN`, `NETLIFY_AUTH0_CLIENT_ID`, etc.

2. **Configure Build Settings**
   - Make sure your netlify.toml file has the correct redirects for Auth0 (if needed)
   - Example:
     ```toml
     [[redirects]]
       from = "/api/*"
       to = "/.netlify/functions/:splat"
       status = 200
     ```

## Testing the Integration

1. **Start your development server**
   - For Next.js: `npm run dev` or `yarn dev`
   - For React: `npm start` or `yarn start`

2. **Navigate to your login page**
   - The login button should redirect to Auth0's login page
   - After login, you should be redirected back to your application

3. **Verify user information**
   - Check that user information is correctly displayed in your application
   - Verify that roles and permissions are working as expected

## Troubleshooting

- **Callback URL Errors**: Make sure your callback URL is correctly configured in Auth0
- **CORS Issues**: Check that your allowed origins are correctly set in Auth0
- **Token Errors**: Verify that your audience and scope settings match between Auth0 and your application
- **Missing User Information**: Make sure you've requested the correct scopes



