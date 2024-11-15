'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Inter, Proza_Libre } from 'next/font/google';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import Link from 'next/link';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';

const inter = Inter({ subsets: ['latin'] });
const prozaLibre = Proza_Libre({ subsets: ['latin'], weight: ['400', '600', '700'] });

export default function GetInvolved() {
  const [expandedCard, setExpandedCard] = useState(null); 
  const contentRefs = useRef([]); 
  const [data, setData] = useState([]); 
  const [isDeleteMode, setIsDeleteMode] = useState(false); // Toggle delete mode
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Show confirmation modal
  const [deleteId, setDeleteId] = useState(null); // ID of involvement to delete

  // Define the API base URL from environment variables
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/get_involveds`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Delete involvement by ID
  const deleteInvolvement = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/get_involveds/${id}`);
      setData(data.filter(item => item.id !== id)); // Remove deleted item from state
    } catch (error) {
      console.error('Error deleting involvement:', error);
    }
  };

  // Toggle delete mode
  const handleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
  };

  // Show confirmation modal
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirmModal(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    deleteInvolvement(deleteId);
    setShowConfirmModal(false);
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowConfirmModal(false);
    setDeleteId(null);
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const toggleExpandCard = (index) => {
    if (expandedCard === index) {
      contentRefs.current[index].style.transition = 'none';
      contentRefs.current[index].style.maxHeight = '150px';
      setExpandedCard(null); 
    } else {
      contentRefs.current[index].style.transition = 'max-height 0.3s ease';
      contentRefs.current[index].style.maxHeight = `${contentRefs.current[index].scrollHeight}px`;
      setExpandedCard(index);
    }
  };

  // Set the initial heights of the cards
  useEffect(() => {
    contentRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.style.maxHeight = expandedCard === index ? `${ref.scrollHeight}px` : '150px';
      }
    });
  }, [expandedCard]);

  return (
    <div className="flex flex-col items-center bg-[#214933] min-h-screen w-10/12 p-8 text-white">
      <div className="mb-8 w-full">
        <h1 className="text-[70px] font-bold mb-2 font-custom">Get Involved</h1>
        <h2 className="text-[30px] italic font-custom">* Involucrate</h2>
      </div>

      {/* Card Section */}
      <div className={`flex flex-col w-full justify-center gap-4 mb-8 ${prozaLibre.className}`}>
        {data.map((item, index) => (
          <div
            key={item.id}
            className="bg-[#335843] text-white p-8 rounded-xl shadow-lg flex flex-col flex-grow relative"
            ref={(el) => (contentRefs.current[index] = el)}
            style={{
              overflow: 'hidden',
              minHeight: '200px',
              maxHeight: '150px',
            }}
          >
            <h3 className="text-[28px] font-semibold mb-6">{item.title}</h3>
            
            {/* Display summary if collapsed, or full description if expanded */}
            <p className="mb-10">
              {expandedCard === index ? item.description : item.summary}
            </p>

            {expandedCard === index && (
              <div className="flex flex-col justify-end flex-grow mt-4">
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex items-center gap-4">
                    <CalendarTodayIcon style={{ fontSize: 32 }} />
                    <p className="text-lg">{item.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <AccessTimeIcon style={{ fontSize: 32 }} />
                    <p className="text-lg">{item.time}</p>
                  </div>
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

            {/* Delete Icon */}
            {isDeleteMode && (
              <button
                className="absolute top-4 right-4 bg-white rounded-full p-1 text-red-600" // White circle around the delete icon
                onClick={() => handleDeleteClick(item.id)}
              >
                <CloseIcon />
              </button>
            )}

            {/* Expand/Collapse Button */}
            <button
              onClick={() => toggleExpandCard(index)}
              className="absolute bottom-4 right-4 text-[#A9A9A9] bg-transparent hover:underline text-sm"
            >
              {expandedCard === index ? 'See Less <<' : 'See More >>'}
            </button>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center text-black">
            <p className="mb-4">Are you sure you want to delete this involvement?</p>
            <div className="flex justify-center gap-4">
              <button onClick={confirmDelete} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700">
                Yes, Delete
              </button>
              <button onClick={cancelDelete} className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Buttons */}
      <div className="flex justify-center mt-8 gap-4">
        <Link href="get_involved/create" passHref>
          <p className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700">
            Create New Involvement
          </p>
        </Link>
        <button
          onClick={handleDeleteMode}
          className="bg-red-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-red-700"
        >
          {isDeleteMode ? 'Cancel Delete Mode' : 'Delete Involvements'}
        </button>
      </div>
    </div>
  );
}