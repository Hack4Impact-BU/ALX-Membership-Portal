'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link'
import TitleCard from './TitleCard';
import { Inter, Proza_Libre } from 'next/font/google'; // Correctly importing Inter and Proza_Libre

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function GetInvolved() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchOpportunities() {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
        const response = await fetch(`${apiBaseUrl}/get_involveds?limit=2`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch opportunities');
        }
        
        const data = await response.json();
        setOpportunities(data.slice(0, 2)); // Take first two opportunities
        setLoading(false);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
        setLoading(false);
        // Fall back to hardcoded data if your API isn't ready yet
        setOpportunities([
          { 
            id: 1, 
            title: 'Guest Speaker', 
            location: 'Boston University', 
            date: '2023-09-18',
            type: 'speaking',
          },  
          { 
            id: 2, 
            title: 'Volunteer', 
            location: 'Local Community', 
            date: '2023-09-30',
            type: 'volunteer',
          }
        ]);
      }
    }
    
    fetchOpportunities();
  }, []);
  
  // Function to determine circle background color based on opportunity type
  const getCircleColor = (type) => {
    switch(type) {
      case 'speaking':
        return 'bg-green-500';
      case 'volunteer':
        return 'bg-orange-500';
      case 'mentorship':
        return 'bg-purple-500';
      case 'leadership':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <section className="flex flex-col md:flex-row justify-between items-center px-8 py-24 border-b-2 ">
      {/* Title Section */}
      <TitleCard 
        header="Get Involved" 
        translation="* Involúcrate" 
        link="/get_involved" 
      />

      {/* Involvement Opportunities Section */}
      <div className={`md:w-6/12 flex flex-wrap justify-between ${prozaLibre.className}`}>
        {loading ? (
          // Loading state
          <p>Loading opportunities...</p>
        ) : opportunities.length > 0 ? (
          // Map through actual opportunities
          opportunities.map((opportunity) => (
            <div key={opportunity.id} className="bg-[#F6F2E9] p-4 rounded-xl shadow-lg w-64 h-full flex flex-col justify-between">
              <div>
                <div className={`h-12 w-12 ${getCircleColor(opportunity.type)} rounded-full mb-4`}></div>
                <div className="p-4 bg-white rounded-xl">
                  <p className="text-lg text-center">{opportunity.title}</p>
                </div>
                <div className="px-2 py-4 rounded-lg">
                  <p className="text-xs">Event: {opportunity.location}</p>
                  <hr className="my-2 border-gray-700" />              
                  <p className="text-xs">Date: {new Date(opportunity.date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex justify-end mt-4 text-xs">
                <Link href={`/get_involved/`} className="text-blue-600 hover:underline">
                  See More
                </Link>
              </div>
            </div>
          ))
        ) : (
          // No opportunities case
          <p>No involvement opportunities available at this time.</p>
        )}
      </div>
    </section>
  );
}
