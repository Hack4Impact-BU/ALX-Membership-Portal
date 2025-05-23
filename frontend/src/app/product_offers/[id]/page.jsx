'use client'

import { Proza_Libre } from 'next/font/google'; // Import the Proza Libre font
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function Page() {
    const { id } = useParams();
    const [offerData, setOfferData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaved, setIsSaved] = useState(false); // Initial state, updated by fetch
    
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        const fetchOfferData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Include auth token in initial fetch to get correct isSaved status
                const token = localStorage.getItem('authToken') || localStorage.getItem('idToken') || localStorage.getItem('auth0Token') || localStorage.getItem('token');
                const headers = {};
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const response = await fetch(`${apiBaseUrl}/product_offers/${id}`, {
                    headers: headers,
                });

                if (!response.ok) {
                    throw new Error(`Failed to load offer details (Status: ${response.status})`);
                }

                const data = await response.json();
                setOfferData(data);
                // Set saved status from fetched data
                setIsSaved(!!data.isSaved);
                console.log("Fetched offer data:", data);

            } catch (err) {
                console.error('Error fetching offer:', err);
                setError(err.message);
                setOfferData(null); // Clear potentially stale data
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOfferData();
        } else {
            setError("Offer ID is missing.");
            setLoading(false);
        }
    }, [id, apiBaseUrl]); // Add apiBaseUrl dependency

    // Unified function to handle saving/unsaving, mirroring card logic
    const handleSaveToggle = async () => {
        const newSavedStatus = !isSaved;
        const action = newSavedStatus ? 'saving' : 'unsaving';

        // Optimistic UI update
        setIsSaved(newSavedStatus);

        try {
            // Retrieve auth token
            const token = localStorage.getItem('authToken') ||
                          localStorage.getItem('idToken') ||
                          localStorage.getItem('auth0Token') ||
                          localStorage.getItem('token');

            if (!token) {
                console.error('Authentication token not found.');
                alert('Please log in to save offers.');
                // Revert optimistic update if token is missing
                setIsSaved(!newSavedStatus);
                return;
            }

            const headers = { 'Authorization': `Bearer ${token}` };
            const method = newSavedStatus ? 'POST' : 'DELETE';

            // API call to the /save endpoint
            const response = await fetch(`${apiBaseUrl}/product_offers/${id}/save`, {
                method: method,
                headers: headers,
            });

            if (!response.ok) {
                let errorData = { message: `Request failed with status ${response.status}` };
                try {
                    const potentialJson = await response.json();
                    errorData = potentialJson;
                } catch (e) {
                    errorData.message = response.statusText || errorData.message;
                    console.warn("Response was not JSON or text() failed:", e);
                }
                throw new Error(errorData.message || `Failed to ${action} offer`);
            }

            console.log(`Offer ${action} successful.`);
            // UI state already updated optimistically

        } catch (error) {
            console.error(`Error ${action} offer:`, error);
            // Revert optimistic update on error
            setIsSaved(!newSavedStatus);
            alert(`Could not ${action} the offer. ${error.message}. Please try again.`);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error || !offerData) return <div className="flex justify-center items-center h-screen text-red-500">{error || "Offer data could not be loaded."}</div>;
  
    const { offerTitle, place, link, pic_url, startDate, offerDesc, instruct } = offerData;
  
    return (
      <div className="flex flex-col w-full h-[1280px]">
        <div className="flex flex-row gap-8 w-full h-2/5 p-12">
            <div className="flex flex-col justify-center items-center basis-1/2 h-full bg-[#F6F2E9] rounded-xl p-8">
                {pic_url ? (
                  <img 
                    src={pic_url} 
                    alt={offerTitle}
                    className="max-w-full max-h-full object-contain rounded-xl"
                    onError={(e) => {
                      console.log("Image failed to load:", pic_url);
                      e.target.onerror = null;
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                                <span className="text-gray-500">No image available</span>
                  </div>
                )}
            </div>
            <div className="flex flex-col justify-around items-start basis-1/2 h-full bg-[#F6F2E9] rounded-xl p-12">
                <div className="flex flex-row gap-4 justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#214933" className="size-14">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                    </svg>
                    <p className={`text-2xl text-[#214933] ${prozaLibre.className}`}>{offerTitle}</p>
                </div>
                <div className="flex flex-row gap-4 justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#214933" className="size-14">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                    <p className={`text-2xl text-[#214933] ${prozaLibre.className}`}>{startDate}</p>
                </div>
                <div className="flex flex-row gap-4 justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#214933" className="size-14">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    <p className={`text-2xl text-[#214933] ${prozaLibre.className}`}>{place}</p>
                </div>
            </div>
        </div>
        <div className='flex flex-row h-3/5 w-full px-12 mt-[-1rem]'>
            <div className='flex flex-col w-full h-full bg-[#F6F2E9] rounded-xl p-12'>
                <div className='flex flex-row justify-between items-center gap-2'>
                    <div className='flex flex-row ju items-center gap-8'>
                        <p className={`text-5xl text-[#214933] ${prozaLibre.className}`}>{place}</p>
                    </div>
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill={isSaved ? '#214933' : 'none'} // Use isSaved state for fill
                        viewBox="0 0 24 24" 
                        stroke-width="2" 
                        stroke="#214933" 
                        className="size-20 cursor-pointer" // Add cursor-pointer
                        onClick={handleSaveToggle} // Add onClick handler
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                    </svg>
                </div>

                <p className={`text-[60px] text-black ${prozaLibre.className} my-4`}>{offerTitle}</p>

                <p className={`text-2xl text-black ${prozaLibre.className} mb-4`}>Offer Description:<br/>{offerDesc}</p>

                <div className="w-full h-1 bg-[#214933] mt-12 mb-6"></div>

                <p className={`text-2xl text-black ${prozaLibre.className} mb-4`}>Instructions to Redeem:</p>
                {instruct && (
                  <ul className={`text-2xl text-black ${prozaLibre.className} list-disc pl-8`}>
                    {instruct.split(". ").filter(instruction => instruction.trim()).map((instruction, index) => (
                      <li key={index}>{instruction.trim()}</li>
                    ))}
                  </ul>
                )}
            </div>
        </div>
      </div>
    );
  }
  