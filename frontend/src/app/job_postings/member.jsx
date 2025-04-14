'use client';
import React, { useState, useEffect } from 'react';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import { Inter, Proza_Libre } from 'next/font/google';
import axios from 'axios';
import LoadingScreen from '@/components/LoadingScreen';
import Hyperlinks from '@/components/Hyperlinks';

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function JobBoardMember() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    const startTime = Date.now();
    try {
      const response = await axios.get(`${apiBaseUrl}/jobs`);
      const result = response.data;
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

  const toggleBookmark = async (jobId) => {
    try {
      // Find the job in the current jobs state
      const updatedJobs = jobs.map(job => {
        if (job.id === jobId) {
          // Toggle the is_saved status
          const updatedJob = { ...job, is_saved: !job.is_saved };
          
          // If this is the selected job, update that too
          if (selectedJob && selectedJob.id === jobId) {
            setSelectedJob(updatedJob);
          }
          
          return updatedJob;
        }
        return job;
      });
      
      // Update the jobs state
      setJobs(updatedJobs);
      
      // Get the updated job
      const jobToUpdate = updatedJobs.find(job => job.id === jobId);
      
      // Send the update to the backend using the regular update endpoint
      // Add Content-Type header to ensure proper JSON parsing
      await axios.patch(`${apiBaseUrl}/jobs/${jobId}`, 
        { job: { is_saved: jobToUpdate.is_saved } },
        { headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      // Revert the change if there was an error
      fetchJobs();
    }
  };

  const toggleSavedFilter = () => {
    setShowSavedOnly(!showSavedOnly);
    
    if (showSavedOnly && selectedJob) {
      setSelectedJob(jobs[0] || null);
    }
  };

  const filteredJobs = showSavedOnly 
    ? jobs.filter(job => job.is_saved) 
    : jobs;

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
          <label className="mb-2 invisible ">Placeholder</label>
          <button 
            onClick={toggleSavedFilter}
            className={`py-3 px-6 rounded-lg flex items-center gap-2 shadow-lg transition-all ${
              showSavedOnly 
                ? 'bg-white text-[#214933]' 
                : 'bg-[#335843] text-white'
            }`}
          >
            <BookmarksIcon />
            Saved
          </button>
        </div>

        {/* Business Type Selection */}
        <div className={`flex flex-col w-1/5 ${prozaLibre.className}`}>
          <label htmlFor="businessType" className="mb-2 text-[#F6F2E9]">Business Type</label>
          <select id="businessType" className="py-3 px-3 bg-[#335843] text-[#A9A9A9] rounded-m shadow-lg">
            <option>Select Type</option>
            <option value="tech">Tech</option>
            <option value="finance">Finance</option>
            <option value="healthcare">Healthcare</option>
          </select>
        </div>

        {/* Distance Selection */}
        <div className={`flex flex-col w-1/5 ${prozaLibre.className}`}>
          <label htmlFor="distance" className="mb-2 text-[#F6F2E9]">Distance</label>
          <select id="distance" className="py-3 px-3 bg-[#335843] text-[#A9A9A9] rounded-m shadow-lg">
            <option>Select Distance</option>
            <option value="5">5 miles</option>
            <option value="10">10 miles</option>
            <option value="20">20 miles</option>
          </select>
        </div>

        {/* Zip Code Input */}
        <div className={`flex flex-col w-1/5 ${prozaLibre.className}`}>
          <label htmlFor="zipCode" className="mb-2 text-[#F6F2E9]">Zip Code</label>
          <input
            type="text"
            id="zipCode"
            placeholder="Zip Code"
            className="py-3 px-3 bg-[#335843] text-[#F6F2E9] rounded-m shadow-lg"
          />
        </div>
      </div>

      {/* Job Content Section - Increased height */}
      <div className="job-content-section h-[72vh] flex-grow mb-8">
        {isLoading ? (
          <LoadingScreen />
        ) : filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center h-full justify-center">
            <p className="text-white text-2xl mb-4">
              {showSavedOnly ? "No saved jobs found" : "No jobs found"}
            </p>
            {showSavedOnly && (
              <button 
                onClick={toggleSavedFilter}
                className="bg-[#F6F2E9] text-[#214933] py-2 px-4 rounded-lg mt-4"
              >
                Show All Jobs
              </button>
            )}
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