'use client';
import React, { useState } from 'react';
import { FolderIcon, BookmarkIcon } from '@heroicons/react/outline';
import { Inter, Proza_Libre } from 'next/font/google';

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function Archive() {
  const [activeTab, setActiveTab] = useState('Previous Events');
  const [searchTerm, setSearchTerm] = useState('');

  const initialSavedItems = {
    "Previous Events": [
      { id: 1, title: 'Community Festival', description: 'Central Park', details: 'Held on 05/12/2023', color: '#FF6F61' },
      { id: 2, title: 'Tech Meetup', description: 'Innovation Hub', details: 'Held on 06/15/2023', color: '#FFB74D' },
      { id: 3, title: 'Charity Run', description: 'Downtown', details: 'Held on 04/10/2023', color: '#7986CB' },
      { id: 4, title: 'Outdoor Concert', description: 'City Amphitheater', details: 'Held on 08/20/2023', color: '#A5D6A7' },
      { id: 5, title: 'Art Exhibition', description: 'Gallery Lane', details: 'Held on 09/15/2023', color: '#FFD54F' },
      { id: 6, title: 'Business Seminar', description: 'Conference Center', details: 'Held on 10/22/2023', color: '#64B5F6' },
    ],
    "Research Work": [
      { id: 7, title: 'AI in Healthcare', description: 'Research Paper', details: 'Published on 03/10/2023', color: '#FF8A65' },
      { id: 8, title: 'Climate Change Impact', description: 'Journal Article', details: 'Published on 05/05/2023', color: '#7986CB' },
      { id: 9, title: 'Quantum Computing', description: 'White Paper', details: 'Published on 07/14/2023', color: '#A5D6A7' },
      { id: 10, title: 'Urban Development', description: 'Case Study', details: 'Published on 06/20/2023', color: '#FFB74D' },
      { id: 11, title: 'Renewable Energy', description: 'Research Report', details: 'Published on 08/12/2023', color: '#FFD54F' },
      { id: 12, title: 'Blockchain Technology', description: 'Technical Document', details: 'Published on 09/30/2023', color: '#64B5F6' },
    ],
    "Recorded Trainings": [
      { id: 13, title: 'Project Management Basics', description: 'Video Tutorial', details: 'Recorded on 02/15/2023', color: '#FF6F61' },
      { id: 14, title: 'Advanced Python Programming', description: 'Webinar', details: 'Recorded on 04/20/2023', color: '#FF8A65' },
      { id: 15, title: 'Data Science Workshop', description: 'Workshop Recording', details: 'Recorded on 06/18/2023', color: '#7986CB' },
      { id: 16, title: 'Leadership Skills', description: 'Seminar Recording', details: 'Recorded on 05/22/2023', color: '#A5D6A7' },
      { id: 17, title: 'Effective Communication', description: 'Training Video', details: 'Recorded on 07/12/2023', color: '#FFB74D' },
      { id: 18, title: 'Intro to Cybersecurity', description: 'Workshop Video', details: 'Recorded on 09/08/2023', color: '#FFD54F' },
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
    <div className="flex flex-col items-center bg-[#214933] min-h-screen w-10/12 p-8 mt-6 text-white">
      {/* Header */}
      <div className="flex items-center mb-6 w-full">
        <FolderIcon className="h-32 w-32 mr-4 stroke-[#F6F2E9]" />
        <h1 className="pt-6 text-[70px] text-[#F6F2E9] font-custom items-center">Archive</h1>
      </div>

      <div className={`flex flex-col items-start pl-8 my-12 w-full ${prozaLibre.className}`}>
        <h2 className="text-xl mb-2 text-[#F6F2E9]">Archived Section:</h2>
        <div className="flex space-x-4 mb-6">
          {['Previous Events', 'Research Work', 'Recorded Trainings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 rounded-lg text-lg ${
                activeTab === tab ? 'bg-[#F6F2E9] text-[#214933]' : 'bg-[#335843] text-[#F6F2E9]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/5 p-3 pl-8 rounded-lg bg-[#335843] text-white placeholder-grey-300 mb-6"
        />

        {/* Dropdown Selection Inputs */}
        <div className="grid grid-cols-4 gap-4 w-5/6">
          {["Event Type", "Date", "City", "Category"].map((label, index) => (
            <div key={index} className="flex flex-col">
              <label className="text-white mb-2">{label}</label>
              <select className="px-6 py-4 bg-[#335843] text-gray-400 rounded-lg w-full">
                <option value="">{`Select ${label}`}</option>
                {/* Add options for each dropdown as needed */}
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
            </div>
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
                <div className="h-12 w-12 rounded-full mb-4" style={{ backgroundColor: item.color }}></div>
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
      <div className={`flex ${prozaLibre.className} flex-col w-full border h-[15rem]`}>
        <p className='text-[34px]'>Past Research 1</p>
        <p className='text-[20px]'>Description</p>
        
      </div>
    </div>
  );
}