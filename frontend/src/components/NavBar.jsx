'use client';

import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const NavBar = () => {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0();

  if (isLoading) return null; 

  return (
    <nav className="flex items-center justify-between p-4 bg-green-900 text-white">
      <div>
        <a href="/">Amplify LatinX</a>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-4">
        {!isAuthenticated ? (
          <>
            <button
              onClick={() => loginWithRedirect()}
              className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
            >
              Login
            </button>
            <button
              onClick={() => loginWithRedirect({ screen_hint: 'signup' })}
              className="px-4 py-2 bg-green-500 rounded hover:bg-green-600"
            >
              Signup
            </button>
          </>
        ) : (
          // Show user information and Logout button when authenticated
          <>
            <span>Welcome, {user.name}</span>
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
