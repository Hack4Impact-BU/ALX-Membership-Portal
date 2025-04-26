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
    Jobs: [] // Will be populated from API
  };

  const [savedItems, setSavedItems] = useState(initialSavedItems);

  // Get auth token helper function - same as in member.jsx
  const getAuthToken = () => {
    // Try different token storage locations
    const token = localStorage.getItem('accessToken') || 
                  localStorage.getItem('idToken') || 
                  localStorage.getItem('auth0Token') ||
                  localStorage.getItem('token');
                  
    if (!token) {
      console.warn('No authentication token found in storage');
    } else {
      console.log('Found authentication token:', token.substring(0, 10) + '...');
    }
    
    return token;
  };
  
  // Get auth headers helper function
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch saved jobs when component mounts or activeTab changes to 'Jobs'
  useEffect(() => {
    if (activeTab === 'Jobs') {
      fetchSavedJobs();
    }
  }, [activeTab]);

  const fetchSavedJobs = async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        console.error('No authentication token found!');
        setIsLoading(false);
        return;
      }
      
      // Use authorization header for request
      const response = await axios.get(`${apiBaseUrl}/saved_jobs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Saved jobs response:', response.data);
      
      // Transform the job data to match your card format
      const savedJobs = response.data.map(job => ({
        id: job.id,
        title: job.title,
        description: job.company,
        details: `${job.location || 'Remote'} • ${job.salary || 'Salary not specified'}`,
        color: getRandomColor(), // Generate a color for each job
        logo_url: job.logo_url,  // Add this line to include logo URL
      }));
      
      setSavedItems(prev => ({
        ...prev,
        Jobs: savedJobs
      }));
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      // You might want to show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to generate random colors for job cards
  const getRandomColor = () => {
    const colors = ['#64B5F6', '#FF8A65', '#7986CB', '#A5D6A7', '#FFD54F'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleUnsave = async (itemId, category) => {
    if (category === 'Jobs') {
      try {
        const token = getAuthToken();
        if (!token) {
          console.error('No authentication token found!');
          return;
        }
        
        // Use token for unsave request
        await axios.delete(`${apiBaseUrl}/jobs/${itemId}/save`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // Remove from local state after successful API call
        setSavedItems((prevItems) => ({
          ...prevItems,
          [category]: prevItems[category].filter((item) => item.id !== itemId)
        }));
      } catch (error) {
        console.error('Error unsaving job:', error);
      }
    } else {
      // For hardcoded items (Events, Offers), just update the state
      setSavedItems((prevItems) => ({
        ...prevItems,
        [category]: prevItems[category].filter((item) => item.id !== itemId)
      }));
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
                    {activeTab === 'Jobs' && item.logo_url ? (
                      <img 
                        src={item.logo_url} 
                        alt={`${item.title} logo`} 
                        className="h-12 w-12 rounded-full object-cover mb-4" 
                        onError={(e) => {
                          console.log("Logo failed to load:", item.logo_url);
                          e.target.onerror = null;
                          e.target.style.display = "none";
                          // Fallback to colored circle
                          e.target.parentElement.innerHTML = `<div class="h-12 w-12 rounded-full mb-4" style="background-color: ${item.color || '#FFA500'}"></div>`;
                        }}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full mb-4" style={{ backgroundColor: item.color }}></div>
                    )}
                    <div className="p-4 bg-white rounded-xl">
                      <p className="text-lg text-center">{item.title}</p>
                    </div>
                    <div className="px-2 py-4 rounded-lg">
                      <p className="text-s">{item.description}</p>
                      <p className="text-s mt-2">Details: {item.details}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div
                      className="cursor-pointer text-[#214933]"
                      onClick={() => handleUnsave(item.id, activeTab)}
                    >
                      <BookmarkIcon />
                    </div>
                    {activeTab === 'Jobs' ? (
                      <a href={`/job_postings/${item.id}`} className="text-blue-600 hover:underline text-xs">See Job</a>
                    ) : (
                      <a href="#" className="text-blue-600 hover:underline text-xs">See More</a>
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