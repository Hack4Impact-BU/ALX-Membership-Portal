'use client';
import React, { useState, useEffect } from 'react';
import { BookmarkIcon } from '@heroicons/react/outline';
import { Inter, Proza_Libre } from 'next/font/google';
import Hyperlinks from '@/components/Hyperlinks';
import axios from 'axios';
import LoadingScreen from '@/components/LoadingScreen';

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function SavedPage() {
  const [activeTab, setActiveTab] = useState('Offers');
  const [isLoading, setIsLoading] = useState(false);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Initialize with empty arrays instead of hardcoded data
  const [savedItems, setSavedItems] = useState({
    Events: [],
    Offers: [],
    Jobs: []
  });

  useEffect(() => {
    // Fetch all saved items when component mounts
    fetchSavedJobs();
    fetchSavedEvents();
    fetchSavedOffers();
  }, []);

  const getAuthToken = () => {
    const token = localStorage.getItem('accessToken') || 
                  localStorage.getItem('idToken') || 
                  localStorage.getItem('auth0Token') ||
                  localStorage.getItem('token');
                  
    if (!token) {
      console.warn('No authentication token found in storage');
    }
    
    return token;
  };

  // Function to generate random colors for items without assigned colors
  const getRandomColor = () => {
    const colors = ['#FF6F61', '#FFB74D', '#7986CB', '#FFD54F', '#A5D6A7', '#81D4FA', '#F48FB1'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Add this function at the top of your file with other utility functions
  const formatTimeOnly = (isoString) => {
    if (!isoString) return "TBD";
    
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "TBD";
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Existing fetchSavedJobs function
  const fetchSavedJobs = async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        console.error('No authentication token found!');
        setIsLoading(false);
        return;
      }
      
      const response = await axios.get(`${apiBaseUrl}/saved_jobs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Saved jobs response:', response.data);
      
      const savedJobs = response.data.map(job => ({
        id: job.id,
        title: job.title,
        description: job.company,
        details: job.location || 'Remote',
        salary: job.salary || 'Salary not specified',
        color: getRandomColor(),
        logo_url: job.logo_url,
      }));
      
      setSavedItems(prev => ({
        ...prev,
        Jobs: savedJobs
      }));
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // New function to fetch saved events
  const fetchSavedEvents = async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        console.error('No authentication token found!');
        setIsLoading(false);
        return;
      }
      
      const response = await axios.get(`${apiBaseUrl}/saved_events`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Saved events response:', response.data);
      
      const savedEvents = response.data.map(event => ({
        id: event.id,
        title: event.eventName || event.name,
        description: event.event_organizer || event.location,
        details: `Start Date: ${event.startDate || 'TBD'}`,
        color: getRandomColor(),
        image_url: event.image_url,
      }));
      
      setSavedItems(prev => ({
        ...prev,
        Events: savedEvents
      }));
    } catch (error) {
      console.error('Error fetching saved events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // New function to fetch saved offers/products
  const fetchSavedOffers = async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        console.error('No authentication token found!');
        setIsLoading(false);
        return;
      }
      
      const response = await axios.get(`${apiBaseUrl}/saved_product_offers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Saved offers response:', response.data);
      
      const savedOffers = response.data.map(offer => ({
        id: offer.id,
        title: offer.offerTitle || offer.name,
        description: offer.vendor || offer.provider,
        details: `Valid until ${offer.endDate || 'N/A'}`,
        color: getRandomColor(),
        image_url: offer.image_url,
      }));
      
      setSavedItems(prev => ({
        ...prev,
        Offers: savedOffers
      }));
    } catch (error) {
      console.error('Error fetching saved offers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsave = async (itemId, category) => {
    const token = getAuthToken();
    if (!token) {
      console.error('No authentication token found!');
      return;
    }
    
    try {
      // Choose endpoint based on category
      let endpoint;
      switch(category) {
        case 'Jobs':
          endpoint = `${apiBaseUrl}/jobs/${itemId}/save`;
          break;
        case 'Events':
          endpoint = `${apiBaseUrl}/eventlists/${itemId}/save`;
          break;
        case 'Offers':
          endpoint = `${apiBaseUrl}/products/${itemId}/save`;
          break;
        default:
          console.error('Unknown category:', category);
          return;
      }
      
      // Delete the saved item
      await axios.delete(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Update state to remove item
      setSavedItems(prev => ({
        ...prev,
        [category]: prev[category].filter(item => item.id !== itemId)
      }));
      
    } catch (error) {
      console.error(`Error unsaving ${category.toLowerCase()}:`, error);
    }
  };

  return (
    <div className="flex flex-col items-center bg-[#214933] min-h-screen w-10/12 p-8 mt-6 text-white">
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
        {isLoading && activeTab === 'Jobs' ? (
          <div className="flex-1 flex justify-center items-center">
            <LoadingScreen />
          </div>
        ) : (
          <div className={`flex ${prozaLibre.className} space-x-8 px-4`}>
            {savedItems[activeTab].length === 0 ? (
              <div className="flex justify-center items-center w-full p-8">
                <p className="text-white text-xl">No saved {activeTab.toLowerCase()} found.</p>
              </div>
            ) : (
              savedItems[activeTab].map((item) => (
                <div
                  key={item.id}
                  className="bg-[#F6F2E9] p-4 rounded-xl shadow-lg w-80 flex flex-col justify-between snap-center transition-transform duration-300 hover:scale-105"
                >
                  <div className="text-black">
                    {/* Show logo/image for any item type that has one */}
                    {(activeTab === 'Jobs' && item.logo_url) ? (
                      <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 mb-4">
                        <img 
                          src={item.logo_url} 
                          alt={`${item.title} logo`} 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                            e.target.parentElement.style.backgroundColor = item.color || "#FFA500";
                          }} 
                        />
                      </div>
                    ) : (activeTab === 'Events' && item.image_url) ? (
                      <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 mb-4">
                        <img 
                          src={item.image_url} 
                          alt={`${item.title} image`} 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                            e.target.parentElement.style.backgroundColor = item.color || "#FFA500";
                          }} 
                        />
                      </div>
                    ) : (activeTab === 'Offers' && item.image_url) ? (
                      <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 mb-4">
                        <img 
                          src={item.image_url} 
                          alt={`${item.title} image`} 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                            e.target.parentElement.style.backgroundColor = item.color || "#FFA500";
                          }} 
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-full mb-4" style={{ backgroundColor: item.color }}></div>
                    )}
                    
                    <div className="p-4 bg-white rounded-xl">
                      <p className="text-lg text-center">{item.title}</p>
                    </div>
                    <div className="px-2 py-4 rounded-lg space-y-3">
                      <p className="text-s italic mb-6">{item.description}</p>
                      <p className="text-s">
                        Location: {item.details}
                      </p>
                      {activeTab === 'Jobs' && (
                        <p className="text-s">
                          Salary: {item.salary}
                        </p>
                      )}
                    </div>  
                  </div>
                  <div className="flex justify-between items-center mt-6">
                    <div
                      className="cursor-pointer text-[#214933]"
                      onClick={() => handleUnsave(item.id, activeTab)}
                    >
                      <BookmarkIcon />
                    </div>
                    {activeTab === 'Jobs' ? (
                      <a href={`/job_postings/${item.id}`} className="text-blue-600 hover:underline text-xs">See Job</a>
                    ) : activeTab === 'Events' ? (
                      <a href={`/events/event_listings/${item.id}`} className="text-blue-600 hover:underline text-xs">See Event</a>
                    ) : (
                      <a href={`/product_offers/${item.id}`} className="text-blue-600 hover:underline text-xs">See Offer</a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <Hyperlinks />
    </div>
  );
}