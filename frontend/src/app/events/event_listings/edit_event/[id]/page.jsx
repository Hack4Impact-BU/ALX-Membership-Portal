"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { FolderIcon } from '@heroicons/react/outline';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ReusableHeader from '@/components/ReusableHeader/ReusableHeader';
import { styled } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkIcon from '@mui/icons-material/Link';

const EditPage = () => {
  const { id } = useParams();
  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isEditing, setIsEditing] = useState({
    eventName: false,
    eventDesc: false,
    eventType: false,
    startDate: false,
    endDate: false,
    timeStart: false,
    timeEnd: false,
    location: false,
    org: false,
    instruct: false,
    phone: false,
    pic: false,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const CustomButton = styled(Button)({
    backgroundColor: '#44E489',
    borderRadius: '20px',
    padding: '8px 24px',
    width: '60px',
    height: '40px',
    '&:hover': {
      backgroundColor: '#3acc7a', // slightly darker shade for hover
    },
  });

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleEdit = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: true }));
  };

  // Add function to ensure proper URL formatting
  const formatUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  const handleSaveClick = async (field) => {
    try {
      // Format the URL before saving if it's the pic field
      const valueToSave = field === 'pic' ? formatUrl(itemData[field]) : itemData[field];
      
      const response = await fetch(`${apiBaseUrl}/eventlists/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: valueToSave }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update item: ${response.statusText}`);
      }
  
      const updatedData = await response.json();
      setItemData(updatedData);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 1500);
    } catch (err) {
      setError(err.message);
      console.error('Error updating item:', err);
    } finally {
      setIsEditing((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/eventlists/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete item: ${response.statusText}`);
      }

      // Redirect to archive page after successful deletion
      window.location.href = '/archive';
    } catch (err) {
      setError(err.message);
      console.error('Error deleting item:', err);
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/eventlists/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch item: ${response.statusText}`);
        }

        const data = await response.json();
        setItemData(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching item:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [apiBaseUrl, id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center bg-[#214933] min-h-screen w-10/12 p-8 mt-6 text-white">
      {showSuccessModal && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-4 rounded-full shadow-lg">
          Edit successful!
        </div>
      )}
      <div className="flex w-full ml-[-10rem]">
        <ReusableHeader header={"Edit Event"}/>
      </div>
      <div className="bg-[#335843] rounded-xl w-full shadow-lg p-8 text-white">
        <div className="flex justify-between items-center mb-6">
            {isEditing.eventName ? (
              <input
                type="text"
                value={itemData?.eventName || ''}
                onChange={(e) => setItemData({ ...itemData, eventName: e.target.value })}
                className="pl-4 text-[34px] rounded-xl font-semibold bg-inherit w-1/2 border border-gray-300 focus:border-blue-500 hover:bg-[#284c34]"
              />
            ) : (
              <h1 className="text-[34px] font-semibold">
                {itemData?.eventName || 'Edit Event'}
              </h1>
            )}
          <div className="flex gap-4">
            <CustomButton 
              variant="contained"
              onClick={() => handleEdit('eventName')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
            </CustomButton>
            {isEditing.eventName && 
            <CustomButton 
              variant="contained"
              onClick={() => handleSaveClick('eventName')}
            >
              <p className="text-black">Save</p>
            </CustomButton>}
          </div>
        </div>

        <div className="mb-8 w-full flex justify-between items-center text-[20px]">
          {isEditing.eventDesc ? (
            <textarea
              value={itemData?.eventDesc || ''}
              onChange={(e) => setItemData({ ...itemData, eventDesc: e.target.value })}
              className="pl-4 text-[20px] h-40 rounded-xl bg-inherit w-3/5 border border-gray-300 focus:border-blue-500 hover:bg-[#284c34]"
            />
          ) : (
            <p className="w-3/5">{itemData?.eventDesc}</p>
          )}
          <div className="flex gap-4">
            <CustomButton 
              variant="contained"
              onClick={() => handleEdit('eventDesc')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
            </CustomButton>
            {isEditing.eventDesc && 
            <CustomButton 
              variant="contained"
              onClick={() => handleSaveClick('eventDesc')}
            >
              <p className="text-black">Save</p>
            </CustomButton>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Event Type */}
          <div className="flex items-center justify-between">
            <div className='flex items-center gap-4'>
              <FolderIcon className="h-6 w-6 stroke-[#F6F2E9]" />
              <span className="font-semibold">Event Type:</span>
              {isEditing.eventType ? (
                <input
                  type="text"
                  value={itemData?.eventType || ''}
                  onChange={(e) => setItemData({ ...itemData, eventType: e.target.value })}
                  className="pl-4 text-lg rounded-xl bg-inherit border border-gray-300 focus:border-blue-500 hover:bg-[#284c34]"
                />
              ) : (
                <p className="text-lg">{itemData?.eventType}</p>
              )}
            </div>
            <div className="flex gap-4">
              <CustomButton 
                variant="contained"
                onClick={() => handleEdit('eventType')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </CustomButton>
              {isEditing.eventType && 
              <CustomButton 
                variant="contained"
                onClick={() => handleSaveClick('eventType')}
              >
                <p className="text-black">Save</p>
              </CustomButton>}
            </div>
          </div>

          {/* Start Date */}
          <div className="flex items-center justify-between">
            <div className='flex items-center gap-4'>
              <CalendarTodayIcon style={{ fontSize: 24 }} />
              <span className="font-semibold">Start Date:</span>
              {isEditing.startDate ? (
                <input
                  type="date"
                  value={itemData?.startDate || ''}
                  onChange={(e) => setItemData({ ...itemData, startDate: e.target.value })}
                  className="pl-4 text-lg rounded-xl bg-inherit border border-gray-300 focus:border-blue-500 hover:bg-[#284c34]"
                />
              ) : (
                <p className="text-lg">{itemData?.startDate}</p>
              )}
            </div>
            <div className="flex gap-4">
              <CustomButton 
                variant="contained"
                onClick={() => handleEdit('startDate')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </CustomButton>
              {isEditing.startDate && 
              <CustomButton 
                variant="contained"
                onClick={() => handleSaveClick('startDate')}
              >
                <p className="text-black">Save</p>
              </CustomButton>}
            </div>
          </div>

          {/* End Date */}
          <div className="flex items-center justify-between">
            <div className='flex items-center gap-4'>
              <CalendarTodayIcon style={{ fontSize: 24 }} />
              <span className="font-semibold">End Date:</span>
              {isEditing.endDate ? (
                <input
                  type="date"
                  value={itemData?.endDate || ''}
                  onChange={(e) => setItemData({ ...itemData, endDate: e.target.value })}
                  className="pl-4 text-lg rounded-xl bg-inherit border border-gray-300 focus:border-blue-500 hover:bg-[#284c34]"
                />
              ) : (
                <p className="text-lg">{itemData?.endDate}</p>
              )}
            </div>
            <div className="flex gap-4">
              <CustomButton 
                variant="contained"
                onClick={() => handleEdit('endDate')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </CustomButton>
              {isEditing.endDate && 
              <CustomButton 
                variant="contained"
                onClick={() => handleSaveClick('endDate')}
              >
                <p className="text-black">Save</p>
              </CustomButton>}
            </div>
          </div>

          {/* Start Time */}
          <div className="flex items-center justify-between">
            <div className='flex items-center gap-4'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span className="font-semibold">Start Time:</span>
              {isEditing.timeStart ? (
                <input
                  type="time"
                  value={itemData?.timeStart || ''}
                  onChange={(e) => setItemData({ ...itemData, timeStart: e.target.value })}
                  className="pl-4 text-lg rounded-xl bg-inherit border border-gray-300 focus:border-blue-500 hover:bg-[#284c34]"
                />
              ) : (
                <p className="text-lg">{itemData?.timeStart}</p>
              )}
            </div>
            <div className="flex gap-4">
              <CustomButton 
                variant="contained"
                onClick={() => handleEdit('timeStart')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </CustomButton>
              {isEditing.timeStart && 
              <CustomButton 
                variant="contained"
                onClick={() => handleSaveClick('timeStart')}
              >
                <p className="text-black">Save</p>
              </CustomButton>}
            </div>
          </div>

          {/* End Time */}
          <div className="flex items-center justify-between">
            <div className='flex items-center gap-4'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span className="font-semibold">End Time:</span>
              {isEditing.timeEnd ? (
                <input
                  type="time"
                  value={itemData?.timeEnd || ''}
                  onChange={(e) => setItemData({ ...itemData, timeEnd: e.target.value })}
                  className="pl-4 text-lg rounded-xl bg-inherit border border-gray-300 focus:border-blue-500 hover:bg-[#284c34]"
                />
              ) : (
                <p className="text-lg">{itemData?.timeEnd}</p>
              )}
            </div>
            <div className="flex gap-4">
              <CustomButton 
                variant="contained"
                onClick={() => handleEdit('timeEnd')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </CustomButton>
              {isEditing.timeEnd && 
              <CustomButton 
                variant="contained"
                onClick={() => handleSaveClick('timeEnd')}
              >
                <p className="text-black">Save</p>
              </CustomButton>}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center justify-between">
            <div className='flex items-center gap-4'>
              <LocationOnIcon style={{ fontSize: 24 }} />
              <span className="font-semibold">Location:</span>
              {isEditing.location ? (
                <input
                  type="text"
                  value={itemData?.location || ''}
                  onChange={(e) => setItemData({ ...itemData, location: e.target.value })}
                  className="pl-4 text-lg rounded-xl bg-inherit border border-gray-300 focus:border-blue-500 hover:bg-[#284c34]"
                />
              ) : (
                <p className="text-lg">{itemData?.location}</p>
              )}
            </div>
            <div className="flex gap-4">
              <CustomButton 
                variant="contained"
                onClick={() => handleEdit('location')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </CustomButton>
              {isEditing.location && 
              <CustomButton 
                variant="contained"
                onClick={() => handleSaveClick('location')}
              >
                <p className="text-black">Save</p>
              </CustomButton>}
            </div>
          </div>

          {/* Organization */}
          <div className="flex items-center justify-between">
            <div className='flex items-center gap-4'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
              <span className="font-semibold">Organization:</span>
              {isEditing.org ? (
                <input
                  type="text"
                  value={itemData?.org || ''}
                  onChange={(e) => setItemData({ ...itemData, org: e.target.value })}
                  className="pl-4 text-lg rounded-xl bg-inherit border border-gray-300 focus:border-blue-500 hover:bg-[#284c34]"
                />
              ) : (
                <p className="text-lg">{itemData?.org}</p>
              )}
            </div>
            <div className="flex gap-4">
              <CustomButton 
                variant="contained"
                onClick={() => handleEdit('org')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </CustomButton>
              {isEditing.org && 
              <CustomButton 
                variant="contained"
                onClick={() => handleSaveClick('org')}
              >
                <p className="text-black">Save</p>
              </CustomButton>}
            </div>
          </div>

          {/* Instructions */}
          <div className="flex items-center justify-between">
            <div className='flex items-center gap-4 w-3/5'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <span className="font-semibold">Instructions:</span>
              {isEditing.instruct ? (
                <textarea
                  value={itemData?.instruct || ''}
                  onChange={(e) => setItemData({ ...itemData, instruct: e.target.value })}
                  className="pl-4 text-lg h-20 rounded-xl bg-inherit w-full border border-gray-300 focus:border-blue-500 hover:bg-[#284c34]"
                />
              ) : (
                <p className="text-lg">{itemData?.instruct}</p>
              )}
            </div>
            <div className="flex gap-4">
              <CustomButton 
                variant="contained"
                onClick={() => handleEdit('instruct')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </CustomButton>
              {isEditing.instruct && 
              <CustomButton 
                variant="contained"
                onClick={() => handleSaveClick('instruct')}
              >
                <p className="text-black">Save</p>
              </CustomButton>}
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center justify-between">
            <div className='flex items-center gap-4'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
              <span className="font-semibold">Phone:</span>
              {isEditing.phone ? (
                <input
                  type="text"
                  value={itemData?.phone || ''}
                  onChange={(e) => setItemData({ ...itemData, phone: e.target.value })}
                  className="pl-4 text-lg rounded-xl bg-inherit border border-gray-300 focus:border-blue-500 hover:bg-[#284c34]"
                />
              ) : (
                <p className="text-lg">{itemData?.phone}</p>
              )}
            </div>
            <div className="flex gap-4">
              <CustomButton 
                variant="contained"
                onClick={() => handleEdit('phone')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </CustomButton>
              {isEditing.phone && 
              <CustomButton 
                variant="contained"
                onClick={() => handleSaveClick('phone')}
              >
                <p className="text-black">Save</p>
              </CustomButton>}
            </div>
          </div>

          {/* Picture URL */}
          <div className="flex items-center justify-between">
            <div className='flex items-center gap-4'>
              <LinkIcon style={{ fontSize: 24 }} />
              <span className="font-semibold">Picture URL:</span>
              {isEditing.pic ? (
                <input
                  type="text"
                  value={itemData?.pic || ''}
                  onChange={(e) => setItemData({ ...itemData, pic: e.target.value })}
                  placeholder="Enter image URL (e.g. example.com/image.jpg)"
                  className="pl-4 text-lg rounded-xl bg-inherit border border-gray-300 focus:border-blue-500 hover:bg-[#284c34] w-96"
                />
              ) : (
                <a 
                  href={formatUrl(itemData?.pic)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-lg text-blue-400 hover:text-blue-300 underline"
                >
                  {itemData?.pic || 'No image available'}
                </a>
              )}
            </div>
            <div className="flex gap-4">
              <CustomButton 
                variant="contained"
                onClick={() => handleEdit('pic')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </CustomButton>
              {isEditing.pic && 
              <CustomButton 
                variant="contained"
                onClick={() => handleSaveClick('pic')}
              >
                <p className="text-black">Save</p>
              </CustomButton>}
            </div>
          </div>
        </div>

        {/* Delete button and confirmation modal */}
        <div className="mt-8 flex justify-center">
          <Button
            variant="contained"
            onClick={() => setShowDeleteModal(true)}
            sx={{
              backgroundColor: '#dc2626',
              borderRadius: '20px',
              padding: '12px 24px',
              '&:hover': {
                backgroundColor: '#b91c1c',
              },
            }}
          >
            Delete Event
          </Button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl text-black">
              <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
              <p className="mb-6">Are you sure you want to delete this event? This action cannot be undone.</p>
              <div className="flex justify-end gap-4">
                <Button
                  variant="outlined"
                  onClick={() => setShowDeleteModal(false)}
                  sx={{ borderRadius: '20px' }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleDelete}
                  sx={{
                    backgroundColor: '#dc2626',
                    borderRadius: '20px',
                    '&:hover': {
                      backgroundColor: '#b91c1c',
                    },
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditPage;