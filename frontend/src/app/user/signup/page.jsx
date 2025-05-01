'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import TermsAndConditions from '../../terms/page';

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isAdminEmail, setIsAdminEmail] = useState(false);

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsAdminEmail(newEmail.toLowerCase().endsWith('@amplifylatinx.com'));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      setErrorMessage('You must accept the Terms and Conditions to create an account');
      return;
    }

    if (isAdminEmail) {
      console.log('Creating admin account with email:', email);
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth0/sign_up`, {
        email,
        password,
        name,
        phone_number: phoneNumber,
        terms_accepted: acceptTerms
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

  const handleTermsAccept = () => {
    setAcceptTerms(true);
  };

  const handleTermsClick = () => {
    setShowTerms(true);
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
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
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

            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-green-900 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className={`w-full px-3 py-2 border ${isAdminEmail ? 'border-green-500 bg-green-50' : 'border-gray-300'} rounded`}
                value={email}
                onChange={handleEmailChange}
                required
              />
              {isAdminEmail && (
                <p className="text-green-600 text-sm mt-1">
                  This email will be registered with administrator privileges
                </p>
              )}
            </div>

            {/* Phone Number Input */}
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-green-900 text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
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

            {/* Terms and Conditions Checkbox */}
            <div className="mb-4">
              <div className="flex items-center cursor-pointer" onClick={handleTermsClick}>
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={acceptTerms}
                  readOnly
                  required
                />
                <span className="text-sm text-green-900">
                  I accept the{' '}
                  <span className="text-blue-600 hover:underline">
                    Terms and Conditions
                  </span>
                </span>
              </div>
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

      {/* Terms and Conditions Popup */}
      {showTerms && (
        <TermsAndConditions
          onAccept={handleTermsAccept}
          onClose={() => setShowTerms(false)}
        />
      )}
    </div>
  );
}