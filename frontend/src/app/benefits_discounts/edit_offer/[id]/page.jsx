'use client'

import { Proza_Libre } from 'next/font/google'; // Import the Proza Libre font
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function Page() {
    const { id } = useParams();
    const [offerData, setOfferData] = useState({
      offerTitle: '',
      place: '',
      link: '',
      pic: '',
      startDate: '',
      offerDesc: '',
      instruct: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditing, setIsEditing] = useState({
      offerTitle: false,
      place: false,
      link: false,
      pic: false,
      startDate: false,
      offerDesc: false,
      instruct: false
    });
    
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const CustomButton = styled(Button)({
      backgroundColor: '#44E489',
      borderRadius: '20px',
      padding: '8px 24px',
      width: '60px',
      height: '40px',
      '&:hover': {
        backgroundColor: '#3acc7a',
      },
    });

    const handleEdit = (field) => {
      setIsEditing((prev) => ({ ...prev, [field]: true }));
    };

    const formatUrl = (url) => {
      if (!url) return '';
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      return `https://${url}`;
    };

    const handleSaveClick = async (field) => {
      try {
        const valueToSave = field === 'link' ? formatUrl(offerData[field]) : offerData[field];
        
        const response = await fetch(`${apiBaseUrl}/product_offers/${id}`, {
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
        setOfferData(updatedData);
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
        const response = await fetch(`${apiBaseUrl}/product_offers/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`Failed to delete item: ${response.statusText}`);
        }

        // Redirect to benefits_discounts page after successful deletion
        window.location.href = '/benefits_discounts';
      } catch (err) {
        setError(err.message);
        console.error('Error deleting item:', err);
      }
    };

    useEffect(() => {
      const fetchOfferData = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`${apiBaseUrl}/product_offers/${id}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch offer data');
          }
          
          const data = await response.json();
          setOfferData(data);
        } catch (err) {
          console.error('Error fetching offer data:', err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      
      if (id) {
        fetchOfferData();
      }
    }, [id, apiBaseUrl]);

    if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  
    const { offerTitle, place, link, pic, startDate, offerDesc, instruct } = offerData;
  
    return (
      <div className="flex flex-col w-full h-[1280px] relative">
        {showSuccessModal && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-4 rounded-full shadow-lg z-50">
            Edit successful!
          </div>
        )}
        <div className="flex flex-row gap-8 w-full h-2/5 p-12">
            <div className="flex flex-col justify-center items-center basis-1/2 h-full bg-[#F6F2E9] rounded-xl relative">
                {isEditing.pic ? (
                  <div className="flex flex-col items-center gap-4 p-4">
                    <input
                      type="text"
                      value={offerData.pic || ''}
                      onChange={(e) => setOfferData({ ...offerData, pic: e.target.value })}
                      className="p-2 w-full text-black bg-white border border-gray-300 rounded-lg"
                      placeholder="Enter image URL"
                    />
                    <div className="flex gap-2">
                      <CustomButton 
                        variant="contained"
                        onClick={() => handleSaveClick('pic')}
                      >
                        <p className="text-black">Save</p>
                      </CustomButton>
                      <Button 
                        variant="outlined"
                        onClick={() => setIsEditing(prev => ({...prev, pic: false}))}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {pic ? (
                      <img 
                        src={pic} 
                        alt={offerTitle}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          console.log("Image failed to load:", pic);
                          e.target.onerror = null;
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <h1>IMAGE GOES HERE</h1>
                    )}
                    <div className="absolute top-2 right-2">
                      <CustomButton 
                        variant="contained"
                        onClick={() => handleEdit('pic')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                      </CustomButton>
                    </div>
                  </>
                )}
            </div>
            <div className="flex flex-col justify-around items-start basis-1/2 h-full bg-[#F6F2E9] rounded-xl p-12">
                <div className="flex flex-row gap-4 justify-center items-center w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#214933" className="size-14">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                    </svg>
                    <div className="flex-1 flex justify-between items-center">
                      {isEditing.offerTitle ? (
                        <input
                          type="text"
                          value={offerData.offerTitle || ''}
                          onChange={(e) => setOfferData({ ...offerData, offerTitle: e.target.value })}
                          className="pl-4 text-xl rounded-xl bg-white text-black border border-gray-300 flex-1"
                        />
                      ) : (
                        <p className={`text-2xl text-[#214933] ${prozaLibre.className}`}>{offerData.offerTitle}</p>
                      )}
                      <div className="flex gap-2">
                        {isEditing.offerTitle ? (
                          <CustomButton 
                            variant="contained"
                            onClick={() => handleSaveClick('offerTitle')}
                          >
                            <p className="text-black">Save</p>
                          </CustomButton>
                        ) : (
                          <CustomButton 
                            variant="contained"
                            onClick={() => handleEdit('offerTitle')}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                          </CustomButton>
                        )}
                      </div>
                    </div>
                </div>
                <div className="flex flex-row gap-4 justify-center items-center w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#214933" className="size-14">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                    <div className="flex-1 flex justify-between items-center">
                      {isEditing.startDate ? (
                        <input
                          type="date"
                          value={offerData.startDate || ''}
                          onChange={(e) => setOfferData({ ...offerData, startDate: e.target.value })}
                          className="pl-4 text-xl rounded-xl bg-white text-black border border-gray-300 flex-1"
                        />
                      ) : (
                        <p className={`text-2xl text-[#214933] ${prozaLibre.className}`}>{offerData.startDate}</p>
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
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                          </CustomButton>
                        )}
                      </div>
                    </div>
                </div>
                <div className="flex flex-row gap-4 justify-center items-center w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#214933" className="size-14">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    <div className="flex-1 flex justify-between items-center">
                      {isEditing.place ? (
                        <input
                          type="text"
                          value={offerData.place || ''}
                          onChange={(e) => setOfferData({ ...offerData, place: e.target.value })}
                          className="pl-4 text-xl rounded-xl bg-white text-black border border-gray-300 flex-1"
                        />
                      ) : (
                        <p className={`text-2xl text-[#214933] ${prozaLibre.className}`}>{offerData.place}</p>
                      )}
                      <div className="flex gap-2">
                        {isEditing.place ? (
                          <CustomButton 
                            variant="contained"
                            onClick={() => handleSaveClick('place')}
                          >
                            <p className="text-black">Save</p>
                          </CustomButton>
                        ) : (
                          <CustomButton 
                            variant="contained"
                            onClick={() => handleEdit('place')}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" className="size-6">
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
                        <div className="w-36 h-36 bg-red-400 rounded-full"/>
                        <p className={`text-5xl text-[#214933] ${prozaLibre.className}`}>{offerData.place}</p>
                    </div>
                    <div className="flex gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill={'none'} viewBox="0 0 24 24" strokeWidth="2" stroke="#214933" className="size-20">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                      </svg>
                      <Button
                        variant="contained"
                        onClick={() => setShowDeleteModal(true)}
                        sx={{
                          backgroundColor: '#dc2626',
                          borderRadius: '20px',
                          '&:hover': {
                            backgroundColor: '#b91c1c',
                          },
                        }}
                      >
                        Delete Offer
                      </Button>
                    </div>
                </div>

                <div className="flex justify-between items-center my-4">
                  {isEditing.offerTitle ? (
                    <input
                      type="text"
                      value={offerData.offerTitle || ''}
                      onChange={(e) => setOfferData({ ...offerData, offerTitle: e.target.value })}
                      className="pl-4 text-[40px] rounded-xl bg-white text-black border border-gray-300 w-4/5"
                    />
                  ) : (
                    <p className={`text-[60px] text-black ${prozaLibre.className}`}>{offerData.offerTitle}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  <p className={`text-2xl text-black ${prozaLibre.className}`}>Offer Description:</p>
                  <div className="flex justify-between items-start">
                    {isEditing.offerDesc ? (
                      <textarea
                        value={offerData.offerDesc || ''}
                        onChange={(e) => setOfferData({ ...offerData, offerDesc: e.target.value })}
                        className="pl-4 py-2 text-xl rounded-xl bg-white text-black border border-gray-300 w-4/5 h-32"
                      />
                    ) : (
                      <p className={`text-2xl text-black ${prozaLibre.className} w-4/5`}>{offerData.offerDesc}</p>
                    )}
                    <div className="flex gap-2">
                      {isEditing.offerDesc ? (
                        <CustomButton 
                          variant="contained"
                          onClick={() => handleSaveClick('offerDesc')}
                        >
                          <p className="text-black">Save</p>
                        </CustomButton>
                      ) : (
                        <CustomButton 
                          variant="contained"
                          onClick={() => handleEdit('offerDesc')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                          </svg>
                        </CustomButton>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full h-1 bg-[#214933] mt-12 mb-6"></div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <p className={`text-2xl text-black ${prozaLibre.className}`}>Instructions to Redeem:</p>
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
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                          </svg>
                        </CustomButton>
                      )}
                    </div>
                  </div>
                  {isEditing.instruct ? (
                    <textarea
                      value={offerData.instruct || ''}
                      onChange={(e) => setOfferData({ ...offerData, instruct: e.target.value })}
                      className="pl-4 py-2 text-xl rounded-xl bg-white text-black border border-gray-300 w-full h-48"
                      placeholder="Enter instructions separated by periods (e.g. 'Step 1. Step 2. Step 3.')"
                    />
                  ) : (
                    offerData.instruct && (
                      <ul className={`text-2xl text-black ${prozaLibre.className} list-disc pl-8`}>
                        {offerData.instruct.split(". ").filter(instruction => instruction.trim()).map((instruction, index) => (
                          <li key={index}>{instruction.trim()}</li>
                        ))}
                      </ul>
                    )
                  )}
                </div>
            </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl text-black">
              <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
              <p className="mb-6">Are you sure you want to delete this offer? This action cannot be undone.</p>
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
    );
  }
  