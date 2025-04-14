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
                {editingItem === item.id && editingField === 'title' ? (
                  <div className="flex flex-col w-full" onClick={e => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className="bg-[#214933] text-white p-2 rounded text-[28px] font-semibold w-full mb-2"
                    />
                    <div className="flex gap-2 justify-end">
                      <button onClick={handleSaveEdit} className="bg-green-500 text-white p-1 rounded-full">
                        <CheckIcon style={{ fontSize: 20 }} />
                      </button>
                      <button onClick={handleCancelEdit} className="bg-gray-500 text-white p-1 rounded-full">
                        <CloseIcon style={{ fontSize: 20 }} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-[28px] font-semibold flex-grow">{item.title}</h3>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(item.id, 'title', item.title);
                      }}
                      className="p-1 rounded-full bg-green-400 hover:bg-green-500 text-white ml-2"
                    >
                      <EditIcon fontSize="small" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Description with Edit Button */}
              {editingItem === item.id && editingField === 'description' ? (
                <div className="mb-10" onClick={e => e.stopPropagation()}>
                  <textarea
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    className="bg-[#214933] text-white p-2 rounded w-full mb-2"
                    rows={4}
                  />
                  <div className="flex gap-2 justify-end">
                    <button onClick={handleSaveEdit} className="bg-green-500 text-white p-1 rounded-full">
                      <CheckIcon style={{ fontSize: 20 }} />
                    </button>
                    <button onClick={handleCancelEdit} className="bg-gray-500 text-white p-1 rounded-full">
                      <CloseIcon style={{ fontSize: 20 }} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start mb-10">
                  <p className="flex-grow">
                    {expandedCard === index ? item.description : item.summary}
                  </p>
                  {expandedCard === index && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(item.id, 'description', item.description);
                      }}
                      className="p-1 rounded-full bg-green-400 hover:bg-green-500 text-white ml-2"
                    >
                      <EditIcon fontSize="small" />
                    </button>
                  )}
                </div>
              )}

              {expandedCard === index && (
                <div className="flex flex-col justify-end flex-grow mt-4">
                  <div className="grid grid-cols-2 gap-8">
                    {/* Date with Edit Button */}
                    <div className="flex items-center gap-4">
                      <CalendarTodayIcon style={{ fontSize: 32 }} />
                      {editingItem === item.id && editingField === 'date' ? (
                        <div className="flex items-center gap-2 flex-grow" onClick={e => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="bg-[#214933] text-white p-1 rounded flex-grow"
                          />
                          <button onClick={handleSaveEdit} className="bg-green-500 text-white p-1 rounded-full">
                            <CheckIcon style={{ fontSize: 16 }} />
                          </button>
                          <button onClick={handleCancelEdit} className="bg-gray-500 text-white p-1 rounded-full">
                            <CloseIcon style={{ fontSize: 16 }} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-grow">
                          <p className="text-lg">{item.date}</p>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(item.id, 'date', item.date);
                            }}
                            className="p-1 rounded-full bg-green-400 hover:bg-green-500 text-white"
                          >
                            <EditIcon style={{ fontSize: 16 }} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Time with Edit Button */}
                    <div className="flex items-center gap-4">
                      <AccessTimeIcon style={{ fontSize: 32 }} />
                      {editingItem === item.id && editingField === 'time' ? (
                        <div className="flex items-center gap-2 flex-grow" onClick={e => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="bg-[#214933] text-white p-1 rounded flex-grow"
                          />
                          <button onClick={handleSaveEdit} className="bg-green-500 text-white p-1 rounded-full">
                            <CheckIcon style={{ fontSize: 16 }} />
                          </button>
                          <button onClick={handleCancelEdit} className="bg-gray-500 text-white p-1 rounded-full">
                            <CloseIcon style={{ fontSize: 16 }} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-grow">
                          <p className="text-lg">{item.time}</p>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(item.id, 'time', item.time);
                            }}
                            className="p-1 rounded-full bg-green-400 hover:bg-green-500 text-white"
                          >
                            <EditIcon style={{ fontSize: 16 }} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Location with Edit Button */}
                    <div className="flex items-center gap-4">
                      <LocationOnIcon style={{ fontSize: 32 }} />
                      {editingItem === item.id && editingField === 'location' ? (
                        <div className="flex items-center gap-2 flex-grow" onClick={e => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="bg-[#214933] text-white p-1 rounded flex-grow"
                          />
                          <button onClick={handleSaveEdit} className="bg-green-500 text-white p-1 rounded-full">
                            <CheckIcon style={{ fontSize: 16 }} />
                          </button>
                          <button onClick={handleCancelEdit} className="bg-gray-500 text-white p-1 rounded-full">
                            <CloseIcon style={{ fontSize: 16 }} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-grow">
                          <p className="text-lg">{item.location}</p>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(item.id, 'location', item.location);
                            }}
                            className="p-1 rounded-full bg-green-400 hover:bg-green-500 text-white"
                          >
                            <EditIcon style={{ fontSize: 16 }} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Phone with Edit Button */}
                    <div className="flex items-center gap-4">
                      <PhoneIcon style={{ fontSize: 32 }} />
                      {editingItem === item.id && editingField === 'phone' ? (
                        <div className="flex items-center gap-2 flex-grow" onClick={e => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="bg-[#214933] text-white p-1 rounded flex-grow"
                          />
                          <button onClick={handleSaveEdit} className="bg-green-500 text-white p-1 rounded-full">
                            <CheckIcon style={{ fontSize: 16 }} />
                          </button>
                          <button onClick={handleCancelEdit} className="bg-gray-500 text-white p-1 rounded-full">
                            <CloseIcon style={{ fontSize: 16 }} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-grow">
                          <p className="text-lg">{item.phone}</p>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(item.id, 'phone', item.phone);
                            }}
                            className="p-1 rounded-full bg-green-400 hover:bg-green-500 text-white"
                          >
                            <EditIcon style={{ fontSize: 16 }} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Delete Icon */}
              {isDeleteMode && (
                <button
                  className="absolute top-4 right-4 bg-white rounded-full p-1 text-red-600"
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
          ))
        )}
        
        {/* Create Form Section - Moved to bottom of card list */}
        {showCreateForm && (
          <div className="w-full mb-4">
            <InvolvementCreationForm 
              onCancel={handleCancelCreate}
              onInvolvementCreated={handleInvolvementCreated}
              apiBaseUrl={apiBaseUrl}
            />
          </div>
        )}
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
        <button
          onClick={handleCreateInvolvement}
          className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700"
        >
          Create New Involvement
        </button>
        <button
          onClick={handleDeleteMode}
          className="bg-red-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-red-700"
        >
          {isDeleteMode ? 'Cancel Delete Mode' : 'Delete Involvements'}
        </button>
      </div>
      <Hyperlinks />
    </div>
  );
}