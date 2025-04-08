# Testing the Auth0 Integration

This document outlines how to test the Auth0 integration in the K-1 SDC Assessment application.

## Local Testing

### Prerequisites
- A properly configured Auth0 application (see Auth0-Configuration.md)
- Environment variables set up in `.env.local`
- Application running locally (`npm start`)

### Test Login Flow

1. **Access the Login Page**
   - Navigate to http://localhost:3000/login
   - You should see the login page with a "Sign in with Auth0" button

2. **Initiate Authentication**
   - Click the "Sign in with Auth0" button
   - You should be redirected to the Auth0 login page

3. **Complete Authentication**
   - Enter your Auth0 credentials
   - If this is your first login, you may be asked to consent to permissions
   - After successful authentication, you should be redirected to the dashboard

4. **Verify User Information**
   - Check that your name/email appears in the dashboard header
   - Verify that your role (admin/teacher) is correctly assigned

5. **Test Protected Routes**
   - Try accessing admin-only routes
   - Confirm that teachers can't access admin features
   - Verify that unauthenticated users are redirected to login

6. **Test Logout**
   - Click the logout button in the header/dashboard
   - You should be redirected to the login page
   - Trying to access protected routes after logout should redirect to login

## Production Testing (Netlify)

Follow the same steps as local testing, but use your Netlify URL instead of localhost.

### Common Issues and Troubleshooting

1. **Redirect URI Mismatch**
   - Error: "The redirect URI in the request did not match the registered redirect URIs"
   - Solution: Ensure your Auth0 application has the correct callback URLs configured

2. **Token Validation Errors**
   - Error: "Invalid token" or "jwt expired"
   - Solution: Check that Auth0 domain and audience match between server and client

3. **CORS Issues**
   - Error: Cross-Origin Request Blocked
   - Solution: Ensure Auth0 allowed origins include your application URL

4. **Role-based Access Issues**
   - Problem: User can't access features they should have access to
   - Solution: Verify roles are correctly assigned in Auth0 dashboard

## Additional Tests

### API Authentication Test

1. Open your browser's developer tools (F12)
2. Go to the Network tab
3. Login to the application
4. Look for API requests to your backend
5. Verify that the Authorization header contains a valid JWT token

### Token Inspection

1. Login to the application
2. Open your browser's developer tools (F12)
3. Go to the Application tab
4. Check Local Storage or Cookies for Auth0 tokens
5. You can decode the JWT token at [jwt.io](https://jwt.io/) to verify its contents
   (Note: Never share your actual tokens with others or paste production tokens on public websites)

### Role Assignment Test

1. Login with an admin account
2. Verify you can access admin features
3. Logout and login with a teacher account
4. Verify teacher-specific restrictions are in place 