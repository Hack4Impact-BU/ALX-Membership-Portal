"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { FolderIcon } from '@heroicons/react/outline';
import { Proza_Libre } from 'next/font/google';
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });


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
    researchTitle: false,
    researchDesc: false,
    date: false,
    location: false,
    link: false,
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
      // Format the URL before saving if it's the link field
      const valueToSave = field === 'link' ? formatUrl(itemData[field]) : itemData[field];
      
      const response = await fetch(`${apiBaseUrl}/research/${id}`, {
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
      const response = await fetch(`${apiBaseUrl}/research/${id}`, {
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
    const fetchResearch = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/research/${id}`);
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

    fetchResearch();
  }, [apiBaseUrl, id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={`flex ${prozaLibre.className} flex-col items-center bg-[#214933] min-h-screen w-10/12 p-8 mt-6 text-white`}>
      {showSuccessModal && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-4 rounded-full shadow-lg">
          Edit successful!
        </div>
      )}
      <div className="flex w-full">
        <FolderIcon className="h-32 w-32 stroke-[#F6F2E9]" />
        <ReusableHeader header={"Archive"}/>
      </div>
      <div className={`${prozaLibre.className} bg-[#335843] rounded-xl w-full shadow-lg p-8 text-white`}>
        <div className="flex justify-between items-center mb-6">
            {isEditing.researchTitle ? (
              <input
                type="text"
                value={itemData?.researchTitle || ''}
                onChange={(e) => setItemData({ ...itemData, researchTitle: e.target.value })}
                className="pl-4 text-[34px] rounded-xl font-semibold bg-inherit w-1/2 border border-gray-300 focus:border-blue-500 hover:bg-[#284c34]"
              />
            ) : (
              <h1 className="text-[34px] font-semibold">
                {itemData?.researchTitle || 'Edit Research'}
              </h1>
            )}
          <div className="flex gap-4">
            <CustomButton 
              variant="contained"
              onClick={() => handleEdit('researchTitle')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
            </CustomButton>
            {isEditing.researchTitle && 
            <CustomButton 
              variant="contained"
              onClick={() => handleSaveClick('researchTitle')}
            >
              <p className="text-black">Save</p>
            </CustomButton>}
          </div>
        </div>

        <div className="mb-10 w-full flex justify-between items-center text-[20px]">
          {isEditing.researchDesc ? (
            <textarea
              value={itemData?.researchDesc || ''}
              onChange={(e) => setItemData({ ...itemData, researchDesc: e.target.value })}
              className="pl-4 text-[20px] h-40 rounded-xl bg-inherit w-3/5 border border-gray-300 focus:border-blue-500 hover:bg-[#284c34]"
            />
          ) : (
            <p className="w-3/5">{itemData?.researchDesc}</p>
          )}
          <div className="flex gap-4">
            <CustomButton 
              variant="contained"
              onClick={() => handleEdit('researchDesc')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
            </CustomButton>
            {isEditing.researchDesc && 
            <CustomButton 
              variant="contained"
              onClick={() => handleSaveClick('researchDesc')}
            >
              <p className="text-black">Save</p>
            </CustomButton>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-8">
          <div className="flex items-center justify-between">
            <div className='flex items-center gap-4'>
              <CalendarTodayIcon style={{ fontSize: 32 }} />
              {isEditing.date ? (
                <input
                  type="date"
                  value={itemData?.date || ''}
                  onChange={(e) => setItemData({ ...itemData, date: e.target.value })}
                  className="pl-4 text-lg rounded-xl bg-inherit border border-gray-300 focus:border-blue-500 hover:bg-[#284c34]"
                />
              ) : (
                <p className="text-lg">{itemData?.date}</p>
              )}
            </div>
            <div className="flex gap-4">
              <CustomButton 
                variant="contained"
                onClick={() => handleEdit('date')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </CustomButton>
              {isEditing.date && 
              <CustomButton 
                variant="contained"
                onClick={() => handleSaveClick('date')}
              >
                <p className="text-black">Save</p>
              </CustomButton>}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className='flex items-center gap-4'>
              <LocationOnIcon style={{ fontSize: 32 }} />
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
          <div className="flex items-center justify-between">
            <div className='flex items-center gap-4'>
              <LinkIcon style={{ fontSize: 32 }} />
              {isEditing.link ? (
                <input
                  type="text"
                  value={itemData?.link || ''}
                  onChange={(e) => setItemData({ ...itemData, link: e.target.value })}
                  placeholder="Enter URL (e.g. example.com or https://example.com)"
                  className="pl-4 text-lg rounded-xl bg-inherit border border-gray-300 focus:border-blue-500 hover:bg-[#284c34] w-96"
                />
              ) : (
                <a 
                  href={formatUrl(itemData?.link)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-lg text-blue-400 hover:text-blue-300 underline"
                >
                  {itemData?.link || 'No link available'}
                </a>
              )}
            </div>
            <div className="flex gap-4">
              <CustomButton 
                variant="contained"
                onClick={() => handleEdit('link')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </CustomButton>
              {isEditing.link && 
              <CustomButton 
                variant="contained"
                onClick={() => handleSaveClick('link')}
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
            Delete Research
          </Button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl text-black">
              <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
              <p className="mb-6">Are you sure you want to delete this research? This action cannot be undone.</p>
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