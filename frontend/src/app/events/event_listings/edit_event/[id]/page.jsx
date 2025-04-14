'use client';
import { useState, useEffect } from 'react';
import { Proza_Libre } from 'next/font/google'; // Import the Proza Libre font
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function Page({ params }) {
    const { id } = params;
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditing, setIsEditing] = useState({
        eventName: false,
        eventDesc: false,
        location: false,
        instruct: false,
        startDate: false,
        timeStart: false,
        org: false,
        phone: false,
        image_url: false
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    
    const CustomButton = styled(Button)({
      backgroundColor: '#44E489',
      borderRadius: '20px',
      padding: '8px 24px',
      minWidth: '60px',
      height: '40px',
      boxShadow: 'none',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: '#3acc7a',
        boxShadow: 'none',
        transform: 'scale(1.05)',
      },
    });

    const handleEdit = (field) => {
      setIsEditing((prev) => ({ ...prev, [field]: true }));
      setError(null);
      
      if (field === 'image_url') {
        setPreviewUrl(null);
      }
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Check file size - 5MB limit
        if (file.size > 5 * 1024 * 1024) {
          setError('File is too large. Maximum size is 5MB.');
          return;
        }
        setSelectedFile(file);
        setError(null);
        
        // Create a preview URL
        const fileReader = new FileReader();
        fileReader.onload = () => {
          setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
      }
    };

    const handleSaveClick = async (field) => {
      try {
        // Special handling for image_url field with file upload
        if (field === 'image_url') {
          if (!selectedFile) {
            setError('Please select a file to upload');
            return;
          }

          const formData = new FormData();
          formData.append('eventlist[image]', selectedFile);

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/eventlists/${id}`, {
            method: 'PATCH',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Failed to update image: ${response.statusText}`);
          }

          const updatedData = await response.json();
          setEventData(updatedData);
        } else {
          // Regular text field handling - existing code
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/eventlists/${id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ [field]: eventData[field] }),
          });
    
          if (!response.ok) {
            throw new Error(`Failed to update item: ${response.statusText}`);
          }
    
          const updatedData = await response.json();
          // Merge the updated data with the existing event data instead of replacing it entirely
          setEventData(prevData => ({ ...prevData, ...updatedData }));
        }
        
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 1500);
      } catch (err) {
        setError(err.message);
        console.error('Error updating event:', err);
      } finally {
        setIsEditing((prev) => ({ ...prev, [field]: false }));
        setSelectedFile(null);
        setPreviewUrl(null);
      }
    };

    const handleDelete = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/eventlists/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`Failed to delete event: ${response.statusText}`);
        }

        // Redirect to event listings page after successful deletion
        window.location.href = '/events/event_listings';
      } catch (err) {
        setError(err.message);
        console.error('Error deleting event:', err);
      }
    };


    
    useEffect(() => {
        const fetchEventData = async () => {
            try {
                // Fetch event data from API
                const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await fetch(`${apiBaseUrl}/eventlists/${id}`);
                
                if (!response.ok) {
                    throw new Error('Failed to load event details');
                }
                
                const data = await response.json();
                setEventData(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching event:', err);
                setError(err.message);
                setLoading(false);
            }
        };
        
        fetchEventData();
    }, [id]);

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#F6F2E9]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#214933] mx-auto mb-4"></div>
                    <p className={`text-xl text-[#214933] ${prozaLibre.className}`}>Loading event details...</p>
                </div>
            </div>
        );
    }
    
    // Error state
    if (error || !eventData) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#F6F2E9]">
                <div className="text-center p-8 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className={`text-2xl text-red-500 ${prozaLibre.className} mb-4`}>Failed to load event details</p>
                    <p className={`text-gray-600 ${prozaLibre.className}`}>{error || "The event may not exist or has been removed."}</p>
                    <button 
                        onClick={() => window.history.back()} 
                        className="mt-6 px-6 py-2 bg-[#214933] text-white rounded-lg hover:bg-[#1a3a29] transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }
    
    // Extract event properties from fetched data with correct field mappings
    const {
        eventDesc: EventDescription,
        location: Location,
        instruct: WebsiteLink,
        pic,
        startDate: eventDate,
        timeStart: Time,
        eventName: EventName,
        org: EventOrganizer,
        image_url,
        phone: PhoneNumber
    } = eventData;

    function formatIsoToAmPm(isoString) {
      const timePart = isoString.split("T")[1].split(":");
      let hour = parseInt(timePart[0], 10);
      const minute = timePart[1];
      const ampm = hour >= 12 ? 'PM' : 'AM';
    
      hour = hour % 12;
      hour = hour === 0 ? 12 : hour;
    
      return `${hour}:${minute} ${ampm}`;
    }


    return (
      <div className="flex flex-col w-full h-[1280px] relative">
        {showSuccessModal && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50 transition-opacity duration-300">
            Edit successful!
          </div>
        )}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p>Are you sure you want to delete this event? This action cannot be undone.</p>
              <div className="flex gap-4 mt-6 justify-end">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-row gap-8 w-full h-2/5 p-12">
            <div className="flex flex-col justify-center items-center basis-1/2 h-full bg-[#F6F2E9] rounded-xl relative p-8">
                {isEditing.image_url ? (
                  <div className="flex flex-col items-center gap-4 p-4 w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="p-2 w-full text-black bg-white border border-gray-300 rounded-lg"
                    />
                    {previewUrl && (
                      <div className="mt-2 max-w-full max-h-64 overflow-hidden">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="object-contain w-full h-full border rounded-xl"
                        />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <CustomButton 
                        variant="contained"
                        onClick={() => handleSaveClick('image_url')}
                        disabled={!selectedFile}
                      >
                        <p className="text-black">Save</p>
                      </CustomButton>
                      <Button 
                        variant="outlined"
                        onClick={() => {
                          setIsEditing(prev => ({...prev, image_url: false}));
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                  </div>
                ) : (
                  <>
                    {image_url ? (
                        <img 
                            src={image_url} 
                            alt={EventName} 
                            className="max-w-full max-h-full object-contain border rounded-xl"
                            onError={(e) => {
                              console.log("Image failed to load:", image_url);
                              e.target.onerror = null;
                              e.target.style.display = "none";
                            }}
                        />
                    ) : image_url ? (
                        <img 
                            src={image_url} 
                            alt={EventName} 
                            className="max-w-full max-h-full object-contain border rounded-xl"
                            onError={(e) => {
                              console.log("Image failed to load:", image_url);
                              e.target.onerror = null;
                              e.target.style.display = "none";
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center rounded-xl">
                            <span className="text-gray-500">No image available</span>
                        </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <CustomButton 
                        variant="contained"
                        onClick={() => handleEdit('image_url')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" className="size-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                      </CustomButton>
                    </div>
                  </>
                )}
            </div>
            <div className="flex flex-col justify-around items-start basis-1/2 h-full bg-[#F6F2E9] rounded-xl p-12">
                <div className="flex flex-row gap-4 justify-center items-center w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#214933" class="size-14">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                    <div className="flex-1 flex justify-between items-center">
                      {isEditing.startDate ? (
                        <input
                          type="date"
                          value={eventData.startDate || ''}
                          onChange={(e) => setEventData({ ...eventData, startDate: e.target.value })}
                          className="pl-4 text-xl rounded-xl bg-white text-black border border-gray-300 flex-1"
                        />
                      ) : (
                        <p className={`text-2xl text-[#214933] ${prozaLibre.className}`}>{eventDate}</p>
                      )}
                      <div className="flex gap-2">
                        {isEditing.startDate ? (
                          <CustomButton 
                            variant="contained"
                            onClick={() => handleSaveClick('startDate')}
                          >
                            <p className="text-black">Save</p>
                          </CustomButton>
                        ) : (
                          <CustomButton 
                            variant="contained"
                            onClick={() => handleEdit('startDate')}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" className="size-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                          </CustomButton>
                        )}
                      </div>
                    </div>
                </div>
                <div className="flex flex-row gap-4 justify-center items-center w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#214933" className="size-14">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <div className="flex-1 flex justify-between items-center">
                      {isEditing.timeStart ? (
                        <input
                          type="time"
                          value={eventData.timeStart ? eventData.timeStart.substring(11, 16) : ''}
                          onChange={(e) => {
                            const currentTime = e.target.value; // HH:mm format
                            // Preserve the date part from startDate or use a default if needed
                            const datePart = eventData.startDate ? eventData.startDate.split("T")[0] : '2000-01-01';
                            // Construct a new ISO-like string. Note: Timezone/seconds might need adjustment based on backend needs.
                            const newIsoTime = `${datePart}T${currentTime}:00.000Z`; 
                            setEventData({ ...eventData, timeStart: newIsoTime });
                          }}
                          className="pl-4 text-xl rounded-xl bg-white text-black border border-gray-300 flex-1"
                        />
                      ) : (
                        <p className={`text-2xl text-[#214933] ${prozaLibre.className}`}>{formatIsoToAmPm(Time)}</p>
                      )}
                      <div className="flex gap-2">
                        {isEditing.timeStart ? (
                          <CustomButton 
                            variant="contained"
                            onClick={() => handleSaveClick('timeStart')}
                          >
                            <p className="text-black">Save</p>
                          </CustomButton>
                        ) : (
                          <CustomButton 
                            variant="contained"
                            onClick={() => handleEdit('timeStart')}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" className="size-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                          </CustomButton>
                        )}
                      </div>
                    </div>
                </div>
                <div className="flex flex-row gap-4 justify-center items-center w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#214933" class="size-14">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    <div className="flex-1 flex justify-between items-center">
                      {isEditing.location ? (
                        <input
                          type="text"
                          value={eventData.location || ''}
                          onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                          className="pl-4 text-xl rounded-xl bg-white text-black border border-gray-300 flex-1"
                        />
                      ) : (
                        <p className={`text-2xl text-[#214933] ${prozaLibre.className}`}>{Location}</p>
                      )}
                      <div className="flex gap-2">
                        {isEditing.location ? (
                          <CustomButton 
                            variant="contained"
                            onClick={() => handleSaveClick('location')}
                          >
                            <p className="text-black">Save</p>
                          </CustomButton>
                        ) : (
                          <CustomButton 
                            variant="contained"
                            onClick={() => handleEdit('location')}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" className="size-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                          </CustomButton>
                        )}
                      </div>
                    </div>
                </div>
                <div className="h-1 bg-[#214933] w-full"></div>

                <div className='flex flex-row gap-4 justify-center items-center w-full'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#214933" className="size-14">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                    </svg>
                    <div className="flex-1 flex justify-between items-center">
                      {isEditing.phone ? (
                        <input
                          type="text"
                          value={eventData.phone || ''}
                          onChange={(e) => setEventData({ ...eventData, phone: e.target.value })}
                          className="pl-4 text-xl rounded-xl bg-white text-black border border-gray-300 flex-1"
                        />
                      ) : (
                        <p className={`text-2xl text-[#214933] ${prozaLibre.className}`}>{PhoneNumber || "(123)-456-7890"}</p>
                      )}
                      <div className="flex gap-2">
                        {isEditing.phone ? (
                          <CustomButton 
                            variant="contained"
                            onClick={() => handleSaveClick('phone')}
                          >
                            <p className="text-black">Save</p>
                          </CustomButton>
                        ) : (
                          <CustomButton 
                            variant="contained"
                            onClick={() => handleEdit('phone')}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" className="size-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                          </CustomButton>
                        )}
                      </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='flex flex-row h-3/5 w-full px-12 mt-[-1rem]'>
            <div className='flex flex-col w-full h-full bg-[#F6F2E9] rounded-xl p-12'>
                <div className='flex flex-row justify-between items-center gap-2'>
                    <div className='flex flex-row ju items-center gap-8'>
                        <div className="flex-1 flex justify-between items-center">
                          {isEditing.org ? (
                            <input
                              type="text"
                              value={eventData.org || ''}
                              onChange={(e) => setEventData({ ...eventData, org: e.target.value })}
                              className="pl-4 text-xl rounded-xl bg-white text-black border border-gray-300 flex-1"
                            />
                          ) : (
                            <p className={`text-3xl text-black ${prozaLibre.className}`}>{EventOrganizer || Location}</p>
                          )}
                          <div className="flex gap-2">
                            {isEditing.org ? (
                              <CustomButton 
                                variant="contained"
                                onClick={() => handleSaveClick('org')}
                              >
                                <p className="text-black">Save</p>
                              </CustomButton>
                            ) : (
                              <CustomButton 
                                variant="contained"
                                onClick={() => handleEdit('org')}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" className="size-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                </svg>
                              </CustomButton>
                            )}
                          </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="contained"
                        color="error"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        Delete Event
                      </Button>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                  {isEditing.eventName ? (
                    <input
                      type="text"
                      value={eventData.eventName || ''}
                      onChange={(e) => setEventData({ ...eventData, eventName: e.target.value })}
                      className="pl-4 text-5xl my-4 rounded-xl bg-white text-black border border-gray-300 flex-1"
                    />
                  ) : (
                    <p className={`text-[60px] text-black ${prozaLibre.className} my-4`}>{EventName}</p>
                  )}
                  <div className="flex gap-2">
                    {isEditing.eventName ? (
                      <CustomButton 
                        variant="contained"
                        onClick={() => handleSaveClick('eventName')}
                      >
                        <p className="text-black">Save</p>
                      </CustomButton>
                    ) : (
                      <CustomButton 
                        variant="contained"
                        onClick={() => handleEdit('eventName')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" className="size-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                      </CustomButton>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-start mt-12 mb-4">
                  <div>
                    <p className={`text-2xl text-black ${prozaLibre.className}`}>Event Description:</p>
                    {isEditing.eventDesc ? (
                      <textarea
                        value={eventData.eventDesc || ''}
                        onChange={(e) => setEventData({ ...eventData, eventDesc: e.target.value })}
                        className="p-4 mt-2 w-full text-xl rounded-xl bg-white text-black border border-gray-300"
                        rows={4}
                      />
                    ) : (
                      <p className={`text-2xl text-black ${prozaLibre.className}`}>{EventDescription || "No description available"}</p>
                    )}
                  </div>
                  <div className="flex gap-2 mt-8">
                    {isEditing.eventDesc ? (
                      <CustomButton 
                        variant="contained"
                        onClick={() => handleSaveClick('eventDesc')}
                      >
                        <p className="text-black">Save</p>
                      </CustomButton>
                    ) : (
                      <CustomButton 
                        variant="contained"
                        onClick={() => handleEdit('eventDesc')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" className="size-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                      </CustomButton>
                    )}
                  </div>
                </div>

                <div className="w-full h-1 bg-[#214933] mt-12 mb-6"></div>

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className={`text-2xl text-black ${prozaLibre.className} mb-4`}>Instructions for event:</p>
                    {isEditing.instruct ? (
                      <textarea
                        value={eventData.instruct || ''}
                        onChange={(e) => setEventData({ ...eventData, instruct: e.target.value })}
                        className="p-4 w-full text-xl rounded-xl bg-white text-black border border-gray-300"
                        rows={2}
                      />
                    ) : (
                      <ul>
                        <li>{WebsiteLink || "No website link available"}</li>
                      </ul>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {isEditing.instruct ? (
                      <CustomButton 
                        variant="contained"
                        onClick={() => handleSaveClick('instruct')}
                      >
                        <p className="text-black">Save</p>
                      </CustomButton>
                    ) : (
                      <CustomButton 
                        variant="contained"
                        onClick={() => handleEdit('instruct')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" className="size-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                      </CustomButton>
                    )}
                  </div>
                </div>
            </div>
        </div>
      </div>
    );
}
  