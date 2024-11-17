'use client';
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { AuthContext } from '/src/components/AuthProvider.jsx';

export default function Login() {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handles the login process
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth0/login`, {
        email,
        password,
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
    <div
      className="w-full h-screen flex items-center justify-center bg-green-900"
      style={{
        borderWidth: '50px',
        borderImageSource:
          'url("/assets/FlowerFrame.png")',
        borderImageSlice: 50,
        borderImageRepeat: 'stretch',
        boxSizing: 'border-box',
      }}
    >
      <div className="p-8 w-3/4 h-3/4 flex flex-col items-center justify-center relative">
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
            <img src="/assets/ALX_Logo.png" alt="ALX Logo" className="h-full w-full object-contain" />
          </div>
        {/* Form Section */}
        <div>
          <h1 className="text-white text-[50px] text-center font-custom mb-6">Sign-In</h1>
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <form onSubmit={handleLogin}>
              {/* Email Input */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 text-sm mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-lg shadow-md hover:bg-gray-800"
              >
                Sign In
              </button>
            </form>

            {/* Forgot Password Link */}
            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-gray-500 hover:text-green-900">
                Forgot password?
              </a>
            </div>
            <div className=" mt-4 text-center">
              <a href="/user/signup" className="text-sm text-green-600 hover:text-green-900">
                Create an Account
             </a>
          </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-red-500 mt-4 text-center">
                {typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage, null, 2)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}