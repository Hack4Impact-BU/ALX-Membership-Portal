import { useState, useEffect } from "react";
import EventCard from "../EventCards/EventCards";
import EventCardAdmin from "../EventCardsAdmin/EventCardsAdmin";

export default function Eventing({ eventType, searchField, showSavedOnly }) {
  // Example data for your cards, updated to reflect the Event Table
  // const [events, setEvents] = useState([
  //   {
  //     EventID: 1,
  //     EventName: "Community Fair",
  //     Location: "Brookline, MA",
  //     Date: "2024-09-18",
  //     Time: "17:00:00",
  //     EventOrganizer: "ALX",
  //     PhoneNumber: "(123) 456-7890",
  //     EventDescription:
  //       "The City of Worcester warmly invites you to the annual Community Fair! This vibrant event is a celebration of our diverse community, bringing together residents, local businesses, and organizations for a day of fun, connection, and engagement.",
  //     WebsiteLink: "www.worcesterma.gov/communityfair",
  //     ZipCode: "02445",
  //     EventImage: "pic1.jpg",
  //     EventType: "Community Event",
  //     saved: false,
  //   },
  //   {
  //     EventID: 2,
  //     EventName: "Workshop on AI",
  //     Location: "Cambridge, MA",
  //     Date: "2024-10-20",
  //     Time: "09:00:00",
  //     EventOrganizer: "Tech Society",
  //     PhoneNumber: "(321) 654-0987",
  //     EventDescription:
  //       "Join us for an interactive workshop on AI and learn the latest advancements in artificial intelligence technology.",
  //     WebsiteLink: "www.techsociety.com/aiworkshop",
  //     ZipCode: "02139",
  //     EventImage: "pic2.jpg",
  //     EventType: "Workshop/Seminar",
  //     saved: false,
  //   },
  //   {
  //     EventID: 3,
  //     EventName: "Tech Expo 2024",
  //     Location: "Boston Convention Center, MA",
  //     Date: "2024-11-15",
  //     Time: "10:00:00",
  //     EventOrganizer: "Innovate Boston",
  //     PhoneNumber: "(987) 654-3210",
  //     EventDescription:
  //       "Explore the future of technology at the Tech Expo 2024! Join industry leaders and innovators for a day filled with cutting-edge demos, keynote speeches, and networking opportunities.",
  //     WebsiteLink: "www.tech-expo.com",
  //     ZipCode: "02210",
  //     EventImage: "pic3.jpg",
  //     EventType: "Expo/Conference",
  //     saved: true,
  //   },
  //   {
  //     EventID: 4,
  //     EventName: "Annual Health & Wellness Fair",
  //     Location: "Harvard Square, Cambridge, MA",
  //     Date: "2024-12-05",
  //     Time: "11:30:00",
  //     EventOrganizer: "Wellness Initiative",
  //     PhoneNumber: "(555) 123-4567",
  //     EventDescription:
  //       "Join us at the Annual Health & Wellness Fair to learn about living a healthier lifestyle. Enjoy free health screenings, wellness workshops, and healthy food samples.",
  //     WebsiteLink: "www.wellnessfair.com",
  //     ZipCode: "02138",
  //     EventImage: "pic4.jpg",
  //     EventType: "Health & Wellness",
  //     saved: true,
  //   },
  //   {
  //     EventID: 5,
  //     EventName: "Coding Bootcamp for Beginners",
  //     Location: "MIT Media Lab, Cambridge, MA",
  //     Date: "2024-11-22",
  //     Time: "13:00:00",
  //     EventOrganizer: "CodeMasters",
  //     PhoneNumber: "(800) 789-1234",
  //     EventDescription:
  //       "Kickstart your programming journey with our beginner-friendly coding bootcamp. Learn the basics of web development, programming languages, and get hands-on experience!",
  //     WebsiteLink: "www.codemasters.com/bootcamp",
  //     ZipCode: "02139",
  //     EventImage: "pic5.jpg",
  //     EventType: "Workshop/Seminar",
  //     saved: false,
  //   },
  //   {
  //     EventID: 6,
  //     EventName: "Startup Pitch Night",
  //     Location: "WeWork Seaport, Boston, MA",
  //     Date: "2024-12-10",
  //     Time: "18:00:00",
  //     EventOrganizer: "Boston Entrepreneurs",
  //     PhoneNumber: "(234) 567-8901",
  //     EventDescription:
  //       "Watch aspiring entrepreneurs pitch their innovative ideas to a panel of investors. Network with startups, investors, and tech enthusiasts at this exciting evening event.",
  //     WebsiteLink: "www.bostonentrepreneurs.com/pitchnight",
  //     ZipCode: "02210",
  //     EventImage: "pic6.jpg",
  //     EventType: "Networking Event",
  //     saved: false,
  //   },
  //   {
  //     EventID: 7,
  //     EventName: "Sustainability Summit 2024",
  //     Location: "Hynes Convention Center, Boston, MA",
  //     Date: "2024-12-15",
  //     Time: "08:30:00",
  //     EventOrganizer: "Green Future",
  //     PhoneNumber: "(567) 890-1234",
  //     EventDescription:
  //       "Join the Sustainability Summit to discuss and learn about the latest initiatives in environmental protection, renewable energy, and sustainable practices.",
  //     WebsiteLink: "www.greenfuture.org/summit",
  //     ZipCode: "02116",
  //     EventImage: "pic7.jpg",
  //     EventType: "Expo/Conference",
  //     saved: true,
  //   },
  // ]);
  const [events, setEvents] = useState([]); // Start with an empty list
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors during fetch

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3001/eventlists"); // Adjust endpoint URL as needed
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
