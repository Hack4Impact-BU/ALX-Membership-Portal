'use client'

import { useState } from 'react';
import { Inter, Proza_Libre } from 'next/font/google'; // Import the Proza Libre font
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function EventCard({Location, WebsiteLink, pic, Date, index, description, saved, Time, distance, EventName, EventOrganizer, id, image_url}) {

    const [isSaved, setIsSaved] = useState(saved);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    // console.log("the card", EventName, "saved status is",isSaved);
    // console.log("the card", EventName, "saved status is",saved);


    const handleSaveToggle = async () => {
        const newSavedStatus = !isSaved;
        const action = newSavedStatus ? 'saving' : 'unsaving';

        // Optimistically update UI
        setIsSaved(newSavedStatus); 

        try {
            // Retrieve the auth token (using the same logic as before)
            const token = localStorage.getItem('authToken') || 
                          localStorage.getItem('idToken') || 
                          localStorage.getItem('auth0Token') ||
                          localStorage.getItem('token');

            if (!token) {
                 console.error('Authentication token not found.');
                 alert('Please log in to save events.');
                 setIsSaved(!newSavedStatus); // Revert optimistic update
                 return; 
            }

            const headers = { 'Authorization': `Bearer ${token}` };
            const method = newSavedStatus ? 'POST' : 'DELETE';

            // Make the API call
            const response = await fetch(`${apiBaseUrl}/eventlists/${id}/save`, {
                method: method,
                headers: headers,
                // No body needed
            });

            if (!response.ok) {
                // Try to get error details, but handle non-JSON responses too
                let errorData = { message: `Request failed with status ${response.status}` };
                try {
                    const potentialJson = await response.json();
                    errorData = potentialJson;
                } catch (e) {
                    console.warn("Response was not JSON:", await response.text());
                }
                throw new Error(errorData.message || `Failed to ${action} event`);
            }
            
            const result = await response.json(); 
            console.log(`Event ${action} successful:`, result); 

        } catch (error) {
            console.error(`Error ${action} event:`, error);
            // Revert optimistic update on error
            setIsSaved(!newSavedStatus); 
            // Show generic error message
            alert(`Could not ${action} the event. ${error.message}. Please try again or log in again if the issue persists.`); 
        }
    }


    return (
            <div className="border flex flex-col justify-evenly rounded-3xl bg-[#F6F2E9] w-96 h-64 transition-transform duration-300 hover:scale-105">
                <Link href={`/events/event_listings/${id}`}>
                <div className="flex flex-row justify-center items-center gap-2 hover:cursor-pointer">
                    {/* gonna be image circle */}
                    {image_url ? (
                        <img 
                            src={image_url} 
                            alt={EventName} 
                            className="w-20 h-20 object-cover rounded-full"
                        />
                    ) : (
                        <div className="w-20 h-20 bg-orange-400 rounded-full"/>
                    )}
                    <div className="flex items-center justify-center w-60 h-14 bg-white rounded-full">
                        <p className={`p-4 text-2xl text-[#214933] ${prozaLibre.className} overflow-hidden text-ellipsis whitespace-nowrap`}>{EventName}</p>
                    </div>
                </div>
                </Link>
                <div className='flex flex-row w-full pl-8 pr-5'>
                    <div className='flex flex-col justify-center'>
                        <p className={`text-sm ${prozaLibre.className} text-[#214933]`}>{Location}</p>
                        <p className={`text-sm ${prozaLibre.className} text-[#214933]`}>{Date}</p>
                        <p className={`text-sm ${prozaLibre.className} text-[#214933]`}>{Time}</p>
                        <div className='w-16 h-px bg-black my-2'/>
                        <p className={`text-sm ${prozaLibre.className} text-[#214933] w-full font-bold`}>Event Organizer:</p>
                        <p className={`text-sm ${prozaLibre.className} text-[#214933]`}>{EventOrganizer}</p>
                        
                    </div>
                    <div className='flex flex-col mt-auto ml-auto'>
                        <button 
                            className="p-1 rounded-full hover:bg-[#214933]/10 transition-colors duration-200"
                            onClick={handleSaveToggle}
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill={isSaved ? '#214933' : 'none'} 
                                viewBox="0 0 24 24" 
                                strokeWidth="2" 
                                stroke="#214933" 
                                className="size-6"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
    )
}