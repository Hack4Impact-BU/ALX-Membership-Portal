'use client';
import React, { useState, useEffect } from 'react';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import { Inter, Proza_Libre } from 'next/font/google';
import Link from 'next/link';
import axios from 'axios'; // Import Axios for API requests

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // Fetch jobs from the API when the component mounts
  useEffect(() => {
    console.log("Fetching jobs...");  // Check if useEffect is triggered
    async function fetchJobs() {
      try {
        const response = await axios.get('http://localhost:3001/jobs');
        console.log("HELLO I AM LOOKING FOR:", response.data);  // Corrected log
        setJobs(response.data);  // Store jobs in state
        setSelectedJob(response.data[0]); // Set the first job as default selected job
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    }
    fetchJobs();
  }, []);
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

        {/* Job List */}
        <div className="w-1/3">
          {jobs.map((job) => {
            // Log the s3_logo_url to the console
            return (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`bg-[#F6F2E9] text-black p-4 mb-4 rounded-xl shadow-lg flex items-center gap-4 cursor-pointer ${selectedJob.id === job.id ? 'ring-4 ring-[#214933]' : ''}`}
              >
                {/* Display job logo from the S3 URL */}
                {job.s3_logo_url ? (
                  <img src={job.s3_logo_url} alt={`${job.title} logo`} className="h-12 w-12 rounded-full" />
                ) : (
                  <div className="h-12 w-12 rounded-full" style={{ backgroundColor: '#FFA500' }}></div>
                )}
                <div>
                  <p className="text-lg font-bold">{job.title}</p>
                  <p className="text-sm">{job.company}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Job Details */}
        <div className="flex-grow bg-[#F6F2E9] text-black p-8 rounded-xl shadow-lg">
          <div className="flex items-center gap-4 mb-8">
            {selectedJob.s3_logo_url ? (
              <img src={selectedJob.s3_logo_url} alt={`${selectedJob.title} logo`} className="h-16 w-16 rounded-full" />
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
            <p>{selectedJob.responsibilities}</p>

            <h4 className="text-xl font-semibold mb-2">Requirements:</h4>
            <p>{selectedJob.requirements}</p>

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