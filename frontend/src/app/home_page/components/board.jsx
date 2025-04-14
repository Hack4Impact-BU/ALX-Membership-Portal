'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link'
import TitleCard from './TitleCard';
import { Inter, Proza_Libre } from 'next/font/google'; // Correctly importing Inter and Proza_Libre

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchJobs() {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
        const response = await fetch(`${apiBaseUrl}/jobs?limit=2`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        
        const data = await response.json();
        setJobs(data.slice(0, 2)); // Take first two jobs
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
        // Fall back to hardcoded data if your jobs API isn't ready yet
        setJobs([
          { id: 1, title: 'Software Engineer', company: 'Tech Corp', created_at: '2023-09-10T00:00:00Z' },
          { id: 2, title: 'Marketing Manager', company: 'Local Biz', created_at: '2023-09-12T00:00:00Z' }
        ]);
      }
    }
    
    fetchJobs();
  }, []);
  
  // Function to format date as YYYY-MM-DD
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };
  
  return (
    <section className="flex flex-col md:flex-row justify-between items-center px-8 py-24 border-b-2">
      {/* Title Section (Replaced with ReusableHeader) */}
      <TitleCard 
        header="Job Board" 
        translation="* Bolsa de Trabajo" 
        link="/job_postings" 
      />

      {/* Job Listings Section */}
      <div className={`md:w-6/12 flex flex-wrap justify-between ${prozaLibre.className}`}>
        {loading ? (
          // Loading state
          <p>Loading jobs...</p>
        ) : jobs.length > 0 ? (
          // Map through actual jobs
          jobs.map((job) => (
            <div key={job.id} className="bg-[#F6F2E9] p-4 rounded-xl shadow-lg w-64 h-full flex flex-col justify-between">
              <div>
                {job.logo_url ? (
                  <img 
                    src={job.logo_url} 
                    alt={job.title} 
                    className="h-12 w-12 rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="h-12 w-12 bg-blue-500 rounded-full mb-4"></div>
                )}
                <div className="p-4 bg-white rounded-xl">
                  <p className="text-lg text-center">{job.title}</p>
                </div>
                <div className="px-2 py-4 rounded-lg">
                  <p className="text-xs">Company: {job.company}</p>
                  <hr className="my-2 border-gray-700" />              
                  <p className="text-xs">Posted: {new Date(job.created_at).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex justify-end mt-4 text-xs">
                <Link href={`/job_postings/${job.id}`} className="text-blue-600 hover:underline">
                  See More
                </Link>
              </div>
            </div>
          ))
        ) : (
          // No jobs case
          <p>No job listings available at this time.</p>
        )}
      </div>
    </section>
  );
}
