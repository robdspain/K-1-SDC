# K-1 SDC Assessment

A responsive web application for managing conversations, built with React.js and Node.js.

## Features

- Responsive design for mobile and web
- Real-time conversation updates
- User-friendly chat interface
- Secure backend API
- Docker containerization for easy deployment

## Tech Stack

### Frontend
- React.js with TypeScript
- Tailwind CSS for responsive design
- React Hooks for state management

### Backend
- Node.js with Express
- PostgreSQL for database (configurable)
- RESTful API design

## Development Setup

### Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)
- PostgreSQL (optional for production)
- Docker and Docker Compose (for containerized setup)

### Option 1: Running with Docker

1. Clone the repository
2. Start the application using Docker Compose:
   ```
   docker-compose up -d
   ```
3. Access the frontend at [http://localhost](http://localhost)
4. Access the backend API at [http://localhost:5000](http://localhost:5000)
5. To stop the application:
   ```
   docker-compose down
   ```

### Option 2: Running Locally

#### Frontend Setup
1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

#### Backend Setup
1. Navigate to the server directory:
   ```
   cd server
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on the provided example
4. Start the server:
   ```
   npm run dev
   ```
5. The API will be available at [http://localhost:5000](http://localhost:5000)

## Deployment

### Docker Deployment
1. Build the Docker images:
   ```
   docker-compose build
   ```
2. Run the containers:
   ```
   docker-compose up -d
   ```
3. For production, update the environment variables in `docker-compose.yml`

### Frontend Deployment (Netlify)
1. Push your code to a GitHub repository
2. Connect the repository to Netlify
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
   - Environment variables: Set `REACT_APP_API_URL` to your backend URL

### Backend Deployment (Digital Ocean)
1. Create a Digital Ocean Droplet
2. Set up Node.js and PostgreSQL on the Droplet
3. Clone the repository to the Droplet
4. Configure environment variables for production
5. Set up PM2 or similar for process management
6. Configure Nginx as a reverse proxy

## Production Considerations
- Use environment variables for sensitive configuration
- Implement proper authentication and authorization
- Set up HTTPS for secure communication
- Configure CORS appropriately
- Add rate limiting to protect the API
- When using Docker in production, configure volumes for data persistence

## License
MIT 

# Next.js with Supabase Auth SSR

This project demonstrates how to implement Supabase Authentication with Server-Side Rendering (SSR) in a Next.js application.

## Project Setup

1. Install dependencies:
```bash
npm install
# or
yarn
# or
pnpm install
```

2. Set up environment variables:
- Copy `.env.local.example` to `.env.local`
- Add your Supabase URL and anon key (can be found in your Supabase dashboard)

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Implementation Details

The project uses the recommended modern approach with `@supabase/ssr` package:

### Server Client
- Created using `createServerClient` from `@supabase/ssr`
- Handles cookie management properly using the `getAll` and `setAll` methods
- Located in `utils/supabase-server.ts`

### Browser Client
- Created using `createBrowserClient` from `@supabase/ssr`
- Simplifies client-side Supabase interactions
- Located in `utils/supabase-browser.ts`

### Authentication Middleware
- Ensures user sessions are refreshed
- Handles protected routes by redirecting unauthenticated users
- Located in `middleware.ts`

## Important Notes

1. This project follows the latest Supabase recommendations for Next.js integration
2. It uses the proper cookie handling methods to prevent session issues
3. The middleware is critical for maintaining authentication state

## Authentication Flow

1. User signs in via the login page
2. Middleware refreshes session on each request
3. Protected routes check for authenticated user
4. Unauthenticated users are redirected to login

## Learn More

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase SSR Package](https://github.com/supabase/auth-helpers)

## Feature Checklist

The application includes an editable DRDP Feature Implementation Checklist that allows administrators to:

- View the status of all DRDP features
- Mark features as "yes", "no", or "planned for future"
- Add new features to the checklist
- Update feature descriptions and notes
- Delete features when necessary

### Accessing the Feature Checklist

1. **Admin View**: Administrators can access the editable checklist at `/dashboard/features`
2. **Read-Only View**: Regular users can see a read-only version of the checklist at the same URL

### Database Setup

To set up the features table in your Supabase database:

1. Navigate to the SQL Editor in your Supabase dashboard
2. Run the SQL commands found in `migration.sql` in this repository

This will create the necessary tables and policies for the feature checklist to work properly.

### Role-Based Access

The checklist uses role-based access control:
- Users with `role = 'admin'` in the profiles table can edit the checklist
- All other users can only view the read-only version 

## Auth0 Integration

The application now supports Auth0 for authentication. Here's how to set it up:

### Auth0 Setup

1. Create an Auth0 account at [https://auth0.com](https://auth0.com) if you don't have one
2. Create a new application in the Auth0 dashboard
3. Configure your application with the following settings:
   - Application Type: Regular Web Application
   - Allowed Callback URLs: `http://localhost:3000/api/auth/callback`
   - Allowed Logout URLs: `http://localhost:3000`
   - Allowed Web Origins: `http://localhost:3000`

### Environment Variables

Set up your environment variables in `.env.local`:

```
# Auth0 Configuration
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://YOUR_AUTH0_DOMAIN'
AUTH0_CLIENT_ID='YOUR_AUTH0_CLIENT_ID'
AUTH0_CLIENT_SECRET='YOUR_AUTH0_CLIENT_SECRET'
AUTH0_SCOPE='openid profile email'
```

### Adding Admin Roles in Auth0

To assign admin roles to users:

1. Go to the Auth0 dashboard
2. Navigate to "User Management" > "Users"
3. Select a user
4. Go to the "Roles" tab
5. Assign the "admin" role (create it first if it doesn't exist)

Alternatively, you can add custom app metadata to user profiles:

1. Go to the user's profile
2. Add app metadata:
   ```json
   {
     "role": "admin"
   }
   ```

### Authentication Flow

1. Users are redirected to Auth0 login page when accessing protected routes
2. After successful authentication, they are redirected back to the application
3. Admin-only features like the editable feature checklist are restricted based on user roles

### Migration from Supabase Auth

The application supports both Auth0 and Supabase authentication during migration:

1. Both authentication systems can be used simultaneously
2. The FeatureChecklistAdmin component checks for admin roles in both systems 

# TK-1-SDC Assessment Project

A Next.js application for managing student DRDP assessments with integrated Auth0 authentication and Supabase database.

## Features

- User authentication via Auth0
- Role-based access control (users and admins)
- Feature checklist management (admin only)
- Student assessment management
- DRDP assessment creation and tracking
- Profile management

## Tech Stack

- Next.js 13+ (App Router)
- TypeScript
- Auth0 for authentication
- Supabase for database
- Tailwind CSS for styling

## Authentication Flow

This application uses Auth0 as the primary authentication provider while maintaining compatibility with Supabase for database storage. The integration allows for:

1. **User Authentication**: Login/signup via Auth0
2. **Profile Synchronization**: Auth0 user data is automatically synced to Supabase profiles
3. **Role-Based Access**: Admin roles are supported and checked via middleware
4. **Protected Routes**: Certain routes are protected based on authentication status and roles

## Setup Instructions

### Prerequisites

- Node.js 16+
- npm or yarn
- Supabase account and project
- Auth0 account and application

### Environment Variables

Create a `.env.local` file with the following variables:

```
# Auth0 Configuration
AUTH0_SECRET='your-auth0-secret'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://your-tenant.auth0.com'
AUTH0_CLIENT_ID='your-auth0-client-id'
AUTH0_CLIENT_SECRET='your-auth0-client-secret'

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL='your-supabase-url'
NEXT_PUBLIC_SUPABASE_ANON_KEY='your-supabase-anon-key'
```

### Database Setup

The database schema is defined in the `db/schema.sql` file. You can run these SQL statements in the Supabase SQL editor to set up the required tables.

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Auth0 Configuration

### Required Rules/Actions

To properly set up Auth0, you need to configure:

1. **Application**: Create a Regular Web Application in Auth0
2. **Allowed Callback URLs**: Set to `http://localhost:3000/api/auth/callback` for development
3. **Allowed Logout URLs**: Set to `http://localhost:3000` for development
4. **Roles (optional)**: Create an 'admin' role in Auth0 if you want to assign it to users

### Auth0-Supabase Integration

The application synchronizes Auth0 user data with Supabase profiles in these ways:

1. **Middleware**: Auth0 session data is checked and synced to Supabase on protected routes
2. **Profile Page**: User data is loaded from both Auth0 and Supabase
3. **Admin Features**: Admin check is performed using both Auth0 roles and Supabase profile data

## Development

### Type Checking

```bash
npm run type-check
# or
yarn type-check
```

### Linting

```bash
npm run lint
# or
yarn lint
``` 