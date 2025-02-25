"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { FolderIcon } from '@heroicons/react/outline';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ReusableHeader from '@/components/ReusableHeader/ReusableHeader';
import { styled } from '@mui/material/styles';

const EditPage = () => {
  const { id } = useParams();
  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/training/${id}`);
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

  function extractYouTubeID(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center bg-[#214933] min-h-screen w-10/12 p-8 mt-6 text-white">
        <div className="flex w-full">
        <FolderIcon className="h-32 w-32 stroke-[#F6F2E9]" />
        <ReusableHeader header={"Archive"}/>
      </div>
      <div className="bg-[#335843] rounded-xl w-full shadow-lg p-8 text-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[34px] font-semibold">
            {itemData?.trainingTitle || 'Edit Training'}
          </h1>
        </div>

        <div className="mb-10 text-[20px]">
          <p>{itemData?.trainingDesc}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-8">
          <div className="flex items-center gap-4">
            <CalendarTodayIcon style={{ fontSize: 32 }} />
            <p className="text-lg">{itemData?.date}</p>
          </div>
          <div className="flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <p className="text-lg">{itemData?.link}</p>
          </div>
        </div>

        {itemData?.link && (
          <div className="my-8 p-8 bg-white rounded-3xl">
            <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-3xl"
                src={`https://www.youtube.com/embed/${extractYouTubeID(itemData.link)}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditPage;