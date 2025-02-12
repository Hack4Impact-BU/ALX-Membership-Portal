'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Hyperlinks from '@/components/Hyperlinks';
import { Inter, Proza_Libre } from 'next/font/google';
import axios from 'axios';
import { QuestionMarkCircleIcon } from '@heroicons/react/outline';
import LoadingScreen from '@/components/LoadingScreen';

const inter = Inter({ subsets: ['latin'] });
const prozaLibre = Proza_Libre({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] });

export default function Questions() {
  const [qAndAs, setQAndAs] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Q&As from the API with a minimum delay of 300 ms
  useEffect(() => {
    const fetchQAndAs = async () => {
      setIsLoading(true);
      const startTime = Date.now();
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/q_and_as`);
        const data = response.data;
        const elapsed = Date.now() - startTime;
        const minDelay = 300; // 300 ms minimum delay
        const remainingDelay = minDelay - elapsed;
        if (remainingDelay > 0) {
          setTimeout(() => {
            setQAndAs(data);
            setIsLoading(false);
          }, remainingDelay);
        } else {
          setQAndAs(data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching Q&A data:', error);
        setErrorMessage('Failed to fetch Q&A data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchQAndAs();
  }, []);

  // Toggle Delete Mode
  const toggleDeleteMode = () => {
    setShowDelete(!showDelete);
  };

  // Handle deletion of a Q&A entry
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/q_and_as/${id}`);
      setQAndAs(qAndAs.filter((qanda) => qanda.id !== id));
    } catch (error) {
      console.error('Error deleting Q&A:', error);
      alert('Failed to delete Q&A. Please try again.');
    }
  };

  return (
    <div className="flex flex-col w-10/12 text-white items-center min-h-screen p-8 mt-6">
      {/* Header and FAQ Title */}
      <div className="flex text-left gap-4 w-full">
        <QuestionMarkCircleIcon className="h-32 w-32 text-white mx-2" />
        <h1 className="text-7xl font-bold font-custom pt-10">FAQ's</h1>
      </div>

      <div className="w-11/12 rounded-lg p-8">
        {/* Error Message */}
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        {/* Buttons for Create and Delete */}
        <div className="flex gap-4 mb-6">
          <Link href="questions/create" passHref>
            <p className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              Create Q&A
            </p>
          </Link>
          <button
            onClick={toggleDeleteMode}
            className={`bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors ${showDelete ? 'opacity-70' : ''}`}
          >
            {showDelete ? 'Cancel Delete' : 'Delete Q&A'}
          </button>
        </div>

        {isLoading ? (
          <LoadingScreen /> 
        ): (
        <div className={`bg-[#F5F3EB] text-green-900 rounded-lg p-6 ${prozaLibre.className}`}>
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions:</h2>
            <div className="space-y-4">
              {qAndAs.length === 0 ? (
                <p>No Q&A entries found.</p>
              ) : (
                qAndAs.map((qanda) => (
                  <div key={qanda.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">Q: {qanda.question}</p>
                      <p className="ml-4">A: {qanda.answer}</p>
                    </div>
                    {showDelete && (
                      <button
                        onClick={() => handleDelete(qanda.id)}
                        className="text-red-500 font-bold text-xl hover:text-red-700"
                      >
                        X
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

        </div>
        )}
      </div>
      <Hyperlinks />
    </div>
  );
}