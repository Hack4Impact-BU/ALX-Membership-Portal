'use client'

import { useState } from 'react';
import { Inter, Proza_Libre } from 'next/font/google'; // Import the Proza Libre font
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function EventCardAdmin({EventDescription, Location, WebsiteLink, pic, Date, index, description, saved, Time, distance, toggleCardSaved, EventName, EventOrganizer, id, image_url}) {

    const [isSaved, setIsSaved] = useState(saved);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleClick = () => {
        setIsSaved(!isSaved);
        toggleCardSaved(index);
    }
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

    const openDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const handleDelete = async () => {
        try {
          const response = await fetch(`${apiBaseUrl}/eventlists/${id}`, {
            method: 'DELETE',
          });
      
          if (!response.ok) {
            throw new Error('Failed to delete event');
          }
          
          // Close modal after successful deletion
          closeDeleteModal();
          
          // Refresh the page or update UI
          window.location.reload();
      
        } catch (error) {
          console.error('Error:', error);
        }
      };

      const handleEdit = () => {
        window.location.href = `/events/event_listings/edit_event/${id}`;
      };
      
    return (
        <>
            <div className="border flex flex-col justify-evenly rounded-3xl bg-[#F6F2E9] w-96 h-64 transition-transform duration-300 hover:scale-105">
                <Link href={`/events/event_listings/edit_event/${id}`}>
                <div className="flex flex-row justify-center items-center gap-2 hover:cursor-pointer">
                    {/* gonna be image circle */}
                    {image_url ? (
                        <img 
                            src={image_url} 
                            alt={EventName} 
                            className="w-20 h-20 object-cover rounded-full"
                        />
                    ) : (
                        <div className="w-20 h-20 bg-orange-400 rounded-full"/>
                    )}
                    <div className="flex items-center justify-center w-60 h-14 bg-white rounded-full">
                        <p className={`p-4 text-2xl text-[#214933] ${prozaLibre.className} overflow-hidden text-ellipsis whitespace-nowrap`}>{EventName}</p>
                    </div>
                </div>
                </Link>
                <div className='flex flex-row w-full pl-8 pr-5'>
                    <div className='flex flex-col justify-center'>
                        <p className={`text-sm ${prozaLibre.className} text-[#214933]`}>{Location}</p>
                        <p className={`text-sm ${prozaLibre.className} text-[#214933]`}>{Date}</p>
                        <p className={`text-sm ${prozaLibre.className} text-[#214933]`}>{Time}</p>
                        <div className='w-16 h-px bg-black my-2'/>
                        <p className={`text-sm ${prozaLibre.className} text-[#214933] w-full font-bold`}>Event Organizer:</p>
                        <p className={`text-sm ${prozaLibre.className} text-[#214933]`}>{EventOrganizer}</p>
                        
                    </div>
                    <div className='flex flex-row mt-auto ml-auto gap-2 cursor-pointer'>

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#FF746C" class="size-6" onClick={openDeleteModal}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#43e48a" viewBox="0 0 24 24" stroke-width="1.5" stroke="#214933" class="size-6" onClick={handleEdit} >
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill={saved ? '#214933' : 'none'} viewBox="0 0 24 24" stroke-width="2" stroke="#214933" class="size-6" onClick={handleClick}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg> */}
        
                    </div>
                </div>
            </div>
            
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                        <h3 className={`text-xl font-semibold mb-4 text-[#214933] ${prozaLibre.className}`}>Confirm Delete</h3>
                        <p className={`mb-6 text-gray-700 ${prozaLibre.className}`}>
                            Are you sure you want to delete "{EventName}"? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button 
                                onClick={closeDeleteModal}
                                className={`px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition ${prozaLibre.className}`}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDelete}
                                className={`px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition ${prozaLibre.className}`}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}