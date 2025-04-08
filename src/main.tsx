import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';
import App from './App.tsx';

// Read Auth0 config from environment variables
const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

// Basic validation
if (!auth0Domain) {
  throw new Error("Missing environment variable: VITE_AUTH0_DOMAIN");
}
if (!auth0ClientId) {
  throw new Error("Missing environment variable: VITE_AUTH0_CLIENT_ID");
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
)
