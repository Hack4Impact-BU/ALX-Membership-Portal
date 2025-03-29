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
        console.log("Fetched data:", data)
        setEvents(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);
  
  // Safe access function to handle different property naming conventions
  const getEventProperty = (event, propertyName) => {
    // Try both camelCase and PascalCase versions of the property
    const camelCase = propertyName.charAt(0).toLowerCase() + propertyName.slice(1);
    const pascalCase = propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
    
    return event[camelCase] || event[pascalCase] || '';
  };

  // Filter events based on the eventType prop
  const filteredEvents = events
    .filter((event) => {
      if (!eventType) return true;
      const eventTypeValue = getEventProperty(event, 'eventType');
      return eventTypeValue.toLowerCase().includes(eventType.toLowerCase());
    })
    .filter((event) => {
      if (!searchField) return true;
      const eventName = getEventProperty(event, 'eventName');
      return eventName.toLowerCase().includes(searchField.toLowerCase());
    })
    .filter((event) => (showSavedOnly ? event.isSaved : true));

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
        EventName={getEventProperty(event, 'eventName')}
        Location={getEventProperty(event, 'location')}
        Date={getEventProperty(event, 'startDate')}
        Time={formatTime(getEventProperty(event, 'timeStart'))}
        EventOrganizer={getEventProperty(event, 'org')}
        PhoneNumber={getEventProperty(event, 'phone')}
        EventDescription={getEventProperty(event, 'eventDesc')}
        WebsiteLink={getEventProperty(event, 'websiteLink') || "#"}
        ZipCode={getEventProperty(event, 'zipCode')}
        EventImage={getEventProperty(event, 'pic')}
        image_url={getEventProperty(event, 'image_url')}
        saved={event.isSaved}
      />
    ))}
  </div>
  );
}
