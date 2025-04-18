'use client';

import React, { useState } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Inter, Proza_Libre } from 'next/font/google';

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function Footer() {
  const [showSubscribeForm, setShowSubscribeForm] = useState(false);

  const toggleSubscribeForm = () => {
    setShowSubscribeForm((prev) => !prev);
  };

  return (
    <footer className="text-white py-8">
      <div className={`container mx-auto px-4 text-center ${prozaLibre.className} border-t py-8 w-[720px]`}>

        {/* Social Media Links Section */}
        <div className="flex justify-center gap-4 mb-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors"
            aria-label="Facebook"
          >
            <FaFacebook size={24} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
            aria-label="Twitter"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 transition-colors"
            aria-label="Instagram"
          >
            <FaInstagram size={24} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={24} />
          </a>
        </div>

        {/* Subscribe to Newsletter Section */}
        <div className="mb-6 flex flex-col items-center">
          <div className="flex items-center gap-4">
            {/* Decorative Dots */}
            <span className="h-2 w-2 bg-white rounded-full"></span>
            <button
              onClick={toggleSubscribeForm}
              className="text-lg decoration-white hover:decoration-blue-500 hover:text-blue-500 transition-colors"
            >
              Subscribe to our Newsletter
            </button>
            <span className="h-2 w-2 bg-white rounded-full"></span>
          </div>

          {showSubscribeForm && (
            <form className="mt-4 flex flex-col gap-4 items-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="p-2 rounded-md text-black w-64 focus:outline-none focus:ring focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        {/* Footer Bottom Text */}
        <div className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Amplify Latinx. All rights reserved.
        </div>
      </div>
    </footer>
  );
}