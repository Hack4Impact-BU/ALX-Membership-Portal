'use client';
import React, { useState, useEffect, useMemo } from 'react';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import { Inter, Proza_Libre } from 'next/font/google';
import axios from 'axios';
import LoadingScreen from '@/components/LoadingScreen';
import Hyperlinks from '@/components/Hyperlinks';
import SearchIcon from '@mui/icons-material/Search';

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function JobBoardMember() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // New filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [minSalary, setMinSalary] = useState('');

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Get auth token helper function - UPDATED with more debug logging
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

  useEffect(() => {
    console.log('Component mounted, fetching jobs...');
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    const startTime = Date.now();
    
    try {
      // Include auth headers to get personalized saved status
      const headers = getAuthHeaders();
      console.log('Fetching jobs with auth headers:', Object.keys(headers).length > 0);
      
      const response = await axios.get(`${apiBaseUrl}/jobs`, { headers });
      
      const result = response.data;
      console.log(`Fetched ${result.length} jobs, checking saved status...`);
      
      // Log some info about saved status
      const savedCount = result.filter(job => job.is_saved).length;
      console.log(`Found ${savedCount} saved jobs out of ${result.length} total`);
      
      const elapsed = Date.now() - startTime;
      const minDelay = 300;
      const remainingDelay = minDelay - elapsed;
      
      if (remainingDelay > 0) {
        setTimeout(() => {
          setJobs(result);
          if (result.length > 0) {
            setSelectedJob(result[0]);
          }
          setIsLoading(false);
        }, remainingDelay);
      } else {
        setJobs(result);
        if (result.length > 0) {
          setSelectedJob(result[0]);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setIsLoading(false);
    }
  };

  const formatRequirementsAsList = (requirementsText) => {
    if (!requirementsText) return [];
    return requirementsText.split('. ').filter(item => item.trim());
  };

  // Improved toggleBookmark function with better error handling
  const toggleBookmark = async (jobId) => {
    try {
      // Find the job in the current jobs state
      const job = jobs.find(j => j.id === jobId);
      if (!job) return;
      
      const isSaved = job.is_saved;
      
      // Optimistically update UI
      const updatedJobs = jobs.map(job => {
        if (job.id === jobId) {
          const updatedJob = { ...job, is_saved: !job.is_saved };
          
          // If this is the selected job, update that too
          if (selectedJob && selectedJob.id === jobId) {
            setSelectedJob(updatedJob);
          }
          
          return updatedJob;
        }
        return job;
      });
      
      // Update the jobs state immediately for responsive UI
      setJobs(updatedJobs);
      
      // Get auth token
      const token = getAuthToken();
      if (!token) {
        console.error('No authentication token found!');
        alert('Please log in to save jobs');
        return;
      }
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      // Call the appropriate endpoint based on current saved status
      if (isSaved) {
        // If job was saved, unsave it
        const response = await axios.delete(`${apiBaseUrl}/jobs/${jobId}/save`, { headers });
        console.log('Unsave response:', response.data);
      } else {
        // If job wasn't saved, save it
        const response = await axios.post(`${apiBaseUrl}/jobs/${jobId}/save`, {}, { headers });
        console.log('Save response:', response.data);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      // On error, revert by fetching jobs again
      if (showSavedOnly) {
        fetchSavedJobs();
      } else {
        fetchJobs();
      }
    }
  };

  // Function to fetch only saved jobs - with better error handling
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
      
      setJobs(response.data);
      if (response.data.length > 0) {
        setSelectedJob(response.data[0]);
      } else {
        setSelectedJob(null);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      setIsLoading(false);
      // If we can't fetch saved jobs, revert to all jobs
      setShowSavedOnly(false);
      fetchJobs();
    }
  };

  // Toggle between all jobs and saved jobs
  const toggleSavedFilter = () => {
    const newSavedOnlyState = !showSavedOnly;
    setShowSavedOnly(newSavedOnlyState);
    
    // Fetch appropriate jobs based on filter
    if (newSavedOnlyState) {
      fetchSavedJobs();
    } else {
      fetchJobs();
    }
  };

  // Extract unique cities from jobs
  const cities = useMemo(() => {
    const citySet = new Set(jobs.map(job => {
      // Extract city from location if available
      // This assumes a format like "City, State" or just "City"
      if (job.location) {
        return job.location.split(',')[0].trim();
      }
      return '';
    }).filter(city => city !== ''));
    
    return Array.from(citySet).sort();
  }, [jobs]);

  // Extract salary ranges for filter
  const salaryRanges = [
    { label: 'Any', value: '' },
    { label: '$30,000+', value: '30000' },
    { label: '$50,000+', value: '50000' },
    { label: '$70,000+', value: '70000' },
    { label: '$100,000+', value: '100000' },
    { label: '$150,000+', value: '150000' },
    { label: '$200,000+', value: '200000' },
    { label: '$250,000+', value: '250000' },
  ];

  // Improved salary parsing to handle ranges properly
  const parseSalary = (salaryStr) => {
    if (!salaryStr) return 0;
    
    // Extract all numbers from the salary string
    const matches = salaryStr.match(/\d[\d,]*/g);
    if (!matches || matches.length === 0) return 0;
    
    // Convert all matches to numbers by removing commas and parsing
    const numbers = matches.map(num => parseInt(num.replace(/,/g, ''), 10));
    
    // If there are multiple numbers (likely a range), return the highest value
    // This assumes ranges like "$30,000 - $50,000" or "$30,000 to $50,000"
    if (numbers.length > 1) {
      return Math.max(...numbers);
    }
    
    // Otherwise just return the single number found
    return numbers[0];
  };

  // Filter jobs based on all criteria
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Filter by search query (job title)
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by city
      const matchesCity = !selectedCity || 
        (job.location && job.location.toLowerCase().includes(selectedCity.toLowerCase()));
      
      // Filter by minimum salary
      const jobSalary = parseSalary(job.salary);
      const matchesSalary = !minSalary || jobSalary >= parseInt(minSalary, 10);
      
      // Filter by saved status if enabled
      const matchesSaved = !showSavedOnly || job.is_saved;
      
      return matchesSearch && matchesCity && matchesSalary && matchesSaved;
    });
  }, [jobs, searchQuery, selectedCity, minSalary, showSavedOnly]);

  return (
    <div className="flex flex-col bg-[#214933] min-h-screen w-10/12 p-8 mt-12 text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[70px] font-bold mb-2 font-custom">Job Board</h1>
        <h2 className="text-[30px] italic font-custom">* Bolsa de Trabajo</h2>
      </div>

      {/* Filters Section */}
      <div className={`flex justify-center gap-4 mb-8 ${prozaLibre.className}`}>
        {/* Saved Button */}
        <div className="flex flex-col w-1/5">
          <label className="mb-2 invisible">Placeholder</label>
          <button 
            onClick={toggleSavedFilter}
            className={`py-3 px-6 rounded-lg flex items-center gap-2 shadow-lg transition-all ${
              showSavedOnly 
                ? 'bg-white text-[#214933]' 
                : 'bg-[#214933] text-white border border-white'
            }`}
          >
            <BookmarksIcon />
            {showSavedOnly ? 'Showing Saved' : 'Show Saved'}
          </button>
        </div>

        {/* Search Bar */}
        <div className={`flex flex-col w-1/4 ${prozaLibre.className}`}>
          <label htmlFor="searchQuery" className="mb-2 text-[#F6F2E9]">Search Jobs</label>
          <div className="relative">
            <input
              id="searchQuery"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search job titles..."
              className="py-3 px-3 pl-10 bg-[#335843] text-[#F6F2E9] rounded-m shadow-lg w-full"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A9A9A9]" />
          </div>
        </div>

        {/* City Selection */}
        <div className={`flex flex-col w-1/4 ${prozaLibre.className}`}>
          <label htmlFor="citySelect" className="mb-2 text-[#F6F2E9]">City</label>
          <select 
            id="citySelect"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="py-3 px-3 bg-[#335843] text-[#F6F2E9] rounded-m shadow-lg"
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Minimum Salary */}
        <div className={`flex flex-col w-1/4 ${prozaLibre.className}`}>
          <label htmlFor="minSalary" className="mb-2 text-[#F6F2E9]">Minimum Salary</label>
          <select
            id="minSalary"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
            className="py-3 px-3 bg-[#335843] text-[#F6F2E9] rounded-m shadow-lg"
          >
            {salaryRanges.map(range => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Job Content Section - Increased height */}
      <div className="job-content-section h-[72vh] flex-grow mb-8">
        {isLoading ? (
          <LoadingScreen />
        ) : filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center h-full justify-center">
            <p className="text-white text-2xl mb-4">No jobs found matching your criteria</p>
            {searchQuery || selectedCity || minSalary || showSavedOnly ? (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCity('');
                  setMinSalary('');
                  setShowSavedOnly(false);
                }}
                className="bg-white text-[#214933] py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            ) : null}
          </div>
        ) : (
          <div className={`flex justify-center gap-8 ${prozaLibre.className} h-full`}>
            {/* Job List - Fixed overflow and added padding */}
            <div className="w-1/4 overflow-y-auto overflow-x-visible pr-4 pl-2 h-full">
              {/* The list container now has padding to account for card expansion */}
              <div className="pr-3 pl-1">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => {
                      setSelectedJob(job);
                    }}
                    className={`relative bg-[#F6F2E9] text-black p-4 mb-4 rounded-xl shadow-lg flex items-center gap-4 cursor-pointer 
                      ${selectedJob?.id === job.id ? 'ring-4 ring-[#214933] scale-105 transition-transform' : ''}`}
                  >
                    {job.logo_url ? (
                      <img src={job.logo_url} alt={`${job.title} logo`} className="h-12 w-12 rounded-full object-cover" />
                    ) : (
                      <div className="h-12 w-12 rounded-full" style={{ backgroundColor: '#FFA500' }}></div>
                    )}
                    <div>
                      <p className="text-lg font-bold">{job.title}</p>
                      <p className="text-sm">{job.company}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vertical bar */}
            <div className="h-full w-1 bg-white"></div>

            {/* Job Details - With content area limited to 85% height */}
            {selectedJob && (
              <div className="relative flex-grow bg-[#F6F2E9] text-black p-8 rounded-xl shadow-lg max-w-[600px] w-full h-full">
                {/* Content scrollable area with max-height */}
                <div className="overflow-y-auto max-h-[90%] pr-2">
                  <div className="flex items-center gap-4 mb-8">
                    {selectedJob?.logo_url ? (
                      <img src={selectedJob.logo_url} alt={`${selectedJob.title} logo`} className="h-16 w-16 rounded-full object-cover" />
                    ) : (
                      <div className="h-16 w-16 rounded-full" style={{ backgroundColor: '#FFA500' }}></div>
                    )}
                    <div className="flex-grow">
                      <h3 className="text-3xl font-bold">{selectedJob?.title}</h3>
                      <p>{selectedJob?.company}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Job Description:</h4>
                    <p className="mb-8">{selectedJob?.description}</p>

                    <h4 className="text-xl font-semibold mb-4">Responsibilities:</h4>
                    <ul className="list-disc pl-5 mb-8">
                      {formatRequirementsAsList(selectedJob?.requirements).map((requirement, index) => (
                        <li key={index}>{requirement}</li>
                      ))}
                    </ul>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div>
                        <h5 className="font-semibold">Location:</h5>
                        <p>{selectedJob?.location}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold">Salary:</h5>
                        <p>{selectedJob?.salary || 'Not specified'}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold">Contact:</h5>
                        <p>{selectedJob?.contact}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bookmarks Icon - fixed position in bottom right */}
                <div
                  className={`absolute bottom-4 right-4 p-2 rounded-full border-2 cursor-pointer transition-all
                  ${selectedJob.is_saved ? 'bg-green-700 text-white' : 'bg-transparent border-green-700 text-green-700'}`}
                  onClick={() => toggleBookmark(selectedJob.id)}
                >
                  <BookmarksIcon />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Hyperlinks />
    </div>
  );
}