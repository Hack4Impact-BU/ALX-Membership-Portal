'use client';
import React, { useState, useEffect } from 'react';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import { Inter, Proza_Libre } from 'next/font/google';
import Link from 'next/link';
import axios from 'axios'; // Import Axios for API requests

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function JobBoard() {
  // State to track the list of jobs fetched from the API and the selected job
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // Fetch jobs from the API when the component mounts
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    axios.get('http://localhost:3001/jobs')
      .then((response => {
        console.log(response.data)
        setJobs(response.data);  // Store jobs in state
        setSelectedJob(response.data[0]); // Set the first job as default selected job
      }))
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });
  }

  if (!selectedJob) return <div>Loading jobs...</div>;

  return (
    <div className="flex flex-col bg-[#214933] min-h-screen w-10/12 p-8 text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-[70px] font-bold mb-2 font-custom`}>Job Board</h1>
        <h2 className="text-[30px] italic font-custom">* Bolsa de Trabajo</h2>
      </div>

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
          </select>
        </div>

        {/* Distance Selection */}
        <div className={`flex flex-col w-1/5 ${prozaLibre.className}`}>
          <label htmlFor="distance" className="mb-2 text-[#F6F2E9]">Distance</label>
          <select id="distance" className="py-3 px-3 bg-[#335843] text-[#A9A9A9] rounded-m shadow-lg">
            <option>Select Distance</option>
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

      {/* Job Listing & Details Section */}
      <div className={`flex gap-8 ${prozaLibre.className}`}>
        {/* Job List */}
        <div className="w-1/3">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job)}  // Set the selected job on click
              className={`bg-[#F6F2E9] text-black p-4 mb-4 rounded-xl shadow-lg flex items-center gap-4 cursor-pointer ${selectedJob.id === job.id ? 'ring-4 ring-[#214933]' : ''}`}
            >
              {/* Display job logo from the S3 URL */}
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

        {/* Job Details */}
        <div className="flex-grow bg-[#F6F2E9] text-black p-8 rounded-xl shadow-lg">
          <div className="flex items-center gap-4 mb-8">
            {/* Display selected job logo */}
            {selectedJob.logo_url ? (
              <img src={selectedJob.logo_url} alt={`${selectedJob.title} logo`} className="h-16 w-16 rounded-full" />
            ) : (
              <div className="h-16 w-16 rounded-full" style={{ backgroundColor: '#FFA500' }}></div>
            )}
            <div>
              <h3 className="text-3xl font-bold">{selectedJob.title}</h3>
              <p>{selectedJob.company}</p>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">Job Description:</h4>
            <p className="mb-4">{selectedJob.description} Compensation: {selectedJob.salary}</p>

            <h4 className="text-xl font-semibold mb-2">Responsibilities:</h4>
            <ul className="list-disc ml-8 mb-4">
              {selectedJob.responsibilities.split('. ').map((responsibility, index) => (
                <li key={index}>{responsibility}</li>
              ))}
            </ul>

            <h4 className="text-xl font-semibold mb-2">Requirements:</h4>
            <ul className="list-disc ml-8 mb-4">
              {selectedJob.requirements.split('. ').map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>

            <p>Contact: <a href={selectedJob.contact} className="text-blue-600 hover:underline">{selectedJob.contact}</a></p>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <Link href="job_postings/create_job" passHref>
          <p className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700">
            Create New Job
          </p>
        </Link>
      </div>
    </div>
  );

        {/* Job Details */}
        <div className="flex-grow bg-[#F6F2E9] text-black p-8 rounded-xl shadow-lg">
          <div className="flex items-center gap-4 mb-8">
            {/* Display selected job logo */}
            {selectedJob.logo_url ? (
              <img src={selectedJob.logo_url} alt={`${selectedJob.title} logo`} className="h-16 w-16 rounded-full" />
            ) : (
              <div className="h-16 w-16 rounded-full" style={{ backgroundColor: '#FFA500' }}></div>
            )}
            <div>
              <h3 className="text-3xl font-bold">{selectedJob.title}</h3>
              <p>{selectedJob.company}</p>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">Job Description:</h4>
            <p className="mb-4">{selectedJob.description} Compensation: {selectedJob.salary}</p>

            <h4 className="text-xl font-semibold mb-2">Responsibilities:</h4>
            <ul className="list-disc ml-8 mb-4">
              {selectedJob.responsibilities.split('. ').map((responsibility, index) => (
                <li key={index}>{responsibility}</li>
              ))}
            </ul>

            <h4 className="text-xl font-semibold mb-2">Requirements:</h4>
            <ul className="list-disc ml-8 mb-4">
              {selectedJob.requirements.split('. ').map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>

            <p>Contact: <a href={selectedJob.contact} className="text-blue-600 hover:underline">{selectedJob.contact}</a></p>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <Link href="job_postings/create_job" passHref>
          <p className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700">
            Create New Job
          </p>
        </Link>
      </div>
    </div>
  );
}