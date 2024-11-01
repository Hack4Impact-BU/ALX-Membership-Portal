'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Inter, Proza_Libre } from 'next/font/google';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import Link from 'next/link';


// Fonts
const inter = Inter({ subsets: ['latin'] });
const prozaLibre = Proza_Libre({ subsets: ['latin'], weight: ['400', '600', '700'] });

export default function GetInvolved() {
  const [expandedCard, setExpandedCard] = useState(null); // Track which card is expanded
  const contentRefs = useRef([]); // References for card heights
  const [data, setData] = useState([]); // Store fetched data

  // Fetch data from API
  useEffect(() => {
    fetch('http://localhost:3001/get_involveds')
      .then((response) => response.json())
      .then((data) => {
        setData(data); // Store the fetched data in the state
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Function to handle card expansion/collapse
  const toggleExpandCard = (index) => {
    if (expandedCard === index) {
      // Collapse immediately, no transition
      contentRefs.current[index].style.transition = 'none';
      contentRefs.current[index].style.maxHeight = '150px';
      setExpandedCard(null); // Collapse the card
    } else {
      // Expand smoothly
      contentRefs.current[index].style.transition = 'max-height 0.3s ease'; // Add transition for smooth expansion
      contentRefs.current[index].style.maxHeight = `${contentRefs.current[index].scrollHeight}px`;
      setExpandedCard(index); // Expand the card
    }
  };

  // Set the initial heights of the cards
  useEffect(() => {
    contentRefs.current.forEach((ref, index) => {
      if (ref) {
        // Set initial height for collapsed cards
        ref.style.maxHeight = expandedCard === index ? `${ref.scrollHeight}px` : '150px';
      }
    });
  }, [expandedCard]);

  // // Render content after data is fetched
  // if (data.length === 0) {
  //   return <div>Loading...</div>; // Display a loading state until the data is fetched
  // }

  return (
    <div className="flex flex-col items-center bg-[#214933] min-h-screen w-10/12 p-8 text-white">
      {/* Header */}
      <div className="mb-8 w-full">
        <h1 className="text-[70px] font-bold mb-2 font-custom">Get Involved</h1>
        <h2 className="text-[30px] italic font-custom">* Involucrate</h2>
      </div>

      {/* Card Section */}
      <div className={`flex flex-col w-full justify-center gap-4 mb-8 ${prozaLibre.className}`}>
        {data.map((item, index) => (
          <div
            key={item.id}
            className={`bg-[#335843] text-white p-8 rounded-xl shadow-lg flex flex-col flex-grow relative`}
            ref={(el) => (contentRefs.current[index] = el)} // Set the reference for each card
            style={{
              overflow: 'hidden',
              minHeight: '200px', // Ensure a minimum height of the collapsed card
              maxHeight: '150px', // Default collapsed height
            }}
          >
            <h3 className="text-[28px] font-semibold mb-6">{item.title}</h3>
            
            {/* Display summary if collapsed, or full description if expanded */}
            <p className="mb-10">
              {expandedCard === index ? item.description : item.summary}
            </p>

            {/* Conditionally render the rest of the card if expanded */}
            {expandedCard === index && (
              <div className="flex flex-col justify-end flex-grow mt-4">
                <div className="grid grid-cols-2 gap-8">
                  {/* First Row: Date & Time */}
                  <div className="flex items-center gap-4">
                    <CalendarTodayIcon style={{ fontSize: 32 }} />
                    <p className="text-lg">{item.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <AccessTimeIcon style={{ fontSize: 32 }} />
                    <p className="text-lg">{item.time}</p>
                  </div>
                  {/* Second Row: Location & Phone */}
                  <div className="flex items-center gap-4">
                    <LocationOnIcon style={{ fontSize: 32 }} />
                    <p className="text-lg">{item.location}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <PhoneIcon style={{ fontSize: 32 }} />
                    <p className="text-lg">{item.phone}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Button at the bottom-right corner */}
            <button
              onClick={() => toggleExpandCard(index)}
              className="absolute bottom-4 right-4 text-[#A9A9A9] bg-transparent hover:underline text-sm"
            >
              {expandedCard === index ? 'See Less <<' : 'See More >>'}
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Link href="get_involved/create" passHref>
          <p className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700">
            Create New Involvement
          </p>
        </Link>
      </div>
    </div>
  );
}