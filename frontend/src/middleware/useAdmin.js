'use client';
import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = () => {
      try {
        const idToken = localStorage.getItem('idToken');
        if (!idToken) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        const decodedToken = jwtDecode(idToken);
        const permissions = decodedToken['https://membership-portal/permissions'];
        const hasAdminAccess = Array.isArray(permissions) && permissions.includes('Admin');
        
        setIsAdmin(hasAdminAccess);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  return { isAdmin, isLoading };
}