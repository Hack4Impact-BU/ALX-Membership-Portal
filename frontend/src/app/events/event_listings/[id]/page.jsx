'use client';
import { useState, useEffect } from 'react';
import { Proza_Libre } from 'next/font/google'; // Import the Proza Libre font

const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function Page({ params }) {
    const { id } = params;
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    
    useEffect(() => {
        const fetchEventData = async () => {
            try {
                // Fetch event data from API
                const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await fetch(`${apiBaseUrl}/eventlists/${id}`);
                
                if (!response.ok) {
                    throw new Error('Failed to load event details');
                }
                
                const data = await response.json();
                setEventData(data);
                setIsSaved(data.isSaved);
                setLoading(false);
                console.log(data);
            } catch (err) {
                console.error('Error fetching event:', err);
                setError(err.message);
                setLoading(false);
            }
        };
        
        fetchEventData();
    }, [id]);

    const handleSaveToggle = async () => {
        const newSavedStatus = !isSaved;
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        
        try {
            // Make API request to update saved status
            const response = await fetch(`${apiBaseUrl}/eventlists/${id}`, {
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
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#F6F2E9]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#214933] mx-auto mb-4"></div>
                    <p className={`text-xl text-[#214933] ${prozaLibre.className}`}>Loading event details...</p>
                </div>
            </div>
        );
    }
    
    // Error state
    if (error || !eventData) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#F6F2E9]">
                <div className="text-center p-8 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className={`text-2xl text-red-500 ${prozaLibre.className} mb-4`}>Failed to load event details</p>
                    <p className={`text-gray-600 ${prozaLibre.className}`}>{error || "The event may not exist or has been removed."}</p>
                    <button 
                        onClick={() => window.history.back()} 
                        className="mt-6 px-6 py-2 bg-[#214933] text-white rounded-lg hover:bg-[#1a3a29] transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }
    
    // Extract event properties from fetched data with correct field mappings
    const {
        eventDesc: EventDescription,
        location: Location,
        instruct: WebsiteLink,
        pic,
        startDate: Date,
        timeStart: Time,
        eventName: EventName,
        org: EventOrganizer,
        image_url,
        phone: PhoneNumber,
    } = eventData;

    return (
      <div className="flex flex-col w-full h-[1280px]">
        <div className="flex flex-row gap-8 w-full h-2/5 p-12">
            <div className="flex flex-col justify-center items-center basis-1/2 h-full bg-[#F6F2E9] rounded-xl">
                {EventName && (
                    <div className="w-full h-64 md:h-96 flex justify-center items-center">
                        {image_url ? (
                            <img 
                                src={image_url} 
                                alt={EventName} 
                                className="max-w-full h-full object-contain border rounded-xl"
                                onError={(e) => {
                                  console.log("Image failed to load:", image_url);
                                  e.target.onerror = null;
                                  e.target.style.display = "none";
                                }}
                            />
                        ) : image_url ? (
                            <img 
                                src={image_url} 
                                alt={EventName} 
                                className="max-w-full h-full object-contain border rounded-xl"
                                onError={(e) => {
                                  console.log("Image failed to load:", image_url);
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
                )}
            </div>
            <div className="flex flex-col justify-around items-start basis-1/2 h-full bg-[#F6F2E9] rounded-xl p-12">
                <div className="flex flex-row gap-4 justify-center items-center">

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#214933" class="size-14">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                    <p className={`text-2xl text-[#214933] ${prozaLibre.className}`}>{Date}</p>
                </div>
                <div className="flex flex-row gap-4 justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#214933" className="size-14">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>

                    <p className={`text-2xl text-[#214933] ${prozaLibre.className}`}>{Time}</p>
                </div>
                <div className="flex flex-row gap-4 justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#214933" class="size-14">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    <p className={`text-2xl text-[#214933] ${prozaLibre.className}`}>{Location}</p>
                </div>
                <div className="h-1 bg-[#214933] w-full"></div>

                <div className='flex flex-row gap-4 justify-center items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#214933" className="size-14">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                    </svg>
                    <p className={`text-2xl text-[#214933] ${prozaLibre.className}`}>{PhoneNumber || "(123)-456-7890"}</p>
                </div>

            </div>
        </div>
        <div className='flex flex-row h-3/5 w-full px-12 mt-[-1rem]'>
            <div className='flex flex-col w-full h-full bg-[#F6F2E9] rounded-xl p-12'>
                <div className='flex flex-row justify-between items-center gap-2'>
                    <div className='flex flex-row ju items-center gap-8'>
                        {image_url ? (
                            <img 
                                src={image_url} 
                                alt="Organizer" 
                                className="w-36 h-36 object-cover rounded-full"
                                onError={(e) => {
                                  console.log("Profile image failed to load:", image_url);
                                  e.target.onerror = null;
                                  e.target.style.display = "none";
                                  e.target.parentElement.innerHTML = '<div class="w-36 h-36 bg-red-400 rounded-full"></div>';
                                }}
                            />
                        ) : (
                            <div className="w-36 h-36 bg-red-400 rounded-full"/>
                        )}
                        <p className={`text-3xl text-black ${prozaLibre.className}`}>{EventOrganizer || Location}</p>
                    </div>
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill={isSaved ? '#214933' : 'none'} 
                        viewBox="0 0 24 24" 
                        stroke-width="2" 
                        stroke="#214933" 
                        className="size-20 cursor-pointer"
                        onClick={handleSaveToggle}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                    </svg>
                </div>

                <p className={`text-[60px] text-black ${prozaLibre.className} my-4`}>{EventName}</p>

                <p className={`text-2xl text-black ${prozaLibre.className} mt-12 mb-4`}>Event Description:<br/>{EventDescription || "No description available"}</p>

                <div className="w-full h-1 bg-[#214933] mt-12 mb-6"></div>

                <p className={`text-2xl text-black ${prozaLibre.className} mb-4`}>Instructions for event:</p>
                <ul>
                    <li>{WebsiteLink || "No website link available"}</li>
                </ul>
            </div>
        </div>
      </div>
    );
}
  