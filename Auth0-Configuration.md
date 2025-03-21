# Auth0 Dashboard Configuration Steps

Follow these steps to configure your Auth0 application for both local development and Netlify deployment.

## Local Development Configuration

1. **Login to your Auth0 Dashboard** 
   - Go to [Auth0 Dashboard](https://manage.auth0.com/)
   - Use your Auth0 account credentials

2. **Update Application Settings**
   - Navigate to Applications > Applications > [Your App Name]
   - Update the following settings:

   **Allowed Callback URLs:**
   ```
   http://localhost:3000/api/auth/callback,
   http://localhost:3000/callback
   ```

   **Allowed Logout URLs:**
   ```
   http://localhost:3000,
   http://localhost:3000/login
   ```

   **Allowed Web Origins:**
   ```
   http://localhost:3000
   ```

   **Application Type:**
   - Ensure "Single Page Application" is selected

3. **Configure Application Properties**
   - Token Endpoint Authentication Method: None
   - ID Token Expiration: 36000 seconds (10 hours)
   - Refresh Token Rotation: Enabled
   - Refresh Token Expiration: 2592000 seconds (30 days)

## Netlify Deployment Configuration

1. **Add Netlify URLs to Application Settings**
   - Navigate back to your application settings in Auth0
   - Add the following to your existing URLs:

   **Allowed Callback URLs:**
   ```
   https://k-1-sdc-assessment.netlify.app/.netlify/functions/auth/callback
   ```

   **Allowed Logout URLs:**
   ```
   https://k-1-sdc-assessment.netlify.app
   ```

   **Allowed Web Origins:**
   ```
   https://k-1-sdc-assessment.netlify.app
   ```

2. **Set Up Environment Variables in Netlify**
   - Go to your Netlify site dashboard
   - Navigate to Site settings > Build & deploy > Environment
   - Add the following environment variables:

   ```
   NETLIFY_AUTH0_DOMAIN=your-auth0-domain.us.auth0.com
   NETLIFY_AUTH0_CLIENT_ID=your-auth0-client-id
   NETLIFY_AUTH0_CLIENT_SECRET=your-auth0-client-secret
   NETLIFY_AUTH0_CALLBACK=https://https://k-1-sdc-assessment.netlify.app/.netlify/functions/auth/callback
   NETLIFY_AUTH0_AFTER_LOGOUT_URL=https://https://k-1-sdc-assessment.netlify.app/
   NEXT_PUBLIC_SUPABASE_URL=https://npyrumupbledqaiahvso.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

## Optional: Configure Roles and Permissions

1. **Create Roles**
   - Go to User Management > Roles
   - Create two roles: "admin" and "teacher"

2. **Assign Roles to Users**
   - Go to User Management > Users
   - Select a user
   - Navigate to the "Roles" tab
   - Assign either "admin" or "teacher" role

3. **Create a Rule to Include Roles in Tokens**
   - Go to Auth Pipeline > Rules
   - Create a new rule named "Add user roles to tokens"
   - Use this code:

   ```javascript
   function (user, context, callback) {
     const namespace = 'https://k1-sdc-assessment-api';
     
     // Get user's roles
     const assignedRoles = (context.authorization || {}).roles || [];
     
     // Add roles to the user object
     user.app_metadata = user.app_metadata || {};
     user.app_metadata.role = assignedRoles.length > 0 ? assignedRoles[0] : 'teacher';
     
     // Add roles to tokens
     context.idToken[`${namespace}/roles`] = assignedRoles;
     context.accessToken[`${namespace}/roles`] = assignedRoles;
     
     // Add role as a separate claim for easier access
     context.idToken.role = user.app_metadata.role;
     context.accessToken.role = user.app_metadata.role;
     
     callback(null, user, context);
   }
   ```

## Testing the Configuration

1. **Test Local Authentication**
   - Run your application locally with `npm start`
   - Navigate to the login page
   - Click the "Sign in with Auth0" button
   - You should be redirected to Auth0, then back to your application

2. **Test Netlify Authentication**
   - Deploy your application to Netlify
   - Navigate to your Netlify site
   - Follow the same login process
   - Verify that you're redirected back to your Netlify site

## Troubleshooting

- **Check Network Requests**: If authentication fails, check the network tab in your browser's developer tools to identify any failing requests.
- **Review Logs**: Check Auth0 logs for any authentication errors.
- **Verify Environment Variables**: Ensure all environment variables are correctly set.
- **Check CORS Issues**: If you see CORS errors, verify your allowed origins in Auth0.
- **Check Callback URL Format**: Ensure callback URLs match exactly what's configured in Auth0. 