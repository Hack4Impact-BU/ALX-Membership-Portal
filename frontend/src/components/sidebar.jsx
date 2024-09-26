'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FiMenu } from 'react-icons/fi'; 
import { Inter, Proza_Libre } from 'next/font/google'; // Import the Proza Libre font

// Import simple white icons from Heroicons
import { CalendarIcon, GiftIcon, ClipboardIcon, UserGroupIcon, BookmarkIcon, UserIcon, LockClosedIcon } from '@heroicons/react/outline';

// Initialize Proza Libre font
const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null); 

  const toggleSidebar = () => {
    setIsOpen(!isOpen); 
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false); 
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div>
      <button
        onClick={toggleSidebar}
        className="fixed bottom-4 left-4 p-3 bg-[#335843] text-white rounded-full hover:bg-[#2b4a38] focus:outline-none shadow-lg"
      >
        <FiMenu size={24} />
      </button>

      <div
          ref={sidebarRef}
          className={`fixed top-0 left-0 h-full w-64 bg-[#335843] text-white shadow-md transform transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          } ${prozaLibre.className}`} // Apply Proza Libre font
        >
        <div className="flex flex-col justify-between h-full p-4">
          {/* Top Section */}
          <div>
            <div className="h-16 mb-4">
              <div className="bg-gray-800 h-full w-full"></div>
            </div>
            <ul className="space-y-4">
              <li className="py-2">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center space-x-2 p-2 rounded hover:bg-[#214933] cursor-pointer">
                    <CalendarIcon className="h-6 w-6 text-white" />
                    <p>Events & Lessons</p>
                  </div>
                </Link>
              </li>
              <li className="py-2">
                <Link href="/benefits_discounts" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center space-x-2 p-2 rounded hover:bg-[#214933] cursor-pointer">
                    <GiftIcon className="h-6 w-6 text-white" />
                    <p>Product Offers</p>
                  </div>
                </Link>
              </li>
              <li className="py-2">
                <Link href="/job_postings" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center space-x-2 p-2 rounded hover:bg-[#214933] cursor-pointer">
                    <ClipboardIcon className="h-6 w-6 text-white" />
                    <p>Job Board</p>
                  </div>
                </Link>
              </li>
              <li className="py-2">
                <Link href="/user/account_settings" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center space-x-2 p-2 rounded hover:bg-[#214933] cursor-pointer">
                    <UserGroupIcon className="h-6 w-6 text-white" />
                    <p>Get Involved</p>
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Bottom Section */}
          <div>
            <ul className="space-y-4">
              <li className="py-2">
                <Link href="/user/saved_items" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center space-x-2 p-2 rounded hover:bg-[#214933] cursor-pointer">
                    <BookmarkIcon className="h-6 w-6 text-white" />
                    <p className="hover:underline cursor-pointer">Saved</p>
                  </div>
                </Link>
              </li>
              <li className="py-2">
                <Link href="/user/profile" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center space-x-2 p-2 rounded hover:bg-[#214933] cursor-pointer">
                    <UserIcon className="h-6 w-6 text-white" />
                    <p className="hover:underline cursor-pointer">Profile</p>
                  </div>
                </Link>
              </li>
              <li className="py-2">
                <Link href="/sign_out" onClick={() => setIsOpen(false)}>
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-[#214933] cursor-pointer">
                  <LockClosedIcon className="h-6 w-6 text-white" />
                    <p className="hover:underline cursor-pointer">Sign Out</p>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}