'use client';
import React, { useState, useEffect } from 'react';
import { FolderIcon } from '@heroicons/react/outline';
import { Proza_Libre } from 'next/font/google';
import DropdownCard from '@/components/DropdownCards/DropwdownCards';
import EventCard from './component/card';
import Training from './component/training';
import ReusableHeader from '@/components/ReusableHeader/ReusableHeader';
import DropdownCardAdmin from '@/components/DropDrownAdmin/DropDownCardsAdmin';
import Hyperlinks from '@/components/Hyperlinks';

import { useAdmin } from "@/middleware/useAdmin";

const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

// Extracted filter component for better organization
const EventFilters = ({ 
  searchTerm, setSearchTerm, 
  filters, setFilters, 
  filterOptions, 
  resetFilters,
  resultCount 
}) => (
  <>
    <input
      type="text"
      placeholder="Search by event name"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-1/5 p-3 pl-8 rounded-lg bg-[#335843] text-white placeholder-grey-300 mb-6"
    />
    <div className="grid grid-cols-4 gap-4 w-5/6 mb-4">
      {[
        { key: 'eventType', label: 'Event Type', options: filterOptions.eventTypes },
        { key: 'date', label: 'Date', options: filterOptions.months },
        { key: 'city', label: 'City', options: filterOptions.cities },
        { key: 'category', label: 'Category', options: filterOptions.categories }
      ].map(({ key, label, options }) => (
        <div key={key} className="flex flex-col">
          <label className="text-white mb-2">{label}</label>
          <select 
            className="px-6 py-4 bg-[#335843] text-white rounded-lg w-full"
            value={filters[key]}
            onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
          >
            <option value="">
              {label === 'City' ? 'All Cities' : label === 'Category' ? 'All Categories' : `All ${label}s`}
            </option>
            {options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
    
    <button 
      onClick={resetFilters}
      className="px-6 py-2 bg-[#F6F2E9] text-[#214933] rounded-lg mb-6 hover:bg-[#e5e0d5] transition-colors"
    >
      Reset Filters
    </button>
    
    <div className="w-full mb-4">
      <p className="text-[#F6F2E9]">
        {resultCount} {resultCount === 1 ? 'event' : 'events'} found
      </p>
    </div>
  </>
);

export default function Archive() {
  const { isAdmin, isLoading } = useAdmin();

  const [activeTab, setActiveTab] = useState('Previous Events');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Consolidated filter state
  const [filters, setFilters] = useState({
    eventType: '',
    date: '',
    city: '',
    category: ''
  });
  
  // Content states
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [researchData, setResearchData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI states
  const [expandedCard, setExpandedCard] = useState(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  // Filter options
  const [filterOptions, setFilterOptions] = useState({
    eventTypes: [],
    cities: [],
    categories: [],
    months: [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
  });

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        if (activeTab === 'Research Work') {
          await fetchResearch();
        } else if (activeTab === 'Recorded Trainings') {
          await fetchTraining();
        } else {
          await fetchEvents();
        }
      } catch (err) {
        console.error(`Error fetching ${activeTab}:`, err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab]);

  // Fetch research data
  const fetchResearch = async () => {
    const response = await fetch(`${apiBaseUrl}/research`);
    if (!response.ok) throw new Error("Failed to fetch research");
    const data = await response.json();
    setResearchData(data);
  };

  // Fetch training data
  const fetchTraining = async () => {
    const response = await fetch(`${apiBaseUrl}/training`);
    if (!response.ok) throw new Error("Failed to fetch trainings");
    const data = await response.json();
    setTrainings(data);
  };

  // Fetch events data
  const fetchEvents = async () => {
    const response = await fetch(`${apiBaseUrl}/eventlists`);
    if (!response.ok) throw new Error("Failed to fetch events");
    const data = await response.json();

    const currentDate = new Date();
    const pastEvents = data.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate < currentDate;
    });

    console.log('Fetched past events:', pastEvents);

    setEvents(pastEvents);
    setFilteredEvents(pastEvents);
    
    // Extract unique values for filter dropdowns
    setFilterOptions(prev => ({
      ...prev,
      eventTypes: [...new Set(pastEvents.map(event => event.eventType).filter(Boolean))],
      cities: [...new Set(pastEvents.map(event => event.location).filter(Boolean))],
      categories: [...new Set(pastEvents.map(event => event.category).filter(Boolean))]
    }));
  };

  // Filter events when search term or filter values change
  useEffect(() => {
    if (events.length > 0) {
      const filtered = events.filter(event => {
        // Text search filter
        const matchesSearch = !searchTerm || 
          (event.eventName && event.eventName.toLowerCase().includes(searchTerm.toLowerCase()));
        
        // Event type filter
        const matchesEventType = !filters.eventType || 
          (event.eventType && event.eventType === filters.eventType);
        
        // Date filter (by month)
        const matchesDate = !filters.date || 
          (event.startDate && new Date(event.startDate).toLocaleString('default', { month: 'long' }) === filters.date);
        
        // City filter
        const matchesCity = !filters.city || 
          (event.location && event.location === filters.city);
        
        // Category filter
        const matchesCategory = !filters.category || 
          (event.category && event.category === filters.category);
        
        return matchesSearch && matchesEventType && matchesDate && matchesCity && matchesCategory;
      });
      
      console.log('Filtered events:', filtered);
      setFilteredEvents(filtered);
    }
  }, [searchTerm, filters, events]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      eventType: '',
      date: '',
      city: '',
      category: ''
    });
  };

  const toggleExpandCard = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const handleDeleteClick = (id) => {
    if (activeTab === 'Research Work') {
      setResearchData(researchData.filter(item => item.id !== id));
    } else if (activeTab === 'Recorded Trainings') {
      setTrainings(trainings.filter(item => item.id !== id));
    }
  };

  const tabUrls = {
    'Previous Events': '/events/event_listings/create',
    "Research Work": '/archive/createResearch',
    'Recorded Trainings': '/archive/createTraining',
  };

  // Render content based on active tab
  const renderContent = () => {
    if (activeTab === 'Research Work') {
      return researchData.map((item, index) => (
        isAdmin ? (
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
        ) : (
          <DropdownCard
            key={item.id}
            item={item}
            index={index}
            expandedCard={expandedCard}
            toggleExpandCard={toggleExpandCard}
            isDeleteMode={isDeleteMode}
            handleDeleteClick={handleDeleteClick}
            fontName={prozaLibre.className}
          />
        )
      ));
    } 
    
    if (activeTab === 'Recorded Trainings') {
      return trainings.map((item, index) => (
        <Training
          key={item.id}
          item={item}
          index={index}
          expandedCard={expandedCard}
          toggleExpandCard={toggleExpandCard}
          isDeleteMode={isDeleteMode}
          handleDeleteClick={handleDeleteClick}
          fontName={prozaLibre.className}
          isAdmin={isAdmin}
        />
      ));
    }
    
    // Previous Events tab
    return (
      <div className="w-full overflow-x-auto flex space-x-6 snap-x snap-mandatory scrollbar-hide border-y-2 py-16">
        {console.log('Rendering filteredEvents:', filteredEvents)}
        {filteredEvents.length > 0 ? (
          <div className={`flex ${prozaLibre.className} space-x-8 px-4`}>
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                saved={event.saved}
                {...event}
              />
            ))}
          </div>
        ) : (
          <div className={`w-full flex justify-center items-center py-8 ${prozaLibre.className}`}>
            <p className="text-[#F6F2E9] text-xl">No events match your filters. Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center bg-[#214933] min-h-screen w-10/12 p-8 mt-6 text-white">
      {/* Header */}
      <div className="flex w-full">
        <FolderIcon className="h-32 w-32 stroke-[#F6F2E9]" />
        <ReusableHeader header={"Archive"} isAdmin={isAdmin} directTo={tabUrls[activeTab]}/>
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

        {/* Filters - only show for Previous Events tab */}
        {activeTab === 'Previous Events' && (
          <EventFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filters={filters}
            setFilters={setFilters}
            filterOptions={filterOptions}
            resetFilters={resetFilters}
            resultCount={filteredEvents.length}
          />
        )}
      </div>

      {/* Content based on active tab */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-[#F6F2E9] text-xl">Loading...</p>
        </div>
      ) : renderContent()}
      <div className='w-10/12'><Hyperlinks /></div>
    </div>
  );
}
