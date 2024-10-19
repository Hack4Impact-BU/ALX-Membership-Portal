'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Inter, Proza_Libre } from 'next/font/google'; // Import the Proza Libre font

// Import simple white icons from Heroicons
import { CalendarIcon, GiftIcon, ClipboardIcon, UserGroupIcon, BookmarkIcon, UserIcon, LockClosedIcon } from '@heroicons/react/outline';

// Initialize Proza Libre font
const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState("/"); // State to track the active section

  // Function to handle click and set the active section
  const handleLinkClick = (path) => {
    setActiveSection(path);
  };

  const linkClasses = (path) =>
    `flex items-center space-x-2 p-2 w-full rounded-lg transition-all duration-200 ease-in-out cursor-pointer ${
      activeSection === path ? "bg-[#214933]" : "hover:bg-[#214933]"
    }`;

  return (
    <div className={`fixed top-0 left-0 w-64 bg-[#335843] text-white shadow-md h-screen ${prozaLibre.className}`}>
      <div className="flex flex-col justify-between h-full p-4">
        {/* Top Section */}
        <div>
          <div className="h-16 mb-4">
            <div className="bg-gray-800 h-full w-full"></div>
          </div>
          <ul className="space-y-4">
            <li onClick={() => handleLinkClick("/")}>
              <Link href="/">
                <div className={linkClasses("/")}>
                  <CalendarIcon className="h-6 w-6 text-white" />
                  <p>Events & Lessons</p>
                </div>
              </Link>
            </li>
            <li onClick={() => handleLinkClick("/benefits_discounts")}>
              <Link href="/benefits_discounts">
                <div className={linkClasses("/benefits_discounts")}>
                  <GiftIcon className="h-6 w-6 text-white" />
                  <p>Product Offers</p>
                </div>
              </Link>
            </li>
            <li onClick={() => handleLinkClick("/job_postings")}>
              <Link href="/job_postings">
                <div className={linkClasses("/job_postings")}>
                  <ClipboardIcon className="h-6 w-6 text-white" />
                  <p>Job Board</p>
                </div>
              </Link>
            </li>
            <li onClick={() => handleLinkClick("/user/account_settings")}>
              <Link href="/user/get_involved">
                <div className={linkClasses("/user/account_settings")}>
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
            <li onClick={() => handleLinkClick("/user/saved_items")}>
              <Link href="/user/saved_items">
                <div className={linkClasses("/user/saved_items")}>
                  <BookmarkIcon className="h-6 w-6 text-white" />
                  <p>Saved</p>
                </div>
              </Link>
            </li>
            <li onClick={() => handleLinkClick("/user/profile")}>
              <Link href="/user/profile">
                <div className={linkClasses("/user/profile")}>
                  <UserIcon className="h-6 w-6 text-white" />
                  <p>Profile</p>
                </div>
              </Link>
            </li>
            <li onClick={() => handleLinkClick("/sign_out")}>
              <Link href="/sign_out">
                <div className={linkClasses("/sign_out")}>
                  <LockClosedIcon className="h-6 w-6 text-white" />
                  <p>Sign Out</p>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}