import { useState, useEffect, useMemo } from "react";
import EventCard from "../EventCards/EventCards";
import EventCardAdmin from "../EventCardsAdmin/EventCardsAdmin";

// Helper function to get the start of a date (midnight)
const getStartOfDay = (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
};

export default function Eventing({ eventType, searchField, showSavedOnly, isAdmin, events, selectedLocation, selectedDateRange, onSaveChange }) {
 
  // Remove the internal state and useEffect for fetching
  // const [events, setEvents] = useState([]); 
  // const [loading, setLoading] = useState(true); 
  // const [error, setError] = useState(null); 

  // const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Remove the useEffect hook entirely
  /*
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
  */

  
  // Safe access function to handle different property naming conventions
  const getEventProperty = (event, propertyName) => {
    // Try both camelCase and PascalCase versions of the property
    const camelCase = propertyName.charAt(0).toLowerCase() + propertyName.slice(1);
    const pascalCase = propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
    
    return event[camelCase] || event[pascalCase] || '';
  };

  // Memoize the filtered events calculation
  const filteredEvents = useMemo(() => {
    console.log("Recalculating filtered events with date range:", selectedDateRange);
    const today = getStartOfDay(new Date());

    return events // Use prop here
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
      .filter((event) => {
          if (!selectedLocation) return true;
          const eventLocation = getEventProperty(event, 'location');
          const eventCity = eventLocation?.split(',')[0].trim();
          return eventCity && eventCity.toLowerCase() === selectedLocation.toLowerCase();
      })
      .filter((event) => { // Filter for present and future events
          const eventDateStr = getEventProperty(event, 'startDate');
          if (!eventDateStr) return false;
          try {
              const eventDate = new Date(eventDateStr);
              // Check if eventDate is valid before setting hours
              if (isNaN(eventDate.getTime())) {
                  console.error("Invalid event date string:", eventDateStr);
                  return false; // Exclude invalid dates
              }
              eventDate.setHours(0, 0, 0, 0); // Set event date to midnight
              return eventDate >= today;
          } catch (e) {
              console.error("Error parsing event date:", eventDateStr, e);
              return false;
          }
      })
      .filter((event) => { // Filter for selected date range
          if (!selectedDateRange) return true; // No specific range selected

          const eventDateStr = getEventProperty(event, 'startDate');
          let eventDate;
          try {
              const parsedDate = new Date(eventDateStr);
              if (isNaN(parsedDate.getTime())) return false;
              eventDate = getStartOfDay(parsedDate);
          } catch (e) {
              return false;
          }

          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);

          switch (selectedDateRange) {
              case "today":
                  return eventDate.getTime() === today.getTime();
              case "tomorrow":
                  return eventDate.getTime() === tomorrow.getTime();
              case "this-weekend": {
                  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
                  const saturday = new Date(today);
                  saturday.setDate(today.getDate() + (6 - dayOfWeek)); // Find upcoming Saturday
                  const sunday = new Date(saturday);
                  sunday.setDate(saturday.getDate() + 1);
                  return eventDate.getTime() === saturday.getTime() || eventDate.getTime() === sunday.getTime();
              }
              case "next-week": {
                  const dayOfWeek = today.getDay();
                  const nextMonday = new Date(today);
                  nextMonday.setDate(today.getDate() + (8 - dayOfWeek) % 7); // Find next Monday (adjusts if today is Sunday)
                  if (dayOfWeek === 0) nextMonday.setDate(today.getDate() + 1); // Handle Sunday case explicitly
                  if (dayOfWeek === 1) nextMonday.setDate(today.getDate() + 7); // If today is Monday, get next Monday
                  
                  const nextSunday = new Date(nextMonday);
                  nextSunday.setDate(nextMonday.getDate() + 6);
                  return eventDate >= nextMonday && eventDate <= nextSunday;
              }
              case "next-month": {
                  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
                  const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0); // Day 0 of month after next = last day of next month
                  return eventDate >= nextMonth && eventDate <= endOfNextMonth;
              }
              default:
                  return true; // Should not happen with defined options, but safe fallback
          }
      })
      .filter((event) => (showSavedOnly ? event.isSaved : true));

  }, [events, eventType, searchField, selectedLocation, showSavedOnly, selectedDateRange]); // Dependencies for useMemo

  // Remove loading/error checks based on internal fetch
  // if (loading) return <p>Loading events...</p>;
  // if (error) return <p>Error loading events: {error}</p>;

  // Check if the received events array is empty or filtering results in empty
   if (!events || events.length === 0) {
     return <p>No events available.</p>; 
   }
   if (filteredEvents.length === 0) {
     return <p>No events match your current filters.</p>;
   }

  function formatTime(timeString) {
    if (!timeString || !timeString.includes('T')) {
        console.warn("Invalid timeString format:", timeString);
        return "Invalid Time"; // Or some default/fallback string
    }
    try {
        let [hour, minute] = timeString.split("T")[1].split(":");
        hour = parseInt(hour); // Convert to number

        if (isNaN(hour) || isNaN(parseInt(minute))) {
            console.warn("Could not parse hour/minute from timeString:", timeString);
            return "Invalid Time";
        }

        let period = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;

        return `${hour}:${minute} ${period}`;
    } catch (e) {
        console.error("Error formatting time:", timeString, e);
        return "Invalid Time";
    }
  }

  //////////////////change the eventcard admin 

  return (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredEvents.map((event) => (
      isAdmin ? (
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
        onSaveChange={onSaveChange}
      />
      ) : (
        <EventCard
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
        onSaveChange={onSaveChange}
        />
      )
    ))}
  </div>
  );
}
