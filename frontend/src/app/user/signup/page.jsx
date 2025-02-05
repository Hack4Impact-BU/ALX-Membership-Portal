'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth0/sign_up`, {
        email,
        password,
        name,
        phone_number: phoneNumber,
      });
      router.push('/user/login');
      console.log('Backend response:', response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.error || 'An error occurred during sign-up');
      } else {
        setErrorMessage('An unknown error occurred.');
      }
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen w-full bg-green-900"
      style={{
        borderWidth: '50px',
        borderImageSource:
          'url("/assets/FlowerFrame.png")',
        borderImageSlice: 50,
        borderImageRepeat: 'stretch',
        borderImageWidth: '50px',
        boxSizing: 'border-box',
      }}
    >
      {/* Form Container */}
      <div className="flex flex-col items-center justify-center p-4 w-3/4 h-3/4">
        {/* Logo */}
        <div className="flex justify-center mb-6">
            <img src="/assets/ALX_Logo.png" alt="ALX Logo" className="h-full w-full object-contain" />
          </div>

        {/* Title */}
        <h1 className="text-white text-[50px] font-custom mb-6">Sign-Up</h1>

        {/* Form */}
        <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
          <form onSubmit={handleSignup}>
            {/* Name Input */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-green-900 text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Phone Number Input */}
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-green-900 text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-green-900 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-green-900 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-black text-white rounded-md shadow-sm hover:bg-gray-800"
            >
              Sign Up
            </button>
          </form>

          {/* Login Redirect */}
          <div className="text-center mt-4">
            <a href="/user/login" className="text-sm text-green-900 hover:text-green-600">
              Have an Account?
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
  );
}