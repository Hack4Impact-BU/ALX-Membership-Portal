'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FiMenu } from 'react-icons/fi'; // Import an icon for the button

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null); // Create a ref for the sidebar

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar visibility
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false); // Close the sidebar if clicked outside
      }
    };

    // Add event listener when sidebar is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div>
      {/* Button to toggle sidebar visibility, positioned at the bottom left */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-4 left-4 p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none shadow-lg"
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef} // Attach the ref to the sidebar div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-md transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-semibold">Sidebar</h2>
          <ul className="mt-4">
            <li className="py-2">
              <Link href="/" onClick={() => setIsOpen(false)}>
                <p className="hover:underline cursor-pointer">Home</p>
              </Link>
            </li>
            <li className="py-2">
              <Link href="/events/event_listings" onClick={() => setIsOpen(false)}>
                <p className="hover:underline cursor-pointer">Events</p>
              </Link>
            </li>
            <li className="py-2">
              <Link href="/job_postings" onClick={() => setIsOpen(false)}>
                <p className="hover:underline cursor-pointer">Job Board</p>
              </Link>
            </li>
            <li className="py-2">
              <Link href="/user/account_settings" onClick={() => setIsOpen(false)}>
                <p className="hover:underline cursor-pointer">Account</p>
              </Link>
            </li>
            <li className="py-2">
              <Link href="/benefits_discounts" onClick={() => setIsOpen(false)}>
                <p className="hover:underline cursor-pointer">Benefits</p>
              </Link>
            </li>
            <li className="py-2">
              <Link href="/user/notifications" onClick={() => setIsOpen(false)}>
                <p className="hover:underline cursor-pointer">Notifications</p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}