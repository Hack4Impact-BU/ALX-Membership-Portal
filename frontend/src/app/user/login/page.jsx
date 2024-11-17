'use client';
import React, { useState, useContext} from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { AuthContext } from '/src/components/AuthProvider.jsx';

export default function Login() {
    const router = useRouter();
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/auth0/login', {
        email: email,
        password: password,
      });

      console.log('Login response:', response.data);

      const tokens = response.data.tokens;  
      localStorage.setItem('authToken', tokens.access_token);
      localStorage.setItem('idToken', tokens.id_token);

      console.log('Auth Token from Login:', tokens.access_token);
      console.log('ID Token from Login:', tokens.id_token);
      
      login(tokens.access_token);

     router.push('/');

    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.error || 'An error occurred during login');
      } else {
        setErrorMessage('An unknown error occurred.');
      }
    }
  };

  return (
    <div className="w-auto  h-screen flex items-center justify-center bg-green-900" style={{
      borderWidth: "50px",
      borderImageSource:
        "url('https://firebasestorage.googleapis.com/v0/b/discover-rgv.appspot.com/o/IMG_3192.png?alt=media&token=d3185060-a2d7-4846-804c-54542e913728')",
      borderImageSlice: 50,
      borderImageRepeat: "stretch",
    }}>
  <div
    className="p-4 w-3/4 h-3/4 flex flex-col items-center justify-center relative"
    
  >
    <div className="flex justify-center mb-6">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/discover-rgv.appspot.com/o/Latin_Logo.webp?alt=media&token=147e3440-786b-4936-94c7-c3a218a0a2d0" // Replace with your logo URL
        alt="Logo"
        className="object-scale-down bg-white rounded-full"
      />
    </div>

    <div className="">
    <h1 className=" text-white text-[50px] text-center font-custom mb-6">Sign-In</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm mb-2 ">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-500 value"
              value={email}  onChange={(e) => setEmail(e.target.value)} required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm mb-2"
            >
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-500"
              value={password} onChange={(e) => setPassword(e.target.value)} required 
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4">
          <a href="#" className="text-sm text-black-500 underline hover:text-green-900">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}

