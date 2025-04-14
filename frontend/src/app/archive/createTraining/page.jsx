'use client';
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { FolderIcon } from '@heroicons/react/outline';
import { Proza_Libre } from 'next/font/google';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ReusableHeader from '@/components/ReusableHeader/ReusableHeader';
import { styled } from '@mui/material/styles';
import LinkIcon from '@mui/icons-material/Link';

const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function CreateTraining() {
  const [training, setTraining] = useState({
    trainingTitle: '',
    trainingDesc: '',
    link: '',
    date: '',
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setTraining({
      ...training,
      [e.target.name]: e.target.value,
    });
  };

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const formatUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const formattedLink = formatUrl(training.link);

    const formData = new FormData();
    formData.append('training[trainingTitle]', training.trainingTitle);
    formData.append('training[trainingDesc]', training.trainingDesc);
    formData.append('training[link]', formattedLink);
    formData.append('training[date]', training.date);

    try {
      const response = await fetch(`${apiBaseUrl}/training`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network response was not ok' }));
        throw new Error(errorData.message || 'Failed to create training');
      }

      const result = await response.json();
      setMessage('Training created successfully!');
      setTraining({ trainingTitle: '', trainingDesc: '', link: '', date: '' });
    } catch (err) {
      setError(`Error creating training: ${err.message}`);
      console.error('Error:', err);
    }
  };

  const SubmitButton = styled(Button)({
    backgroundColor: '#44E489',
    color: 'black',
    borderRadius: '20px',
    padding: '12px 24px',
    marginTop: '20px',
    '&:hover': {
      backgroundColor: '#3acc7a',
    },
  });

  return (
    <div className={`flex ${prozaLibre.className} flex-col items-center bg-[#214933] min-h-screen w-full md:w-10/12 p-8 mt-6 mx-auto`}>
      {message && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-4 rounded-full shadow-lg z-50">
          {message}
        </div>
      )}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white p-4 rounded-full shadow-lg z-50">
          {error}
        </div>
      )}

      <div className="flex w-full items-center">
        <FolderIcon className="h-24 w-24 md:h-32 md:w-32 stroke-[#F6F2E9]" />
        <ReusableHeader header={"Create Training"}/>
      </div>

      <form onSubmit={handleSubmit} className={`${prozaLibre.className} bg-[#335843] rounded-xl w-full shadow-lg p-8`}>
        <div className="mb-6">
          <label htmlFor="trainingTitle" className="block text-lg text-[#F6F2E9] bg-[#335843] mb-2">Training Title</label>
          <input
            type="text"
            name="trainingTitle"
            id="trainingTitle"
            value={training.trainingTitle}
            onChange={handleChange}
            placeholder="Enter Training Title"
            className="pl-4 py-2 text-[20px] rounded-xl w-full border border-gray-500 focus:border-[#44E489] outline-none bg-white"
            required
          />
        </div>

        <div className="mb-10">
          <label htmlFor="trainingDesc" className="block text-lg text-[#F6F2E9] bg-[#335843] font-semibold mb-2">Training Description</label>
          <textarea
            name="trainingDesc"
            id="trainingDesc"
            value={training.trainingDesc}
            onChange={handleChange}
            placeholder="Describe the training..."
            className="pl-4 py-2 text-[20px] h-40 rounded-xl w-full border border-gray-500 focus:border-[#44E489] outline-none bg-white"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="flex items-center gap-4">
            <CalendarTodayIcon style={{ fontSize: 32, color: '#F6F2E9' }} />
            <input
              type="date"
              name="date"
              id="date"
              value={training.date}
              onChange={handleChange}
              className="pl-4 py-2 text-lg rounded-xl border bg-white border-gray-500 focus:border-[#44E489] outline-none w-full"
              required
              style={{ colorScheme: 'dark' }}
            />
          </div>

          <div className="flex items-center gap-4">
            <LinkIcon style={{ fontSize: 32, color: '#F6F2E9' }} />
            <input
              type="text"
              name="link"
              id="link"
              value={training.link}
              onChange={handleChange}
              placeholder="Enter URL (e.g. example.com)"
              className="pl-4 py-2 text-lg rounded-xl bg-white border border-gray-500 focus:border-[#44E489] outline-none w-full"
              required
            />
          </div>
        </div>

        <div className="flex justify-center">
          <SubmitButton type="submit" variant="contained">
            Create Training
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}