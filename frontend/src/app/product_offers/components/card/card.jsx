'use client'

import { Inter, Proza_Libre } from 'next/font/google'; // Import the Proza Libre font
import Link from 'next/link';
import { useState, useEffect } from 'react';

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function Card({ id, pic }) {
    const [offerData, setOfferData] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    useEffect(() => {
        // Fetch offer data using the id
        const fetchOfferData = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/product_offers/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch offer data');
                }
                const data = await response.json();
                setOfferData(data);
                setIsSaved(data.isSaved || false);
            } catch (error) {
                console.error('Error fetching offer data:', error);
            }
        };
        
        if (id) {
            fetchOfferData();
        }
    }, [id, apiBaseUrl]);
    
    const handleSaveToggle = async () => {
        const newSavedStatus = !isSaved;
        
        try {
            // Make API request to update saved status
            const response = await fetch(`${apiBaseUrl}/product_offers/${id}`, {
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
            console.log(`Offer ${newSavedStatus ? 'saved' : 'unsaved'} successfully`);
        } catch (error) {
            console.error('Error updating saved status:', error);
            // Optionally revert the UI state if the API call fails
            // setIsSaved(isSaved);
        }
    }
    
    // Return loading state if data is not yet available
    if (!offerData) {
        return <div className="border flex items-center justify-center rounded-3xl bg-[#F6F2E9] w-80 h-56">Loading...</div>;
    }
    
    // Destructure data once it's available
    const { offerTitle, place, link, pic_url, startDate, offerDesc, BusinessType, distance, instruct } = offerData;

    return (
            <div className="border flex flex-col justify-evenly rounded-3xl bg-[#F6F2E9] w-80 h-56 transition-transform duration-300 hover:scale-105">
                <Link href={`/benefits_discounts/${id}`}>
                <div className="flex flex-row justify-center items-center gap-2 hover:cursor-pointer">
                    {/* gonna be image circle */}
                    <img 
                        src={pic_url} 
                        alt={offerTitle}
                        onError={(e) => {
                            console.log("Image failed to load:", pic_url);
                            e.target.onerror = null;
                            e.target.style.display = "none";
                            e.target.parentNode.classList.add("bg-[#214933]");
                        }}
                        className="w-20 h-20 rounded-full object-cover"
                    />
                    <div className="flex items-center w-48 h-14 bg-white rounded-full">
                        <p className={`p-4 text-2xl text-[#214933] ${prozaLibre.className} overflow-hidden text-ellipsis whitespace-nowrap`}>{offerTitle}</p>
                    </div>
                </div>
                </Link>
                <div className='flex flex-row w-full pl-5 pr-5'>
                    <div className='flex flex-col justify-center'>
                        <p className={`text-sm ${prozaLibre.className} text-[#214933]`}>{place}</p>
                        <div className='w-16 h-px bg-black mt-2 mb-2'/>
                        <p className={`text-sm ${prozaLibre.className} text-[#214933] w-4/5`}>{offerTitle}</p>
                        <p className={`font-bold text-sm ${prozaLibre.className} text-[#214933]`}>{startDate}</p>
                        
                    </div>
                    <div className='flex flex-col mt-auto ml-auto'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill={isSaved ? '#214933' : 'none'} viewBox="0 0 24 24" stroke-width="2" stroke="#214933" class="size-6" onClick={handleSaveToggle}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg>
                    </div>
                </div>
            </div>
    )
}