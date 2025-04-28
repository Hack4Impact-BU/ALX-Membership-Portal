'use client';
import React, { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode'; // Ensure this import works after downgrading jwt-decode
import {UserIcon} from '@heroicons/react/outline';
import MembershipStatus from './MembershipStatus';
import { Inter, Proza_Libre } from 'next/font/google';

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const Profile = () => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [membershipStatus, setMembershipStatus] = useState('');

  useEffect(() => {
    console.log('Profile component mounted: Fetching user data...', localStorage.getItem('idToken'));
    const idToken = localStorage.getItem('idToken'); 
    if (idToken) {
      try {
        const decodedToken = jwtDecode(idToken);
        console.log('Decoded ID Token:', decodedToken);
        console.log('Variables: ', process.env.NEXT_PUBLIC_NAME, process.env.NEXT_PUBLIC_EMAIL, process.env.NEXT_PUBLIC_NUMBER);
        console.log('All ENV variables:', process.env);
        console.log('Name:', decodedToken[process.env.NEXT_PUBLIC_NAME]);
        console.log('Email:', decodedToken[process.env.NEXT_PUBLIC_EMAIL]);
        console.log('Phone:', decodedToken[process.env.NEXT_PUBLIC_NUMBER]);
        
        const name = decodedToken[process.env.NEXT_PUBLIC_NAME];
        const email = decodedToken[process.env.NEXT_PUBLIC_EMAIL];
        const phone = decodedToken[process.env.NEXT_PUBLIC_NUMBER];

        const cleaned = phone.replace(/\D/g, '');
        const areaCode = cleaned.slice(0, 3);
        const firstPart = cleaned.slice(3, 6);
        const secondPart = cleaned.slice(6);
        const formattedPhoneNumber = `(${areaCode}) ${firstPart}-${secondPart}`;

        setUserName(name || 'User');
        setUserEmail(email || '');
        setPhoneNumber(formattedPhoneNumber || '');
        setMembershipStatus('Active'); 
      } catch (error) {
        console.error('Error decoding ID Token:', error);
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('idToken'); 
    window.location.reload(); 
  };

  return (
    <div className={`text-white p-8 rounded-lg w-10/12 min-h-screen ${prozaLibre.className}`}>
      <div className="flex items-center gap-4 mb-8">
        <UserIcon className="h-32 w-32 text-white" />
        <h1 className={`text-white text-[80px] mb-6 pt-12 font-custom`}>Profile</h1>
      </div>

      <div className="bg-[#F6F2E9] p-6 rounded-lg mb-8 w-full">
        <div className="mb-4 ">
          <label className={`block text-sm text-[15px] text-black font-semibold mb-2`}>Name</label>
          <div className="flex gap-4">
            <input
              type="text"
              value={userName}
              readOnly
              className="flex-1 p-2 px-4 border text-gray-500 w-3/4 rounded-full bg-white focus:outline-none"
            />
            <button className={`bg-green-800 text-white px-4 py-2 w-1/5 rounded-full hover:bg-green-700 ${prozaLibre.className}`}>
              Confirm
            </button>
          </div>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className={`block text-sm font-semibold text-[15px] text-black mb-2 ${prozaLibre.className}`}>Email</label>
          <div className="flex gap-4">
            <input
              type="email"
              value={userEmail}
              readOnly
              className="flex-1 p-2 px-4 border text-gray-500 w-3/4 rounded-full bg-white focus:outline-none"
            />
            <button className={`bg-green-800 text-white px-4 py-2 w-1/5 rounded-full hover:bg-green-700 ${prozaLibre.className}`}>
              Confirm
            </button>
          </div>
        </div>

        {/* Phone Input */}
        <div className="mb-4">
          <label className={`block text-sm font-semibold text-[15px] text-black mb-2 ${prozaLibre.className}`}>Phone</label>
          <div className="flex gap-4">
          
            <input
              type="tel"
              value={phoneNumber}
              readOnly
              className="flex-1 p-2 px-4 border rounded-full w-3/4 text-gray-500 bg-white focus:outline-none"
            />
            <button className={`bg-green-800 text-white px-4 py-2 w-1/5 rounded-full hover:bg-green-700 ${prozaLibre.className}`}>
              Confirm
            </button>
          </div>
        </div>
      </div>

      <MembershipStatus />
    </div>
  );
};

export default Profile;
