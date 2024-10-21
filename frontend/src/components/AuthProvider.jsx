'use client';
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
  };
  const login = (token) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
  };

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;

