'use client';
import React, { useState, useEffect } from 'react';
import { FolderIcon, BookmarkIcon } from '@heroicons/react/outline';
import { Inter, Proza_Libre } from 'next/font/google';
import DropdownCard from '@/components/DropdownCards/DropwdownCards';
import EventCard from './component/card';
import Training from './component/training';
import ReusableHeader from '@/components/ReusableHeader/ReusableHeader';
import DropdownCardAdmin from '@/components/DropDrownAdmin/DropDownCardsAdmin';

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function Archive() {
  const [activeTab, setActiveTab] = useState('Previous Events');
  const [searchTerm, setSearchTerm] = useState('');

  const [expandedCard, setExpandedCard] = useState(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const [events, setEvent] = useState([])
  const [trainings, setTrainings] = useState([])
  const [data, setData] = useState([])

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
      const fetchResearch = async () => {
        try {
          const response = await fetch(`${apiBaseUrl}/research`); // Adjust endpoint URL as needed
          if (!response.ok) throw new Error("Failed to fetch events");
  
          const data = await response.json(); // Parse JSON response
          console.log(data)
          setData(data);
          setLoading(false);
        } catch (err) {
        }
      };
  
      fetchResearch();
    }, []);

    useEffect(() => {
      const fetchTraining = async () => {
        try {
          const response = await fetch(`${apiBaseUrl}/training`);
          if (!response.ok) throw new Error("failed to fetch trainigns");

          const data = await response.json();
          setTrainings(data);
          setLoading(false);
        } catch (err) {
        }
      };
      fetchTraining();
    }, []);

    useEffect(() => {
      const fetchEvents = async () => {
        try {
          const response = await fetch(`${apiBaseUrl}/eventlists`);
          if (!response.ok) throw new Error("Failed to fetch events");

          const data = await response.json();

          const currentDate = new Date();

          const pastEvents = data.filter((event) => {
            const eventDate = new Date(event.startDate);
            return eventDate < currentDate;
          });

          setEvent(pastEvents);
          setLoading(false);

        } catch (err){
        }
      };

      fetchEvents();
    }, []);

  const toggleExpandCard = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const handleDeleteClick = (id) => {
    setData(data.filter(item => item.id !== id));
  };

  const handleUnsave = (itemId, category) => {
    setSavedItems((prevItems) => ({
      ...prevItems,
      [category]: prevItems[category].filter((item) => item.id !== itemId)
    }));
  };

  const tabUrls = {
    'Previous Events': '/events/event_listings/create',
    "Research Work": '/archive/createResearch',
    'Recorded Trainings': '/archive/createTraining',
  }

  return (
    <div className="flex flex-col items-center bg-[#214933] min-h-screen w-10/12 p-8 mt-6 text-white">
      {/* Header */}
      <div className="flex w-full">
        <FolderIcon className="h-32 w-32 stroke-[#F6F2E9]" />
        <ReusableHeader header={"Archive"} isAdmin={true} directTo={tabUrls[activeTab]}/>
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

        {activeTab === 'Previous Events' ? (
// search bar
          <>
            <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/5 p-3 pl-8 rounded-lg bg-[#335843] text-white placeholder-grey-300 mb-6"
          />
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
          </>
        ) : null}

        {/* Dropdown Selection Inputs */}

      </div>

      {/* Saved Items Grid with Horizontal Scroll */}
      {
      activeTab === 'Research Work' ? (
        // Render DropdownCard components for Research Work
        data.map((item, index) => (
          <DropdownCardAdmin
            key={item.id}
            item={item}
            index={index}
            expandedCard={expandedCard}
            toggleExpandCard={toggleExpandCard}
            isDeleteMode={isDeleteMode}
            handleDeleteClick={handleDeleteClick}
            fontName={prozaLibre.className}
          />
        ))
      ) : activeTab === 'Recorded Trainings' ? (

        trainings.map((item,index) => (
          <Training
          key={item.id}
          item={item}
          index={index}
          expandedCard={expandedCard}
          toggleExpandCard={toggleExpandCard}
          isDeleteMode={isDeleteMode}
          handleDeleteClick={handleDeleteClick}
          fontName={prozaLibre.className}
          ></Training>
        ))


      ):(
        // Render Horizontal Scroll Item Grid for other tabs
        <div className="w-full overflow-x-auto flex space-x-6 snap-x snap-mandatory scrollbar-hide border-y-2 py-16">
          <div className={`flex ${prozaLibre.className} space-x-8 px-4`}>
            {events.map((event) => (
              <EventCard
                key={event.id}
                saved={event.saved}
                {...event}
              ></EventCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
