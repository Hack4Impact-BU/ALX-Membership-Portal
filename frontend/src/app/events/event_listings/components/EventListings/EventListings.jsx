import { useState, useEffect } from "react";
import EventCard from "../EventCards/EventCards";
import EventCardAdmin from "../EventCardsAdmin/EventCardsAdmin";

export default function Eventing({ eventType, searchField, showSavedOnly }) {
 
  const [events, setEvents] = useState([]); // Start with an empty list
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors during fetch

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/eventlists`); // Adjust endpoint URL as needed
        if (!response.ok) throw new Error("Failed to fetch events");

        const data = await response.json(); // Parse JSON response
        setEvents(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const toggleCardSaved = (id) => {
    setEvents((prevEvents) => 
      prevEvents.map((event) =>
      event.EventID === id ? { ...event, saved: !event.saved} : event))
  };
  

// Filter events based on the eventType prop
const filteredEvents = events
  .filter((event) => 
    eventType ? event.EventType.toLowerCase().includes(eventType.toLowerCase()) : true
  )
  .filter((event) => 
    searchField ? event.EventName.toLowerCase().includes(searchField.toLowerCase()) : true
  )
  .filter((event) =>
    (showSavedOnly ? event.saved : true)
  );

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error loading events: {error}</p>;

  function formatTime(timeString) {
    // Extract the hour from the string
    let [hour, minute] = timeString.split("T")[1].split(":");
    hour = parseInt(hour); // Convert to number

    // Determine AM/PM
    let period = hour >= 12 ? "PM" : "AM";
    
    // Convert to 12-hour format
    hour = hour % 12 || 12; // Convert 0 to 12 for midnight case

    return `${hour}:${minute} ${period}`; // Append "UTC" or desired timezone
}

//////////////////change the eventcard admin 

return (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredEvents.map((event) => (
    <EventCardAdmin
      key={event.id}
      id={event.id}
      EventName={event.eventName}
      Location={event.location}
      Date={event.startDate}
      Time={formatTime(event.timeStart)}
      EventOrganizer={event.org}
      PhoneNumber={event.phone}
      EventDescription={event.eventDesc}
      WebsiteLink={event.websiteLink || "#"}
      ZipCode={event.ZipCode}
      EventImage={event.pic}
      toggleCardSaved={event.toggleCardSaved}
    />
  ))}
</div>
);
}
