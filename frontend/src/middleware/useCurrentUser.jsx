'use client';
import { useState, useEffect, createContext, useContext } from 'react';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

// Create a context for user data
const UserContext = createContext(null);

// Provider component to wrap your application
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = () => {
      try {
        // Get token from localStorage
        const idToken = localStorage.getItem('idToken');
        if (!idToken) {
          setIsLoading(false);
          return;
        }

        // Decode the token
        const decodedToken = jwtDecode(idToken);
        
        // Extract the sub (user ID) from the token
        const sub = decodedToken.sub;
        
        // Set user data
        setUser({
          id: sub,
          email: decodedToken.email,
          name: decodedToken['https://amplifylatinx.com//name'] || decodedToken.name,
          picture: decodedToken.picture,
          nickname: decodedToken.nickname,
          phoneNumber: decodedToken['https://amplifylatinx.com//phone_number']
        });
        
        // Set user ID separately for convenience
        setUserId(sub);
        
        // User is authenticated if we have a valid token
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error loading user data:', error);
        setUser(null);
        setUserId(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
    
    // Set up event listener for storage changes (for multi-tab support)
    window.addEventListener('storage', (event) => {
      if (event.key === 'idToken') {
        loadUserData();
      }
    });
    
    return () => {
      window.removeEventListener('storage', loadUserData);
    };
  }, []);

  // Helper method for saving items with current user ID
  const saveItem = async (endpoint, itemData) => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      const token = localStorage.getItem('idToken');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`,
        { ...itemData, user_id: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error saving item to ${endpoint}:`, error);
      throw error;
    }
  };

  // Helper method for fetching user-specific items
  const fetchUserItems = async (endpoint) => {
    if (!userId) {
      return [];
    }

    try {
      const token = localStorage.getItem('idToken');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}?user_id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching items from ${endpoint}:`, error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      userId, 
      isAuthenticated, 
      isLoading,
      saveItem,
      fetchUserItems
    }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook to use the user context
export function useCurrentUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useCurrentUser must be used within a UserProvider');
  }
  return context;
}

// Higher-order component to protect routes
export function withUserAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { userId, isAuthenticated, isLoading } = useCurrentUser();
    
    if (isLoading) {
      return <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>;
    }
    
    if (!isAuthenticated) {
      return <div className="text-center p-8">
        <h2 className="text-xl font-bold">Authentication Required</h2>
        <p className="mt-4">Please log in to access this page.</p>
        <button 
          onClick={() => window.location.href = '/login'} 
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Go to Login
        </button>
      </div>;
    }
    
    return <Component {...props} />;
  };
}