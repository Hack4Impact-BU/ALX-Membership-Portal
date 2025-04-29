'use client';
import React, { useState } from 'react';
import { Inter, Proza_Libre } from 'next/font/google';

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function TermsAndConditions({ onAccept, onClose }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleAccept = () => {
    if (isChecked) {
      onAccept();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#214933] text-white p-8 max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className={`text-4xl font-bold ${prozaLibre.className}`}>Terms and Conditions</h1>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        
        <div className="bg-[#F6F2E9] text-black p-8 rounded-lg shadow-lg">
          <section className="mb-8">
            <h2 className={`text-2xl font-semibold mb-4 ${prozaLibre.className}`}>1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using the ALX Membership Portal, you agree to be bound by these Terms and Conditions. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-semibold mb-4 ${prozaLibre.className}`}>2. User Account</h2>
            <p className="mb-4">
              You are responsible for maintaining the confidentiality of your account information and for all activities 
              that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-semibold mb-4 ${prozaLibre.className}`}>3. Privacy Policy</h2>
            <p className="mb-4">
              Your use of the ALX Membership Portal is also governed by our Privacy Policy. Please review our Privacy Policy, 
              which also governs the site and informs users of our data collection practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-semibold mb-4 ${prozaLibre.className}`}>4. User Conduct</h2>
            <p className="mb-4">
              You agree not to use the service to:
            </p>
            <ul className="list-disc ml-8 mb-4">
              <li>Violate any laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Post or transmit any unauthorized commercial communications</li>
              <li>Engage in any activity that interferes with or disrupts the service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-semibold mb-4 ${prozaLibre.className}`}>5. Intellectual Property</h2>
            <p className="mb-4">
              All content included on this site, such as text, graphics, logos, button icons, images, audio clips, 
              digital downloads, data compilations, and software, is the property of ALX or its content suppliers 
              and protected by international copyright laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-semibold mb-4 ${prozaLibre.className}`}>6. Limitation of Liability</h2>
            <p className="mb-4">
              ALX shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
              or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, 
              use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-semibold mb-4 ${prozaLibre.className}`}>7. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these terms at any time. We will notify users of any material changes 
              by posting the new Terms and Conditions on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-semibold mb-4 ${prozaLibre.className}`}>8. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms and Conditions, please contact us at:
              <br />
              Email: support@alx.com
              <br />
              Phone: (555) 123-4567
            </p>
          </section>

          {/* Terms Acceptance Checkbox and Button */}
          <div className="flex flex-col items-center gap-4 mt-8">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-black">I have read and agree to the Terms and Conditions</span>
            </label>
            <button
              onClick={handleAccept}
              disabled={!isChecked}
              className={`px-8 py-3 rounded-lg transition-colors ${
                isChecked 
                  ? 'bg-black text-white hover:bg-gray-800' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Accept Terms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 