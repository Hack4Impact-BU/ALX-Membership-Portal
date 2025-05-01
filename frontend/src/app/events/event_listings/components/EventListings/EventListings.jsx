import { useMemo } from "react";
import EventCard from "../EventCards/EventCards";
import EventCardAdmin from "../EventCardsAdmin/EventCardsAdmin";

/**
 * Gets the start of a given date (midnight).
 * @param {Date} date - The input date.
 * @returns {Date} A new Date object set to midnight of the input date.
 */
const getStartOfDay = (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
};

/**
 * Safely retrieves a property from an event object, checking both camelCase and PascalCase naming conventions.
 * This is necessary due to potential inconsistencies in the data source.
 * @param {object} event - The event object.
 * @param {string} propertyName - The desired property name (e.g., 'eventName').
 * @returns {any} The value of the property, or an empty string if not found.
 */
const getEventProperty = (event, propertyName) => {
    // Try both camelCase and PascalCase versions of the property
    const camelCase = propertyName.charAt(0).toLowerCase() + propertyName.slice(1);
    const pascalCase = propertyName.charAt(0).toUpperCase() + propertyName.slice(1);

    return event[camelCase] || event[pascalCase] || '';
};

/**
 * Formats a time string (expected format: "YYYY-MM-DDTHH:mm:ss") into a "H:MM AM/PM" format.
 * @param {string | undefined} timeString - The time string to format.
 * @returns {string} The formatted time string (e.g., "5:30 PM") or "Invalid Time" on error.
 */
const formatTime = (timeString) => {
    if (!timeString || typeof timeString !== 'string' || !timeString.includes('T')) {
        console.warn("Invalid or missing timeString format:", timeString);
        return "Invalid Time";
    }
    try {
        // Example: "2024-08-15T17:30:00" -> ["17", "30"]
        const timePart = timeString.split("T")[1];
        if (!timePart) return "Invalid Time";

        let [hourStr, minuteStr] = timePart.split(":");
        let hour = parseInt(hourStr, 10);
        let minute = parseInt(minuteStr, 10); // Keep minute as number for formatting later

        if (isNaN(hour) || isNaN(minute)) {
            console.warn("Could not parse hour/minute from timeString:", timeString);
            return "Invalid Time";
        }

        const period = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12; // Convert 24hr to 12hr format (0 becomes 12)
        const minutePadded = minute < 10 ? `0${minute}` : minute; // Add leading zero if needed

        return `${hour}:${minutePadded} ${period}`;
    } catch (e) {
        console.error("Error formatting time:", timeString, e);
        return "Invalid Time";
    }
};

/**
 * Filters an event based on a selected date range string relative to today.
 * @param {object} event - The event object to check.
 * @param {string | null | undefined} selectedDateRange - The selected range ('today', 'tomorrow', 'this-weekend', 'next-week', 'next-month').
 * @param {Date} today - A Date object representing the start of today (midnight).
 * @returns {boolean} True if the event falls within the selected range, false otherwise.
 */
const filterEventByDateRange = (event, selectedDateRange, today) => {
    if (!selectedDateRange) return true; // No specific range selected, include the event

    const eventDateStr = getEventProperty(event, 'startDate');
    let eventDate;
    try {
        const parsedDate = new Date(eventDateStr);
        if (isNaN(parsedDate.getTime())) {
            console.warn("Invalid event start date for filtering:", eventDateStr);
            return false; // Exclude events with invalid dates
        }
        eventDate = getStartOfDay(parsedDate); // Normalize event date to midnight for comparison
    } catch (e) {
        console.error("Error parsing event date for filtering:", eventDateStr, e);
        return false; // Exclude on error
    }

    const tomorrow = getStartOfDay(new Date(today));
    tomorrow.setDate(today.getDate() + 1);

    switch (selectedDateRange) {
        case "today":
            return eventDate.getTime() === today.getTime();
        case "tomorrow":
            return eventDate.getTime() === tomorrow.getTime();
        case "this-weekend": {
            const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
            const saturday = getStartOfDay(new Date(today));
            saturday.setDate(today.getDate() + (6 - dayOfWeek + 7) % 7); // Find upcoming Saturday (handles week wrap)
            if (saturday < today) saturday.setDate(saturday.getDate() + 7); // Ensure it's this weekend or next

            const sunday = getStartOfDay(new Date(saturday));
            sunday.setDate(saturday.getDate() + 1);

            return eventDate.getTime() === saturday.getTime() || eventDate.getTime() === sunday.getTime();
        }
        case "next-week": {
            const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            const nextMonday = getStartOfDay(new Date(today));
            // Calculate days until next Monday. If today is Sunday (0), add 1. If Monday (1), add 7. Otherwise add (8 - dayOfWeek).
            const daysToAdd = dayOfWeek === 0 ? 1 : (dayOfWeek === 1 ? 7 : (8 - dayOfWeek));
            nextMonday.setDate(today.getDate() + daysToAdd);

            const nextSunday = getStartOfDay(new Date(nextMonday));
            nextSunday.setDate(nextMonday.getDate() + 6);

            return eventDate >= nextMonday && eventDate <= nextSunday;
        }
        case "next-month": {
            const nextMonth = getStartOfDay(new Date(today.getFullYear(), today.getMonth() + 1, 1));
            const endOfNextMonth = getStartOfDay(new Date(today.getFullYear(), today.getMonth() + 2, 0)); // Day 0 of month after next = last day of next month
            return eventDate >= nextMonth && eventDate <= endOfNextMonth;
        }
        default:
             console.warn("Unknown date range selected:", selectedDateRange);
            return true; // Fallback: include if range is unknown
    }
};


/**
 * @typedef {object} EventData
 * @property {string|number} id - Unique identifier for the event.
 * @property {string} [eventName] - Name of the event (PascalCase or camelCase).
 * @property {string} [EventName] - Name of the event (PascalCase or camelCase).
 * @property {string} [location] - Location of the event (e.g., "City, State") (PascalCase or camelCase).
 * @property {string} [Location] - Location of the event (e.g., "City, State") (PascalCase or camelCase).
 * @property {string} [startDate] - Start date of the event (ISO 8601 format preferrably, e.g., "YYYY-MM-DD") (PascalCase or camelCase).
 * @property {string} [StartDate] - Start date of the event (ISO 8601 format preferrably, e.g., "YYYY-MM-DD") (PascalCase or camelCase).
 * @property {string} [timeStart] - Start time of the event (ISO 8601 format preferrably, e.g., "T HH:mm:ss") (PascalCase or camelCase).
 * @property {string} [TimeStart] - Start time of the event (ISO 8601 format preferrably, e.g., "T HH:mm:ss") (PascalCase or camelCase).
 * @property {string} [org] - Organizer of the event (PascalCase or camelCase).
 * @property {string} [Org] - Organizer of the event (PascalCase or camelCase).
 * @property {string} [phone] - Contact phone number (PascalCase or camelCase).
 * @property {string} [Phone] - Contact phone number (PascalCase or camelCase).
 * @property {string} [eventDesc] - Description of the event (PascalCase or camelCase).
 * @property {string} [EventDesc] - Description of the event (PascalCase or camelCase).
 * @property {string} [websiteLink] - Link to the event website (PascalCase or camelCase).
 * @property {string} [WebsiteLink] - Link to the event website (PascalCase or camelCase).
 * @property {string} [zipCode] - Zip code of the event location (PascalCase or camelCase).
 * @property {string} [ZipCode] - Zip code of the event location (PascalCase or camelCase).
 * @property {string} [pic] - Image filename or identifier (PascalCase or camelCase).
 * @property {string} [Pic] - Image filename or identifier (PascalCase or camelCase).
 * @property {string} [image_url] - Full URL of the event image (PascalCase or camelCase).
 * @property {string} [Image_url] - Full URL of the event image (PascalCase or camelCase).
 * @property {string} [eventType] - Type of the event (PascalCase or camelCase).
 * @property {string} [EventType] - Type of the event (PascalCase or camelCase).
 * @property {boolean} [isSaved] - Indicates if the user has saved this event.
 */

/**
 * Renders a grid of event cards based on filtering criteria.
 *
 * @param {object} props - The component props.
 * @param {string | null | undefined} props.eventType - The type of event to filter by (e.g., "Workshop", "Conference"). Case-insensitive.
 * @param {string | null | undefined} props.searchField - Text to filter event names by. Case-insensitive.
 * @param {boolean} props.showSavedOnly - If true, only shows events marked as 'isSaved'.
 * @param {boolean} props.isAdmin - If true, renders admin-specific event cards (`EventCardAdmin`). Otherwise, renders standard `EventCard`.
 * @param {EventData[]} props.events - An array of event objects to display.
 * @param {string | null | undefined} props.selectedLocation - The city name to filter events by. Case-insensitive comparison against the first part of the location string.
 * @param {string | null | undefined} props.selectedDateRange - The date range to filter by ('today', 'tomorrow', 'this-weekend', 'next-week', 'next-month').
 * @param {(eventId: string | number, isSaved: boolean) => void} props.onSaveChange - Callback function triggered when the saved status of an event changes.
 * @returns {JSX.Element} A grid of event cards or a message indicating no events match.
 */
export default function EventListings({
    eventType,
    searchField,
    showSavedOnly,
    isAdmin,
    events = [], // Default to empty array to prevent errors if undefined
    selectedLocation,
    selectedDateRange,
    onSaveChange
}) {

    // Memoize the filtered events calculation for performance.
    // Recalculates only when dependencies change.
    const filteredEvents = useMemo(() => {
        console.log("Recalculating filtered events. Filters:", { eventType, searchField, selectedLocation, selectedDateRange, showSavedOnly });
        const today = getStartOfDay(new Date());

        if (!events || events.length === 0) {
            return []; // Return early if no events are provided
        }

        return events
            // 1. Filter by Event Type (if provided)
            .filter((event) => {
                if (!eventType) return true;
                const eventTypeValue = getEventProperty(event, 'eventType');
                return eventTypeValue.toLowerCase().includes(eventType.toLowerCase());
            })
            // 2. Filter by Search Field (if provided)
            .filter((event) => {
                if (!searchField) return true;
                const eventName = getEventProperty(event, 'eventName');
                return eventName.toLowerCase().includes(searchField.toLowerCase());
            })
            // 3. Filter by Location (City) (if provided)
            .filter((event) => {
                if (!selectedLocation) return true;
                const eventLocation = getEventProperty(event, 'location'); // e.g., "New York, NY"
                // Extract city name (part before the first comma or the whole string if no comma)
                const eventCity = eventLocation?.split(',')[0].trim();
                return eventCity && eventCity.toLowerCase() === selectedLocation.toLowerCase();
            })
            // 4. Filter out Past Events (keep only today and future)
            .filter((event) => {
                const eventDateStr = getEventProperty(event, 'startDate');
                if (!eventDateStr) return false; // Exclude events without a start date
                try {
                    const eventDate = new Date(eventDateStr);
                    if (isNaN(eventDate.getTime())) {
                        console.error("Invalid event date string encountered:", eventDateStr);
                        return false; // Exclude invalid dates
                    }
                    // Compare event date (at midnight) with today (at midnight)
                    return getStartOfDay(eventDate) >= today;
                } catch (e) {
                    console.error("Error parsing event date:", eventDateStr, e);
                    return false; // Exclude on error
                }
            })
            // 5. Filter by Selected Date Range (using helper function)
            .filter((event) => filterEventByDateRange(event, selectedDateRange, today))
            // 6. Filter by Saved Status (if requested)
            .filter((event) => (showSavedOnly ? !!event.isSaved : true)); // Ensure isSaved check is boolean

    }, [events, eventType, searchField, selectedLocation, showSavedOnly, selectedDateRange]); // Dependencies for useMemo


    // Display message if the initial events array is empty
    if (!events || events.length === 0) {
        // Note: This condition might be hit less often if the parent component handles loading/empty states.
        // Kept for robustness if this component might receive an empty array directly.
        return <p className="text-center text-gray-500 mt-4">No events available.</p>;
    }

    // Display message if filtering results in no matching events
    if (filteredEvents.length === 0) {
        return <p className="text-center text-gray-500 mt-4">No events match your current filters.</p>;
    }

    // Render the grid of event cards
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {filteredEvents.map((event) => {
                // Determine which card component to use based on isAdmin prop
                const CardComponent = isAdmin ? EventCardAdmin : EventCard;
                const eventId = event.id || `event-${Math.random()}`; // Fallback key if id is missing

                 // Defensive check for required properties before rendering a card
                 const eventName = getEventProperty(event, 'eventName');
                 if (!eventName) {
                    console.warn(`Event with ID ${eventId} is missing essential data (eventName) and will be skipped.`);
                    return null; // Skip rendering this card if essential data is missing
                 }


                return (
                    <CardComponent
                        key={eventId} // Use event.id as the key for React reconciliation
                        id={eventId}
                        EventName={eventName}
                        Location={getEventProperty(event, 'location')}
                        Date={getEventProperty(event, 'startDate')} // Pass raw date string, formatting handled in card? (or format here if needed)
                        Time={formatTime(getEventProperty(event, 'timeStart'))} // Format time before passing
                        EventOrganizer={getEventProperty(event, 'org')}
                        PhoneNumber={getEventProperty(event, 'phone')}
                        EventDescription={getEventProperty(event, 'eventDesc')}
                        WebsiteLink={getEventProperty(event, 'websiteLink') || "#"} // Default website link
                        ZipCode={getEventProperty(event, 'zipCode')}
                        EventImage={getEventProperty(event, 'pic')} // Assuming this is an image identifier or filename
                        image_url={getEventProperty(event, 'image_url')} // Pass the full image URL if available
                        saved={!!event.isSaved} // Ensure boolean value
                        onSaveChange={onSaveChange} // Pass the callback down
                    />
                );
            })}
        </div>
    );
}
