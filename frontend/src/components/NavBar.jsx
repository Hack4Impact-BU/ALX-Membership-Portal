'use client';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../components/AuthProvider.jsx';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../components/AuthProvider.jsx';

const NavBar = () => {
  const { authToken, logout } = useContext(AuthContext);
  const [userName, setUserName] = useState('');
  

  useEffect(() => {
    if (authToken) {
      const fetchUserProfile = async () => {
        try {
          const response = await axios.get('http://localhost:3001/profile', {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          const user = response.data.user;
          if (user) {
            setUserName(user.name || user.email || 'User');
          } else {
            setUserName('User');
          }
         
          console.log('User profile:', response.data.user);
        } catch (error) {
      
          console.error('Error fetching user profile:', error);
          setUserName('User');
        }
      };
      fetchUserProfile();
    }
  }, [authToken]);

  const handleReload = () => {
    window.location.reload();
  };

  if (!authToken) {
    return(
      <nav className="flex items-center justify-between p-4 bg-green-900 text-white">
      <div>
        <a href="/">Amplify LatinX</a>
      </div>
  
      <div className="flex items-center space-x-4">     
            <span>If you are seeing this, then you dont have a token thus cant access this page</span>
  
      <div className="flex items-center space-x-4">     
            <span>If you are seeing this, then you dont have a token thus cant access this page</span>
      </div>
    </nav>
    )
  }

  return (
    <nav className="flex items-center justify-between p-4 bg-green-900 text-white">
    <div>
      <a href="/">Amplify LatinX</a>
    </div>

    <div className="flex items-center space-x-4">     
          <span>Welcome, {userName}</span>
    </div>
  </nav>

    )
  }

  return (
    <nav className="flex items-center justify-between p-4 bg-green-900 text-white">
    <div>
      <a href="/">Amplify LatinX</a>
    </div>

    <div className="flex items-center space-x-4">     
          <span>Welcome, {userName}</span>
    </div>
  </nav>

  );
}
}

export default NavBar;