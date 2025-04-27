'use client'

import { useState, useEffect } from "react";
import ReusableHeader from "@/components/ReusableHeader/ReusableHeader";
import Eventing from "./components/EventListings/EventListings";
import { Inter, Proza_Libre } from 'next/font/google';
import Hyperlinks from '@/components/Hyperlinks';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import { useAdmin } from "@/middleware/useAdmin";


const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function EventListings() {
  const { isAdmin, isLoading } = useAdmin();

  const [search, setSearch] = useState("");
  const [eventType, setEventType] = useState("");
  const [date, setDate] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [locations, setLocations] = useState([]);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleEventType = (e) => setEventType(e.target.value);
  const handleDate = (e) => setDate(e.target.value);
  const handleLocationChange = (e) => setSelectedLocation(e.target.value);
  const handleZipCode = (e) => {
    const value = e.target.value;
    // Allow only numeric values and ensure the length does not exceed 5
    if (/^\d*$/.test(value) && value.length <= 5) {
      setZipCode(value);
    }
  };

  const toggleShowSavedOnly = () => setShowSavedOnly(!showSavedOnly)
  
  // Fetch events and extract unique event types and locations
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        
        // Retrieve the auth token
        const token = localStorage.getItem('authToken') || 
                      localStorage.getItem('idToken') || 
                      localStorage.getItem('auth0Token') ||
                      localStorage.getItem('token');

        // Prepare headers object - include Authorization only if token exists
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
          console.log("Fetching initial events with auth token."); // Log for debugging
        } else {
          console.log("Fetching initial events without auth token (user likely not logged in)."); 
        }

        // Make the fetch request with the headers
        const response = await fetch(`${apiBaseUrl}/eventlists`, { headers }); 
        
        if (!response.ok) {
            const errorText = await response.text(); // Get error text for debugging
            throw new Error(`Failed to fetch events: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        
        // Log saved status from initial fetch
        const savedCount = data.filter(event => event.isSaved).length;
        console.log(`Initial fetch returned ${data.length} events, ${savedCount} marked as saved.`);

        setEvents(data); // Events now have the correct isSaved status if user was authenticated
        
        // Extract unique event types
        const uniqueEventTypes = [...new Set(data.map(event => event.eventType))].filter(Boolean);
        setEventTypes(uniqueEventTypes);

        // Extract unique locations (assuming event.location exists and is like 'City, State')
        const uniqueLocations = [...new Set(data.map(event => event.location?.split(',')[0].trim()).filter(Boolean))];
        setLocations(uniqueLocations);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []); // Empty dependency array means this runs once on mount

  // Handler function to update event save status in the main state
  const handleSaveStatusChange = (eventId, newStatus) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId ? { ...event, isSaved: newStatus } : event
      )
    );
    // Optional: Log the update for debugging
    console.log(`Updated event ${eventId} saved status to ${newStatus} in parent component.`);
  };

  return (
    <div className="w-11/12 text-white mt-20 h-screen">
        <ReusableHeader header={"Upcoming Events"} translation={"*    Próximos eventos"} isAdmin={isAdmin} directTo={"/events/event_listings/create"}/>


      <div className={`max-w-7xl p-8 mx-auto my-8 ${prozaLibre.className}`}>

        {/* Filters */}
        <div className="flex flex-wrap flex-col gap-4 mb-8">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search"
            className="p-3 w-96 rounded-full bg-[#335843]"
          />

          <div className="flex flex-row w-full gap-4">
              <div className="flex flex-col gap-2">
                  <p>Event Type</p>
                  <select
                    value={eventType}
                    onChange={handleEventType}
                    className="p-4 rounded-md bg-[#335843] w-48 font-light"
                  >
                        <option value="">Select Event Type</option>
                        {eventTypes.map((type, index) => (
                          <option key={index} value={type}>{type}</option>
                        ))}
                  </select>
              </div>
              <div className="flex flex-col gap-2">
                  <p>Date</p>
                  <select
                    value={date}
                    onChange={handleDate}
                    className="p-4 rounded-md bg-[#335843] w-48 font-light"
                  >
                        <option value="">Select Date</option>
                        <option value="today">Today</option>
                        <option value="tomorrow">Tomorrow</option>
                        <option value="this-weekend">This Weekend</option>
                        <option value="next-week">Next Week</option>
                        <option value="next-month">Next Month</option>
                  </select>
              </div>
              <div className="flex flex-col gap-2">
                  <p>Location</p>
                  <select
                    value={selectedLocation}
                    onChange={handleLocationChange}
                    className="p-4 rounded-md bg-[#335843] w-48 font-light"
                  >
                        <option value="">Select Location</option>
                        {locations.map((loc, index) => (
                          <option key={index} value={loc}>{loc}</option>
                        ))}
                  </select>
              </div>
          </div>

          <button 
            onClick={toggleShowSavedOnly}
            className={`py-3 px-6 rounded-lg flex items-center justify-center w-[14rem] gap-2 shadow-lg transition-all ${
              showSavedOnly 
                ? 'bg-white text-[#214933]' 
                : 'bg-[#214933] text-white border border-white'
            }`}
          >
            <BookmarksIcon />
            {showSavedOnly ? 'Showing Saved' : 'Show Saved'}
          </button>
          
        </div>

        {/* Event Cards */}
        

        <Eventing 
          isAdmin={isAdmin} 
          eventType={eventType} 
          searchField={search} 
          showSavedOnly={showSavedOnly}
          events={events}
          selectedLocation={selectedLocation}
          selectedDateRange={date}
          onSaveChange={handleSaveStatusChange}
        />
        <Hyperlinks />
                  
      </div>
    </div>
  );
}
