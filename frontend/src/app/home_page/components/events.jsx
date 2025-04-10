'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import TitleCard from './TitleCard'; // Assuming ReusableHeader is in the same directory
import { Inter, Proza_Libre } from 'next/font/google'; // Correctly importing Inter and Proza_Libre

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchEvents() {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiBaseUrl}/eventlists?limit=2`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        setEvents(data.slice(0, 2)); // Take first two events
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    }
    
    fetchEvents();
  }, []);
  
  return (
    <section className="flex flex-col md:flex-row justify-between items-center px-8 py-8 pb-24 border-b-2">
      {/* Title Section (Replaced with ReusableHeader) */}
      <TitleCard 
        header="Upcoming Events" 
        translation="* Próximos eventos" 
        link="/events/event_listings" 
      />

      {/* Event Cards Section */}
      <div className={`md:w-6/12 flex flex-wrap justify-between ${prozaLibre.className}`}>
        {loading ? (
          // Loading state
          <p>Loading events...</p>
        ) : events.length > 0 ? (
          // Map through actual events
          events.map((event) => (
            <div key={event.id} className="bg-[#F6F2E9] p-4 rounded-xl shadow-lg w-64 h-full flex flex-col justify-between">
              <div>
                {event.image_url ? (
                  <img 
                    src={event.image_url} 
                    alt={event.eventName} 
                    className="h-12 w-12 rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="h-12 w-12 bg-blue-500 rounded-full mb-4"></div>
                )}
                <div className="p-4 bg-white rounded-xl">
                  <p className="text-lg text-center">{event.eventName}</p>
                </div>
                <div className="px-2 py-4 rounded-lg">
                  <p className="text-xs">Location: {event.location || 'TBD'}</p>
                  <hr className="my-2 border-gray-700" />
                  <p className="text-xs">Event Date: {new Date(event.startDate).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex justify-end mt-4 text-xs">
                <Link href={`/events/event_listings/${event.id}`} className="text-blue-600 hover:underline">
                  See More
                </Link>
              </div>
            </div>
          ))
        ) : (
          // No events case
          <p>No upcoming events at this time.</p>
        )}
      </div>
    </section>
  );
}