'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import BookmarksIcon from '@mui/icons-material/Bookmarks'; // Import BookmarksIcon from MUI
import { Inter, Proza_Libre } from 'next/font/google';
import axios from 'axios';
import LoadingScreen from '@/components/LoadingScreen';
import Hyperlinks from '@/components/Hyperlinks';

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function JobDetails() {
  const params = useParams();
  const jobId = params.id;
  
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Get auth token helper function
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

  useEffect(() => {
    fetchJobDetails();
    checkIfJobIsSaved();
  }, [jobId]);

  const fetchJobDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiBaseUrl}/jobs/${jobId}`);
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfJobIsSaved = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await axios.get(`${apiBaseUrl}/saved_jobs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Check if this job is in the saved jobs list
      const savedJobIds = response.data.map(job => job.id);
      setIsSaved(savedJobIds.includes(parseInt(jobId)));
    } catch (error) {
      console.error('Error checking if job is saved:', error);
    }
  };

  const toggleSave = async () => {
    const token = getAuthToken();
    if (!token) {
      alert('Please log in to save jobs');
      return;
    }

    try {
      if (isSaved) {
        // Unsave the job
        await axios.delete(`${apiBaseUrl}/jobs/${jobId}/save`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else {
        // Save the job
        await axios.post(`${apiBaseUrl}/jobs/${jobId}/save`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error toggling job save status:', error);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center bg-[#214933] min-h-screen w-10/12 p-8 mt-6 text-white">
        <h1 className="text-4xl mb-4">Job not found</h1>
        <p>The job you're looking for doesn't exist or has been removed.</p>
        <Hyperlinks />
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center bg-[#214933] min-h-screen w-10/12 p-8 mt-6 text-white ${prozaLibre.className}`}>
      <div className="w-full max-w-4xl bg-[#F6F2E9] text-black p-8 rounded-xl shadow-lg relative">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            {job.logo_url ? (
              <img 
                src={job.logo_url} 
                alt={`${job.company} logo`} 
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFA500' }}>
                {job.company && job.company.charAt(0)}
              </div>
            )}
            
            <div>
              <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
              <h2 className="text-xl">{job.company}</h2>
              <p className="text-gray-600">{job.location || 'Remote'}</p>
            </div>
          </div>
          <div
            className={`absolute bottom-4 right-4 p-2 rounded-full border-2 cursor-pointer transition-all
            ${isSaved ? 'bg-green-700 text-white' : 'bg-transparent border-green-700 text-green-700'}`}
            onClick={toggleSave}
          >
            <BookmarksIcon />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Salary</h3>
          <p>{job.salary || 'Not specified'}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Job Description</h3>
          <p className="whitespace-pre-line">{job.description}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Responsibilities</h3>
          <ul className="list-disc pl-5">
            {job.responsibilities && job.responsibilities.split('. ').filter(item => item.trim()).map((responsibility, index) => (
              <li key={index}>{responsibility}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Requirements</h3>
          <ul className="list-disc pl-5">
            {job.requirements && job.requirements.split('. ').filter(item => item.trim()).map((requirement, index) => (
              <li key={index}>{requirement}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Contact</h3>
          <a href={`mailto:${job.contact}`} className="text-blue-600 hover:underline">
            {job.contact}
          </a>
        </div>

        <div className="flex justify-between mt-8">
          <a 
            href="/job_postings"
            className="bg-green-700 hover:bg-green-600 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Back to Job Board
          </a>
        </div>
      </div>
      <Hyperlinks />
    </div>
  );
} 