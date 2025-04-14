'use client'

import { useState } from 'react';
import { Inter, Proza_Libre } from 'next/font/google'; // Import the Proza Libre font
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function EventCard({ saved, index, toggleCardSaved, ...event }) {
    const [isSaved, setIsSaved] = useState(event.isSaved);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


    const formatTime = (isoTime) => {
        const date = new Date(isoTime);
        return date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
      };
      

      const handleSaveToggle = async () => {
        const newSavedStatus = !isSaved;
        
        try {


            // Make API request to update saved status
            const response = await fetch(`${apiBaseUrl}/eventlists/${event.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isSaved: newSavedStatus }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to update saved status');
            }
            
            // Update state only after successful API response
            setIsSaved(newSavedStatus);
            console.log(`Event ${newSavedStatus ? 'saved' : 'unsaved'} successfully`);
        } catch (error) {
            console.error('Error updating saved status:', error);
            // Optionally revert the UI state if the API call fails
            // setIsSaved(isSaved);
        }
    }

    return (
        <div className="border flex flex-col justify-evenly rounded-3xl bg-[#F6F2E9] w-96 h-64 transition-transform duration-300 hover:scale-105">
            <Link href={`/events/event_listings/${event.id}`}>
                <div className="flex flex-row justify-center items-center gap-2 hover:cursor-pointer">
                    {/* Image circle */}
                    {event.image_url ? (
                        <img 
                            src={event.image_url} 
                            alt={event.eventName} 
                            className="w-20 h-20 object-cover rounded-full"
                        />
                    ) : (
                        <div className="w-20 h-20 bg-orange-400 rounded-full"/>
                    )}
                    <div className="flex items-center justify-center w-60 h-14 bg-white rounded-full">
                        <p className={`p-4 text-2xl text-[#214933] ${prozaLibre.className} overflow-hidden text-ellipsis whitespace-nowrap`}>
                            {event.eventName}
                        </p>
                    </div>
                </div>
            </Link>
            <div className="flex flex-row w-full pl-8 pr-5">
                <div className="flex flex-col justify-center">
                    <p className={`text-sm ${prozaLibre.className} text-[#214933]`}>{event.location}</p>
                    <p className={`text-sm ${prozaLibre.className} text-[#214933]`}>{event.startDate}</p>
                    <p className={`text-sm ${prozaLibre.className} text-[#214933]`}>{formatTime(event.timeStart)}</p>
                    <div className="w-16 h-px bg-black my-2" />
                    <p className={`text-sm ${prozaLibre.className} text-[#214933] w-full font-bold`}>Event Organizer:</p>
                    <p className={`text-sm ${prozaLibre.className} text-[#214933]`}>{event.org}</p>
                </div>
                <div className="flex flex-col mt-auto ml-auto">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={isSaved ? '#214933' : 'none'}
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="#214933"
                        className="size-6 cursor-pointer"
                        onClick={handleSaveToggle}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}