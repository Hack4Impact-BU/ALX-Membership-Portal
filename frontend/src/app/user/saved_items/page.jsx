'use client';
import React, { useState } from 'react';
import { BookmarkIcon } from '@heroicons/react/outline';
import { Inter, Proza_Libre } from 'next/font/google';

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function SavedPage() {
  const [activeTab, setActiveTab] = useState('Offers');

  const initialSavedItems = {
    Events: [
      { id: 1, title: 'Live Concert', description: 'Downtown Stage', details: 'Event on 10/25 at 8 PM', color: '#FF6F61' },
      { id: 2, title: 'Art Exhibition', description: 'Modern Art Gallery', details: 'Exhibit opens 10/30', color: '#FFB74D' },
    ],
    Offers: [
      { id: 3, title: '20% off tickets', description: 'Museum of Fine Arts', details: 'Valid until 9/25', color: '#7986CB' },
      { id: 4, title: '15% off coffee', description: 'Café Aroma', details: 'Valid until 10/10', color: '#FFD54F' },
      { id: 5, title: 'Buy 1 Get 1', description: 'City Bookstore', details: 'Valid until 11/01', color: '#A5D6A7' },
      { id: 6, title: 'Buy 1 Get 1', description: 'City Bookstore', details: 'Valid until 11/01', color: '#A5D6A7' },
      { id: 7, title: 'Buy 1 Get 1', description: 'City Bookstore', details: 'Valid until 11/01', color: '#A5D6A7' }
    ],
    Jobs: [
      { id: 6, title: 'Software Engineer', description: 'Tech Corp', details: 'Location: SF, Full-Time', color: '#64B5F6' },
      { id: 7, title: 'UI Designer', description: 'Creative Studio', details: 'Location: NY, Part-Time', color: '#FF8A65' },
    ]
  };

  const [savedItems, setSavedItems] = useState(initialSavedItems);

  const handleUnsave = (itemId, category) => {
    setSavedItems((prevItems) => ({
      ...prevItems,
      [category]: prevItems[category].filter((item) => item.id !== itemId)
    }));
  };

  return (
    <div className="flex flex-col items-center bg-[#214933] min-h-screen w-10/12 p-8 text-white">
      {/* Header */}
      <div className="flex items-center mb-6 w-full">
        <BookmarkIcon className="h-32 w-32 mr-4" />
        <h1 className="pt-6 text-[80px] font-bold font-custom items-center">Saved</h1>
      </div>

      <div className={`flex flex-col items-start pl-8 my-12 w-full ${prozaLibre.className}`}>
        <h2 className="text-xl mb-2">Sort Saved:</h2>
        <div className="flex space-x-4">
          {['Events', 'Offers', 'Jobs'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 rounded-lg text-lg ${
                activeTab === tab ? 'bg-[#F6F2E9] text-black' : 'bg-[#335843] text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Saved Items Grid with Horizontal Scroll */}
      <div className="w-full overflow-x-auto flex space-x-6 snap-x snap-mandatory scrollbar-hide border-y-2 py-16">
        <div className={`flex ${prozaLibre.className} space-x-8 px-4`}>
          {savedItems[activeTab].map((item) => (
            <div
              key={item.id}
              className="bg-[#F6F2E9] p-4 rounded-xl shadow-lg w-80 flex flex-col justify-between snap-center transition-transform duration-300 hover:scale-105"
            >
              <div className="text-black">
                <div className="h-12 w-12 rounded-full mb-4" style={{ backgroundColor: item.color }}></div> {/* Circle */}
                <div className="p-4 bg-white rounded-xl">
                  <p className="text-lg text-center">{item.title}</p>
                </div>
                <div className="px-2 py-4 rounded-lg">
                  <p className="text-s">Details: {item.details}</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div
                  className="cursor-pointer text-[#214933]"
                  onClick={() => handleUnsave(item.id, activeTab)}
                >
                  <BookmarkIcon />
                </div>
                <a href="#" className="text-blue-600 hover:underline text-xs">See More</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}