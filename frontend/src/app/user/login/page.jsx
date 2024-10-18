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

      const token = response.data.tokens.access_token;
      localStorage.setItem('authToken', token);
      console.log('Auth Token from Login:', token);
      
      login(token);

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
    <div className="w-full h-full  flex justify-center ">
        <div className="w-20px max-w-md p-6 bg-white shadow-lg rounded-lg ">
        <div className="flex justify-center mb-6">
                    <img
            src="https://firebasestorage.googleapis.com/v0/b/discover-rgv.appspot.com/o/Latin_Logo.webp?alt=media&token=147e3440-786b-4936-94c7-c3a218a0a2d0"
            alt="Logo"
            className=" object-scale-down bg-white rounded-full "
            />
        </div>


        <h1 className="text-3xl font-bold text-center text-white-900 mb-6">Sign-in</h1>
        <div className="w-full h-full max-w-md p-6 bg-white shadow-lg rounded-lg relative">
      <form onSubmit={handleLogin}>

      <div className="mb-4">
      <label htmlFor="email" className="block text-green-900 text-sm font-medium mb-2 ">Email</label>
          <input type="email"  className ='w-full px-3 py-2 border border-black-100' value={email}  onChange={(e) => setEmail(e.target.value)} required />
        </div>


        <div className="mb-4">
          <label className="block text-green-900 text-sm font-medium mb-2" >Password:</label>
          <input type="password"  className ='w-full px-3 py-2 border border-black-100' value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="w-full py-2 px-4 bg-black text-white rounded-md shadow-sm hover:bg-gray-800" >Sign in</button>
      </form>
      <div className="text-center mt-4">
              <a href="#" className="text-sm text-green-900 hover:text-green-600">Forgot password?</a>
            </div>
    {errorMessage && <p>{errorMessage}</p>}
    </div>
      
     </div>
    </div>
  );
}

