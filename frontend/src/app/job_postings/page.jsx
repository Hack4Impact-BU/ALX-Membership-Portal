'use client';
import React, { useState, useEffect } from 'react';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import { Inter, Proza_Libre } from 'next/font/google';
import Link from 'next/link';
import axios from 'axios';
import LoadingScreen from '@/components/LoadingScreen';
import Hyperlinks from '@/components/Hyperlinks';

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false); // Toggle delete mode
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    setIsLoading(true);
    const startTime = Date.now(); // Record start time
    axios.get(`${apiBaseUrl}/jobs`)
      .then((response) => {
        const data = response.data;
        const elapsed = Date.now() - startTime;
        const minDelay = 300; // Minimum loading time in milliseconds (1 second)
        const remainingDelay = minDelay - elapsed;
        if (remainingDelay > 0) {
          // Wait for the remaining time before setting data
          setTimeout(() => {
            setJobs(data);
            setSelectedJob(data[0]);
            setIsLoading(false);
          }, remainingDelay);
        } else {
          setJobs(data);
          setSelectedJob(data[0]);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        setIsLoading(false);
      });
  };

  // Delete a job by its id
  const deleteJob = (jobId) => {
    axios.delete(`${apiBaseUrl}/jobs/${jobId}`)
      .then(() => {
        setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
        if (selectedJob && selectedJob.id === jobId) {
          setSelectedJob(null);
        }
      })
      .catch((error) => {
        console.error("Error deleting job:", error);
      });
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

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
          <button className="bg-[#F6F2E9] text-[#214933] py-3 px-6 rounded-lg flex items-center gap-2 shadow-lg">
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

      {/* Job Content Section */}
      <div className="job-content-section">
        {isLoading ? (
          <LoadingScreen />
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center">
            <p className="text-white text-2xl mb-4">No jobs found</p>
          </div>
        ) : (
          <div className={`flex justify-center gap-8 ${prozaLibre.className}`}>
            {/* Job List */}
            <div className="w-1/4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`relative bg-[#F6F2E9] text-black p-4 mb-4 rounded-xl shadow-lg flex items-center gap-4 cursor-pointer 
                    ${selectedJob?.id === job.id ? 'ring-4 ring-[#214933] scale-110 transition-transform' : ''}`}
                >
                  {deleteMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteJob(job.id);
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      x
                    </button>
                  )}
                  {job.logo_url ? (
                    <img src={job.logo_url} alt={`${job.title} logo`} className="h-12 w-12 rounded-full" />
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

            {/* Vertical bar */}
            <div className="h-auto w-1 bg-white"></div>

            {/* Job Details */}
            <div className="relative flex-grow bg-[#F6F2E9] text-black p-8 rounded-xl shadow-lg max-w-[600px] w-full">
              <div className="flex items-center gap-4 mb-8">
                {selectedJob?.logo_url ? (
                  <img src={selectedJob.logo_url} alt={`${selectedJob.title} logo`} className="h-16 w-16 rounded-full" />
                ) : (
                  <div className="h-16 w-16 rounded-full" style={{ backgroundColor: '#FFA500' }}></div>
                )}
                <div>
                  <h3 className="text-3xl font-bold">{selectedJob?.title}</h3>
                  <p>{selectedJob?.company}</p>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-4">Job Description:</h4>
                <p className="mb-8">{selectedJob?.description} Compensation: {selectedJob?.salary}</p>

                <h4 className="text-xl font-semibold mb-4">Responsibilities:</h4>
                <ul className="list-disc ml-8 mb-8">
                  {selectedJob?.responsibilities.split('. ').map((responsibility, index) => (
                    <li key={index}>{responsibility}</li>
                  ))}
                </ul>

                <h4 className="text-xl font-semibold mb-4">Requirements:</h4>
                <ul className="list-disc ml-8 mb-8">
                  {selectedJob?.requirements.split('. ').map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>

                <p className="mb-8">
                  Contact:{" "}
                  <a href={selectedJob?.contact} className="text-blue-600 hover:underline">
                    {selectedJob?.contact}
                  </a>
                </p>
              </div>

              {/* Bookmarks Icon */}
              <div
                className={`absolute bottom-4 right-4 p-2 rounded-full border-2 cursor-pointer transition-all
                ${isBookmarked ? 'bg-green-700 text-white' : 'bg-transparent border-green-700 text-green-700'}`}
                onClick={toggleBookmark}
              >
                <BookmarksIcon />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Buttons */}
      <div className="flex justify-center mt-8 gap-4">
        <Link href="job_postings/create" passHref>
          <p className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 cursor-pointer">
            Create New Job
          </p>
        </Link>
        <button 
          onClick={() => setDeleteMode(!deleteMode)}
          className={`py-3 px-6 rounded-lg flex items-center gap-2 shadow-lg ${
            deleteMode ? 'bg-gray-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {deleteMode ? "Cancel Delete" : "Delete Jobs"}
        </button>
      </div>
      <Hyperlinks />
    </div>
  );
}