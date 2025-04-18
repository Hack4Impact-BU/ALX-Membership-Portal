'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Inter, Proza_Libre } from 'next/font/google';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import axios from 'axios';
import LoadingScreen from '@/components/LoadingScreen';
import Hyperlinks from '@/components/Hyperlinks';
import InvolvementCreationForm from './create/page';

const inter = Inter({ subsets: ['latin'] });
const prozaLibre = Proza_Libre({ subsets: ['latin'], weight: ['400', '600', '700'] });

export default function GetInvolved() {
  const [expandedCard, setExpandedCard] = useState(null); 
  const contentRefs = useRef([]); 
  const [data, setData] = useState([]); 
  const [isDeleteMode, setIsDeleteMode] = useState(false); // Toggle delete mode
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Show confirmation modal
  const [deleteId, setDeleteId] = useState(null); // ID of involvement to delete
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [showCreateForm, setShowCreateForm] = useState(false); // Show create form
  
  // Editing states
  const [editingItem, setEditingItem] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  // Define the API base URL from environment variables
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch data from the API with a minimum delay of 300 ms
  const fetchData = async () => {
    setIsLoading(true);
    const startTime = Date.now();
    try {
      const response = await axios.get(`${apiBaseUrl}/get_involveds`);
      const result = response.data;
      const elapsed = Date.now() - startTime;
      const minDelay = 300; // 300 ms minimum delay
      const remainingDelay = minDelay - elapsed;
      if (remainingDelay > 0) {
        setTimeout(() => {
          setData(result);
          setIsLoading(false);
        }, remainingDelay);
      } else {
        setData(result);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
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

  // Toggle create form
  const handleCreateInvolvement = () => {
    setShowCreateForm(true);
    // Reset expanded card when showing form
    setExpandedCard(null);
  };

  // Cancel create form
  const handleCancelCreate = () => {
    setShowCreateForm(false);
  };

  // Handle new involvement created
  const handleInvolvementCreated = (newInvolvement) => {
    setData([newInvolvement, ...data]);
    setShowCreateForm(false);
    // Optionally expand the new card
    setTimeout(() => {
      setExpandedCard(0);
      if (contentRefs.current[0]) {
        contentRefs.current[0].style.transition = 'max-height 0.3s ease';
        contentRefs.current[0].style.maxHeight = `${contentRefs.current[0].scrollHeight}px`;
      }
    }, 100);
  };
  
  // Handle editing functions
  const handleEdit = (id, field, currentValue) => {
    setEditingItem(id);
    setEditingField(field);
    setEditingValue(currentValue);
  };
  
  const handleCancelEdit = (e) => {
    if (e) e.stopPropagation();
    setEditingItem(null);
    setEditingField(null);
  };
  
  const handleSaveEdit = async (e) => {
    if (e) e.stopPropagation();
    try {
      await axios.put(`${apiBaseUrl}/get_involveds/${editingItem}`, {
        get_involved: { [editingField]: editingValue }
      });
      
      // Update local state
      setData(data.map(item => 
        item.id === editingItem 
          ? {...item, [editingField]: editingValue} 
          : item
      ));
      
      handleCancelEdit();
    } catch (error) {
      console.error('Error updating involvement:', error);
    }
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
  }, [expandedCard, data]);

  return (
    <div className="flex flex-col items-center bg-[#214933] min-h-screen w-10/12 p-8 mt-12 text-white">
      <div className="mb-8 w-full">
        <h1 className="text-[70px] font-bold mb-2 font-custom">Get Involved</h1>
        <h2 className="text-[30px] italic font-custom">* Involucrate</h2>
      </div>

      {/* Card Section */}
      <div className={`flex flex-col w-full justify-center gap-4 mb-8 ${prozaLibre.className}`}>
        {isLoading ? (
          <LoadingScreen />
        ) : (
          data.map((item, index) => (
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
              {/* Title with Edit Button */}
              <div className="flex items-start mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              </div>
              
              {/* Description with Edit Button */}
              <div className="flex items-start mb-10">
                <p className="text-white mb-4">{item.description}</p>
              </div>

              {expandedCard === index && (
                <div className="flex flex-col justify-end flex-grow mt-4">
                  <div className="grid grid-cols-2 gap-8">
                    {/* Date with Icon (Editing removed) */}
                    <div className="flex items-center gap-4">
                      <CalendarTodayIcon style={{ fontSize: 32 }} />
                      <div className="flex items-center">
                        <span>{item.date}</span>
                      </div>
                    </div>

                    {/* Time with Edit Button */}
                    <div className="flex items-center gap-4">
                      <AccessTimeIcon style={{ fontSize: 32 }} />
                      <div className="flex items-center">
                        <span>{item.time}</span>
                      </div>
                    </div>

                    {/* Location with Edit Button */}
                    <div className="flex items-center gap-4">
                      <LocationOnIcon style={{ fontSize: 32 }} />
                      <div className="flex items-center">
                        <span>{item.location}</span>
                      </div>
                    </div>

                    {/* Phone with Edit Button */}
                    <div className="flex items-center gap-4">
                      <PhoneIcon style={{ fontSize: 32 }} />
                      <div className="flex items-center">
                        <p className="text-lg">{item.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Expand/Collapse Button */}
              <button
                onClick={() => toggleExpandCard(index)}
                className="absolute bottom-4 right-4 text-[#A9A9A9] bg-transparent hover:underline text-sm"
              >
                {expandedCard === index ? 'See Less <<' : 'See More >>'}
              </button>
            </div>
          ))
        )}
      </div>
      <Hyperlinks />
    </div>
  );
}