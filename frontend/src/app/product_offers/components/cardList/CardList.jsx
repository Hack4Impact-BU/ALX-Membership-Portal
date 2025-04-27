'use client'

import { useState, useEffect } from "react"
import Card from "../card/card"
import AdminCard from "../adminCard/adminCard"
import { Montserrat } from "next/font/google"
import BookmarksIcon from '@mui/icons-material/Bookmarks';

const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['400', '500', '700'], // Define weights if needed
  })


export default function CardList( { isAdmin } ) {

    const [card, setCard] = useState([]); // Start with an empty list
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Track errors during fetch
    const [businessTypes, setBusinessTypes] = useState([]); // Dynamic business types
    const [cities, setCities] = useState([]); // Dynamic cities

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
          
          // Extract unique cities from the 'place' field
          const extractedCities = [...new Set(data.map(offer => offer.place?.split(',')[0].trim()).filter(Boolean))];
          setCities(extractedCities);
          
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
    const [selectedCity, setSelectedCity] = useState(""); // State for selected city

    // Handler function to update offer save status in the main state
    const handleSaveStatusChange = (offerId, newStatus) => {
        setCard(prevCards => 
          prevCards.map(offer => 
            offer.id === offerId ? { ...offer, isSaved: newStatus } : offer
          )
        );
        // Optional: Log the update for debugging
        console.log(`Updated offer ${offerId} saved status to ${newStatus} in CardList.`);
      };

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to midnight to compare dates only

    const filteredCards = card.filter(offer => {
        const cityMatch = !selectedCity || (offer.place && offer.place.toLowerCase().includes(selectedCity.toLowerCase()));
        const typeMatch = !selectedBusinessType || offer.businessType === selectedBusinessType;
        const savedMatch = renderSaved ? offer.isSaved : true;

        // Date filtering logic: Only include if endDate is not in the past
        let isFutureEvent = true; // Default to true if no endDate or parsing fails
        if (offer.endDate) {
            try {
                const eventStartDate = new Date(offer.startDate);
                // Consider the event valid until the end of its endDate
                eventStartDate.setHours(23, 59, 59, 999);
                isFutureEvent = eventStartDate >= currentDate;
            } catch (e) {
                console.error("Error parsing startDate:", offer.startDate, e);
                // Keep the offer if the date is invalid, or decide otherwise
            }
        }

        return typeMatch
               && cityMatch
               && savedMatch
               && isFutureEvent; // Add date check
    });

    const handleSaved = () => {
        setRenderSaved(!renderSaved);
    };

    const handleBusinessTypeChange = (e) => {
        setSelectedBusinessType(e.target.value);
    };

    const handleCityChange = (e) => { // Handler for city change
        setSelectedCity(e.target.value);
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
                                    onSaveChange={handleSaveStatusChange}
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
                                    onSaveChange={handleSaveStatusChange}
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

                    {/* City Filter */}
                    <div>
                        <p className={`text-[#F6F2E9] text-base ${montserrat.className}`}>City</p>
                        <div className="w-72">
                            <select
                                className={`w-full h-14 rounded-md bg-[#335843] px-3 py-2 text-white shadow-md ${montserrat.className}`}
                                value={selectedCity}
                                onChange={handleCityChange} // Use city handler
                            >
                                <option value="">Select City</option>
                                {cities.map((city, index) => ( // Use cities state
                                    <option key={index} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Saved Button */}
                    <button 
                        onClick={handleSaved}
                        className={`py-3 px-6 rounded-lg flex items-center justify-center w-[14rem] gap-2 shadow-lg transition-all ${
                        renderSaved 
                            ? 'bg-white text-[#214933]' 
                            : 'bg-[#214933] text-white border border-white'
                        }`}
                    >
                        <BookmarksIcon />
                        {renderSaved ? 'Showing Saved' : 'Show Saved'}
                    </button>
                </div>
            </div>
        </div>
    );
}