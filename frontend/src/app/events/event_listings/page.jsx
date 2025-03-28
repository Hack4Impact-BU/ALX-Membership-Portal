'use client'

import { useState, useEffect } from "react";
import ReusableHeader from "@/components/ReusableHeader/ReusableHeader";
import Eventing from "./components/EventListings/EventListings";
import { Inter, Proza_Libre } from 'next/font/google';
import Hyperlinks from '@/components/Hyperlinks';

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function EventListings() {
  const [search, setSearch] = useState("");
  const [eventType, setEventType] = useState("");
  const [date, setDate] = useState("");
  const [distance, setDistance] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [events, setEvents] = useState([]);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleEventType = (e) => setEventType(e.target.value);
  const handleDate = (e) => setDate(e.target.value);
  const handleDistance = (e) => setDistance(e.target.value);
  const handleZipCode = (e) => {
    const value = e.target.value;
    // Allow only numeric values and ensure the length does not exceed 5
    if (/^\d*$/.test(value) && value.length <= 5) {
      setZipCode(value);
    }
  };

  const toggleShowSavedOnly = () => setShowSavedOnly(!showSavedOnly)
  

  return (
    <div className="w-11/12 text-white mt-20 h-screen">
        <ReusableHeader header={"Upcoming Events"} translation={"*    Próximos eventos"} isAdmin={true} directTo={"/events/event_listings/create"}/>


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
                        <option value="Community Event">Community Event</option>
                        <option value="Workshop/Seminar">Workshops/Seminars</option>
                        <option value="Expo/Conference">Expos/Conference</option>
                        <option value="Health & Wellness">Health & Wellness</option>
                        <option value="Networking Event">Networking Events</option>
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
                  <p>Distance</p>
                  <select
                    value={distance}
                    onChange={handleDistance}
                    className="p-4 rounded-md bg-[#335843] w-48 font-light"
                  >
                        <option value="">Select Distance</option>
                        <option value="5">5 miles</option>
                        <option value="10">10 miles</option>
                        <option value="25">25 miles</option>
                        <option value="50">50 miles</option>
                        <option value="100">100 miles</option>
                  </select>
              </div>

              <div className="flex flex-col gap-2">
                  <p>Zip Code:</p>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={handleZipCode}
                    placeholder="Zip Code"
                    className="p-3 rounded-md bg-gray-100 text-gray-800"
                />
              </div>
          </div>

          <button
                  className={`p-3 text-green-900 h-1/2 w-3/12 rounded-md ${
                    showSavedOnly ? "bg-green-500" : "bg-white"
                  }`}
                  onClick={toggleShowSavedOnly}>
            {showSavedOnly ? "Show All" : "Show Saved"}
          </button>
          

        </div>

        {/* Event Cards */}
        

        <Eventing eventType={eventType} searchField={search} showSavedOnly={showSavedOnly}/>
        <Hyperlinks />
                  
      </div>
    </div>
  );
}
