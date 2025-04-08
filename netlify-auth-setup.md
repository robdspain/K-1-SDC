# Setting Up Netlify Identity Authentication

This guide walks through implementing user authentication using Netlify Identity in our K-1 SDC Assessment app.

## Prerequisites
- Netlify account
- React application deployed to Netlify
- Basic understanding of React hooks

## Implementation Steps

### 1. Enable Netlify Identity

1. Go to your Netlify dashboard
2. Select your site
3. Navigate to Site settings > Identity
4. Click "Enable Identity"
5. Configure registration preferences:
   - Open or invite-only registration
   - External providers (GitHub, Google, etc.)

### 2. Install Required Packages

```bash
npm install netlify-identity-widget
```

### 3. Create Authentication Context

Create a new file `src/context/AuthContext.tsx`:

```tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import netlifyIdentity from 'netlify-identity-widget';

// Initialize Netlify Identity
netlifyIdentity.init();

// Define the auth context type
type AuthContextType = {
  user: netlifyIdentity.User | null;
  login: () => void;
  logout: () => void;
  authReady: boolean;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<netlifyIdentity.User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // Event listener for login
    netlifyIdentity.on('login', (user) => {
      setUser(user);
      netlifyIdentity.close();
      console.log('Login event');
    });

    // Event listener for logout
    netlifyIdentity.on('logout', () => {
      setUser(null);
      console.log('Logout event');
    });

    // Event listener for initialization
    netlifyIdentity.on('init', (user) => {
      setUser(user);
      setAuthReady(true);
      console.log('Init event');
    });

    // Init Netlify Identity connection
    netlifyIdentity.init();

    // Cleanup
    return () => {
      netlifyIdentity.off('login');
      netlifyIdentity.off('logout');
      netlifyIdentity.off('init');
    };
  }, []);

  // Login method
  const login = () => {
    netlifyIdentity.open();
  };

  // Logout method
  const logout = () => {
    netlifyIdentity.logout();
  };

  // Context value
  const contextValue = {
    user,
    login,
    logout,
    authReady,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};
```

### 4. Add Auth Provider to App

Update your `src/index.tsx` or `src/App.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
```

### 5. Create Login/Logout Components

Create a `src/components/Navbar.tsx` component:

```tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, login, logout, authReady } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">K-1 SDC Assessment</h1>
        
        {authReady && (
          <ul className="flex space-x-4">
            {!user && (
              <li>
                <button 
                  onClick={login} 
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                >
                  Login / Sign Up
                </button>
              </li>
            )}
            
            {user && (
              <>
                <li className="flex items-center">
                  Hello, {user.user_metadata.full_name || user.email}
                </li>
                <li>
                  <button 
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
```

### 6. Create Protected Routes

Create a `src/components/ProtectedRoute.tsx` component:

```tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, authReady } = useAuth();

  if (!authReady) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

### 7. Update Your Routes

Update your routes in `App.tsx`:

```tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Conversations from './pages/Conversations';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/conversations" 
            element={
              <ProtectedRoute>
                <Conversations />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
```

### 8. Handling User-Specific Data

Example of using the authenticated user in a component:

```tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Conversations: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    // Fetch user-specific conversations
    if (user) {
      fetch(`/api/conversations?userId=${user.id}`, {
        headers: {
          Authorization: `Bearer ${user.token.access_token}`
        }
      })
        .then(res => res.json())
        .then(data => setConversations(data))
        .catch(err => console.error(err));
    }
  }, [user]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Conversations</h2>
      {/* Render conversations */}
    </div>
  );
};

export default Conversations;
```

## Netlify Identity Features

- User registration and login
- Email/password authentication
- Social login providers (GitHub, Google, etc.)
- Email verification
- Password recovery
- User roles and permissions
- JWT-based authentication
- Secure token handling

## Additional Configurations

### Custom Confirmation Emails

1. Go to Site settings > Identity > Emails
2. Customize invitation, confirmation, and recovery templates

### External OAuth Providers

1. Go to Site settings > Identity > Registration > External providers
2. Enable and configure providers like GitHub, Google, etc.

### Role-Based Access Control

1. Go to Site settings > Identity > Services > Git Gateway
2. Enable Git Gateway for role-based access

## Security Considerations

1. Always use HTTPS for production
2. Store tokens securely (Netlify Identity handles this)
3. Implement proper CORS configuration
4. Consider adding additional security headers
5. Use environment variables for sensitive configurations

## Testing Authentication

1. Create test users with different roles
2. Verify authentication persistence across page reloads
3. Test login/logout functionality
4. Verify protected routes are properly secured
5. Test social login if configured

## Troubleshooting

- If login popup doesn't appear, check browser pop-up settings
- Authentication issues may require clearing local storage
- Check Network tab in dev tools for API errors
- Ensure all Netlify Identity event listeners are working 