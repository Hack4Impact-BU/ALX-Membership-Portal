'use client';

import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import dotenv from 'dotenv';
dotenv.config();

const AuthProvider = ({ children }) => {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN; // Replace with the domain i put in Slack own domain (put into .env file)
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID; // Replace with the client id i put in Slack own client id (put into .env file)

  const onRedirectCallback = (appState) => {
    window.history.replaceState({}, document.title, appState?.returnTo || '/');
  };

  return (
    console.log(domain, clientId),
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: typeof window !== 'undefined' && window.location.origin,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthProvider;
