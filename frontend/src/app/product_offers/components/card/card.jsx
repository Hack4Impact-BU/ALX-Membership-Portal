'use client'

import { Inter, Proza_Libre } from 'next/font/google'; // Import the Proza Libre font
import Link from 'next/link';
import { useState, useEffect } from 'react';

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

// Accept all necessary data as props, including initial isSaved state
export default function Card({ id, offerTitle, place, pic_url, startDate, isSaved: initialIsSaved }) {
    // Remove internal offerData state
    // const [offerData, setOfferData] = useState(null);
    
    // Initialize local isSaved state from the prop
    const [isSaved, setIsSaved] = useState(initialIsSaved || false);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    // Remove useEffect that fetches individual offer data
    /*
    useEffect(() => {
        // ... fetchOfferData logic removed ...
    }, [id, apiBaseUrl]);
    */
    
    // Update handleSaveToggle to use POST/DELETE and Authorization header
    const handleSaveToggle = async () => {
        const newSavedStatus = !isSaved;
        const action = newSavedStatus ? 'saving' : 'unsaving';

        // Optimistic UI update
        setIsSaved(newSavedStatus); 

        try {
            const token = localStorage.getItem('authToken') || 
                          localStorage.getItem('idToken') || 
                          localStorage.getItem('auth0Token') ||
                          localStorage.getItem('token');

            if (!token) {
                 console.error('Authentication token not found.');
                 alert('Please log in to save offers.');
                 setIsSaved(!newSavedStatus); // Revert optimistic update
                 return; 
            }

            const headers = { 'Authorization': `Bearer ${token}` };
            const method = newSavedStatus ? 'POST' : 'DELETE';

            // Use the correct save/unsave endpoint
            const response = await fetch(`${apiBaseUrl}/product_offers/${id}/save`, {
                method: method,
                headers: headers,
            });

            if (!response.ok) {
                let errorData = { message: `Request failed with status ${response.status}` };
                try { errorData = await response.json(); } catch (e) { /* Ignore non-JSON errors */ }
                throw new Error(errorData.message || `Failed to ${action} offer`);
            }
            
            const result = await response.json(); 
            console.log(`Offer ${action} successful:`, result); 

        } catch (error) {
            console.error(`Error ${action} offer:`, error);
            setIsSaved(!newSavedStatus); // Revert optimistic update
            alert(`Could not ${action} the offer. ${error.message}. Please try again or log in again if the issue persists.`); 
        }
    }
    
    // Remove loading check
    // if (!offerData) { ... }
    
    // Data comes directly from props now
    // const { offerTitle, place, link, pic_url, startDate, offerDesc, BusinessType, distance, instruct } = offerData; // Removed

    return (
            <div className="border flex flex-col justify-evenly rounded-3xl bg-[#F6F2E9] w-80 h-56 transition-transform duration-300 hover:scale-105">
                <Link href={`/product_offers/${id}`}>
                <div className="flex flex-row justify-center items-center gap-2 hover:cursor-pointer">
                    {/* Image handling - use pic_url from props */}
                    <img 
                        src={pic_url} // Use prop directly
                        alt={offerTitle} // Use prop directly
                        onError={(e) => {
                            console.log("Image failed to load:", pic_url);
                            e.target.onerror = null;
                            e.target.style.display = "none";
                            // Add a placeholder background if image fails
                            const parentDiv = e.target.parentNode.querySelector('.image-placeholder');
                            if (parentDiv) parentDiv.style.display = 'block'; 
                        }}
                        className="w-20 h-20 rounded-full object-cover"
                    />
                    {/* Optional: Placeholder div if image fails */}
                    <div 
                        className="image-placeholder w-20 h-20 rounded-full bg-[#214933]" 
                        style={{display: 'none'}} // Initially hidden
                    /> 
                    <div className="flex items-center w-48 h-14 bg-white rounded-full">
                        <p className={`p-4 text-2xl text-[#214933] ${prozaLibre.className} overflow-hidden text-ellipsis whitespace-nowrap`}>{offerTitle}</p> {/* Use prop */} 
                    </div>
                </div>
                </Link>
                <div className='flex flex-row w-full pl-5 pr-5'>
                    <div className='flex flex-col justify-center'>
                        <p className={`text-sm ${prozaLibre.className} text-[#214933]`}>{place}</p> {/* Use prop */} 
                        <div className='w-16 h-px bg-black mt-2 mb-2'/>
                        {/* Offer title repeated here? Maybe offerDesc? Using offerTitle for now */}
                        <p className={`text-sm ${prozaLibre.className} text-[#214933] w-4/5`}>{offerTitle}</p> {/* Use prop */} 
                        <p className={`font-bold text-sm ${prozaLibre.className} text-[#214933]`}>{startDate}</p> {/* Use prop */} 
                        
                    </div>
                    <div className='flex flex-col mt-auto ml-auto'>
                        {/* Save toggle button */}
                        <button 
                            className="p-1 rounded-full hover:bg-[#214933]/10 transition-colors duration-200" 
                            onClick={handleSaveToggle}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill={isSaved ? '#214933' : 'none'} viewBox="0 0 24 24" strokeWidth="2" stroke="#214933" className="size-6"> 
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
    )
}