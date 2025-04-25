'use client'

import { useState, useEffect } from "react"
import Card from "../card/card"
import AdminCard from "../adminCard/adminCard"
import { Montserrat } from "next/font/google"
const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['400', '500', '700'], // Define weights if needed
  })


export default function CardList( { isAdmin } ) {

    const [card, setCard] = useState([]); // Start with an empty list
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Track errors during fetch
    const [businessTypes, setBusinessTypes] = useState([]); // Dynamic business types

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  
    useEffect(() => {
      const fetchCards = async () => {
        setLoading(true); // Set loading true at the start
        setError(null); // Reset error state
        try {
          // Retrieve the auth token
          const token = localStorage.getItem('authToken') || 
                        localStorage.getItem('idToken') || 
                        localStorage.getItem('auth0Token') ||
                        localStorage.getItem('token');

          // Prepare headers object
          const headers = {};
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            console.log("Fetching product offers with auth token.");
          } else {
            console.log("Fetching product offers without auth token.");
          }

          const response = await fetch(`${apiBaseUrl}/product_offers`, { headers });
          if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Failed to fetch offers: ${response.status} - ${errorText}`);
          }

          const data = await response.json();
          console.log("Fetched product offers:", data);
          const savedCount = data.filter(offer => offer.isSaved).length;
          console.log(`Initial fetch returned ${data.length} offers, ${savedCount} marked as saved.`);

          setCard(data); // Set the fetched data with correct isSaved status
          
          // Extract unique business types
          const types = [...new Set(data.map(offer => offer.businessType))].filter(Boolean);
          setBusinessTypes(types);
          
        } catch (err) {
          console.error("Error fetching product offers:", err); // Log the detailed error
          setError(err.message);
        } finally {
          setLoading(false); // Set loading false in finally block
        }
      };

      fetchCards();
    }, []); // Runs once on component mount

    const [renderSaved, setRenderSaved] = useState(false);
    const [selectedBusinessType, setSelectedBusinessType] = useState("");
    const [selectedDistance, setSelectedDistance] = useState("");

    const filteredCards = card.filter(offer => {
        return (!selectedBusinessType || offer.businessType === selectedBusinessType)
               // Add distance filter here if needed in the future
               // Add renderSaved filter here
               && (renderSaved ? offer.isSaved : true);
    });

    const handleSaved = () => {
        setRenderSaved(!renderSaved);
    };

    const distance = [5, 10, 15, 20, 25, 30];

    const handleBusinessTypeChange = (e) => {
        setSelectedBusinessType(e.target.value);
    };

    const handleDistanceChange = (e) => {
        setSelectedDistance(e.target.value);
    };

    return (
        <div className="flex flex-col text-white mt-24 ">
            {/* Main Content */}
            <div className="flex flex-row gap-10 h-auto">
                {/* Cards Grid  ---------------------------------CHANGED TO RENDER REGULAR CARD RATHER THAN ADMINCARD*/}
                <div className="grid grid-cols-2 gap-6 p-10 w-[47rem] min-h-[50rem] content-start">
                    {loading ? (
                        <div className="col-span-2 text-center self-start">Loading offers...</div>
                    ) : error ? (
                        <div className="col-span-2 text-center text-red-500 self-start">Error: {error}</div>
                    ) : (renderSaved ? filteredCards.filter(offer => offer.isSaved) : filteredCards).length === 0 ? (
                        <div className="col-span-2 text-center self-start">No offers found</div>
                    ) : (
                        (renderSaved ? filteredCards.filter(offer => offer.isSaved) : filteredCards).map((offer, index) => (
                            isAdmin ? (
                                <AdminCard
                                    key={index}
                                    offerTitle={offer.offerTitle}
                                    businessType={offer.businessType}
                                    offerDesc={offer.offerDesc}
                                    place={offer.place}
                                    pic_url={offer.pic_url}
                                    startDate={offer.startDate}
                                    endDate={offer.endDate}
                                    isSaved={offer.isSaved}
                                    index={index}
                                    id={offer.id}

                                />
                            ) : (
                                <Card   
                                    key={index}
                                offerTitle={offer.offerTitle}
                                businessType={offer.businessType}
                                offerDesc={offer.offerDesc}
                                place={offer.place}
                                pic_url={offer.pic_url}
                                startDate={offer.startDate}
                                endDate={offer.endDate}
                                isSaved={offer.isSaved}
                                index={index}
                                id={offer.id}
                            />
                            )
                        ))
                    )}
                </div>

                {/* Filters Section */}
                <div className="flex flex-col gap-6 p-6">
                    {/* Business Type Filter */}
                    <div>
                        <p className={`text-[#F6F2E9] text-base ${montserrat.className}`}>Business Type</p>
                        <div className="w-72">
                            <select 
                                className={`w-full h-14 rounded-md bg-[#335843] px-3 py-2 text-white shadow-md ${montserrat.className}`}
                                value={selectedBusinessType}
                                onChange={handleBusinessTypeChange}
                            >
                                <option value="">Select Type</option>
                                {businessTypes.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Distance Filter */}
                    <div>
                        <p className={`text-[#F6F2E9] text-base ${montserrat.className}`}>Distance</p>
                        <div className="w-72">
                            <select 
                                className={`w-full h-14 rounded-md bg-[#335843] px-3 py-2 text-white shadow-md ${montserrat.className}`}
                                value={selectedDistance}
                                onChange={handleDistanceChange}
                            >
                                <option value="">Select Distance</option>
                                {distance.map((dist, index) => (
                                    <option key={index} value={dist}>{dist} km</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Saved Button */}
                    <div className="flex flex-row w-[130px] h-[60px] mt-4 rounded-md gap-4 bg-[#F6F2E9] hover:cursor-pointer justify-center items-center" onClick={handleSaved}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill={renderSaved ? '#214933' : 'none'} viewBox="0 0 24 24" stroke-width="2" stroke="#214933" className="size-8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg>
                        <p className={`text-[#214933] text-base ${montserrat.className}`}>Saved</p>
                    </div>
                </div>
            </div>
        </div>
    );
}