'use client';
import React from 'react';
import { Inter, Proza_Libre } from 'next/font/google';

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

import { QuestionMarkCircleIcon } from '@heroicons/react/outline';

export default function Questions() {
  return (
    <div className="flex flex-col w-10/12 text-white items-center min-h-screen p-8">
        {/* Top Left Icon and FAQ Title */}
        <div className="flex text-left gap-4 w-full">
            <QuestionMarkCircleIcon className="h-32 w-32 text-white mx-4" />
            <h1 className="text-8xl font-bold font-custom pt-8">FAQ's / Help</h1>
        </div>
        
      <div className="max-w-5xl rounded-lg p-8">
        {/* Contact Section */}
        <div className={`bg-[#F5F3EB] text-[#214933] rounded-lg p-6 my-6 ${prozaLibre.className}`}>
          <h2 className="text-2xl font-bold underline">Contact us:</h2>
          <div className="flex flex-col gap-4 mt-4">
            <button className="bg-green-900 text-white py-2 px-4 rounded-full flex items-center gap-2 w-24">
              <span>Email</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16v16H4z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </button>
            <a href="mailto:info@amplifylatinx.org" className="text-blue-600 hover:underline">
              info@amplifylatinx.org
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className={`bg-[#F5F3EB] text-green-900 rounded-lg p-6 ${prozaLibre.className}`}>
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions:</h2>
          <div className="space-y-4">
            <div>
              <p className="font-semibold">Q: “How can I cancel my membership?”</p>
              <p className="ml-4">A: Navigate to the profile page by selecting it in the sidebar to the left. From there you should see a “Cancel Membership” button.</p>
            </div>
            <div>
              <p className="font-semibold">Q:</p>
              <p className="ml-4">A:</p>
            </div>
            <div>
              <p className="font-semibold">Q:</p>
              <p className="ml-4">A:</p>
            </div>
            <div>
              <p className="font-semibold">Q:</p>
              <p className="ml-4">A:</p>
            </div>
            <div>
              <p className="font-semibold">Q:</p>
              <p className="ml-4">A:</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}