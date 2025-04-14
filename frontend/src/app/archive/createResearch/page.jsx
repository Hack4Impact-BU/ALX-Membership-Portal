'use client';
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { FolderIcon } from '@heroicons/react/outline'; // Assuming outline version based on edit page
import { Proza_Libre } from 'next/font/google';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ReusableHeader from '@/components/ReusableHeader/ReusableHeader'; // Assuming path
import { styled } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkIcon from '@mui/icons-material/Link';

const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function CreateResearch() { // Renamed component for clarity
  const [post, setPost] = useState({
    researchTitle: '',
    researchDesc: '',
    link: '',
    date: '',
    location: '',
  });

  const authToken = "your_auth_token_here"; // Keep or replace with actual auth logic

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value,
    });
  };

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Add function to ensure proper URL formatting (optional, but good practice)
  const formatUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    setError(null);

    // Format the link before sending
    const formattedLink = formatUrl(post.link);

    const researchData = {
      researchTitle: post.researchTitle,
      researchDesc: post.researchDesc,
      link: formattedLink, // Use the formatted link
      date: post.date,
      location: post.location,
    };

    try {
       // Using JSON body instead of FormData, adjust if backend requires FormData
      const response = await fetch(`${apiBaseUrl}/research`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Changed content type
          // Add Authorization header if needed, using a real token mechanism
          // 'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ research: researchData }), // Send as JSON object
      });

      if (!response.ok) {
         const errorData = await response.json().catch(() => ({ message: 'Network response was not ok' }));
         throw new Error(errorData.message || 'Failed to create post');
      }

      const result = await response.json();
      setMessage('Research created successfully!');
      // Optionally clear the form or redirect
      setPost({ researchTitle: '', researchDesc: '', link: '', date: '', location: '' });
    } catch (err) {
      setError(`Error creating post: ${err.message}`);
      console.error('Error:', err);
    }
  };

  // Styled button matching the edit page's CustomButton (example)
  const SubmitButton = styled(Button)({
    backgroundColor: '#44E489',
    color: 'black',
    borderRadius: '20px',
    padding: '12px 24px', // Adjusted padding for a primary action
    marginTop: '20px', // Add some margin top
    '&:hover': {
      backgroundColor: '#3acc7a', // slightly darker shade for hover
    },
  });


  return (
    <div className={`flex ${prozaLibre.className} flex-col items-center bg-[#214933] min-h-screen w-full md:w-10/12 p-8 mt-6 mx-auto`}>
       {/* Success/Error Message Display */}
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

      <div className="flex w-full"> {/* Added items-center */}
        <FolderIcon className="h-24 w-24 md:h-32 md:w-32 stroke-[#F6F2E9]" /> {/* Responsive size */}
        <ReusableHeader header={"Create Research"}/> {/* Updated header text */}
      </div>

      {/* Form wrapped in the styled container */}
      <form onSubmit={handleSubmit} className={`${prozaLibre.className} bg-[#335843] rounded-xl w-full shadow-lg p-8`}>

        {/* Research Title Input */}
        <div className="mb-6">
           <label htmlFor="researchTitle" className="block text-lg text-[#F6F2E9] bg-[#335843] mb-2">Research Title</label>
           <input
            type="text"
            name="researchTitle"
            id="researchTitle"
            value={post.researchTitle}
            onChange={handleChange}
            placeholder="Enter Research Title"
            className="pl-4 py-2 text-[20px] rounded-xl w-full border border-gray-500 focus:border-[#44E489] outline-none" // Adjusted styles
            required
          />
        </div>

        {/* Research Description Textarea */}
        <div className="mb-10">
          <label htmlFor="researchDesc" className="block text-lg text-[#F6F2E9] bg-[#335843] font-semibold mb-2">Research Description</label>
          <textarea
            name="researchDesc"
            id="researchDesc"
            value={post.researchDesc}
            onChange={handleChange}
            placeholder="Describe the research project..."
            className="pl-4 py-2 text-[20px] h-40 rounded-xl w-full border border-gray-500 focus:border-[#44E489] outline-none" // Adjusted styles
            required
          />
        </div>

        {/* Grid for Date, Location, Link */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          {/* Date Input */}
          <div className="flex items-center gap-4">
            <CalendarTodayIcon style={{ fontSize: 32, color: '#F6F2E9' }} />
            <input
              type="date"
              name="date"
              id="date"
              value={post.date}
              onChange={handleChange}
              className="pl-4 py-2 text-lg rounded-xl border bg-white border-gray-500 focus:border-[#44E489] outline-none " // Ensure text color is visible
              required
              style={{ colorScheme: 'dark' }} // Hint for browsers to use dark date picker
            />
          </div>

          {/* Location Input */}
          <div className="flex items-center gap-4">
            <LocationOnIcon style={{ fontSize: 32, color: '#F6F2E9' }} />
            <input
              type="text"
              name="location"
              id="location"
              value={post.location}
              onChange={handleChange}
              placeholder="Enter Location"
              className="pl-4 py-2 text-lg rounded-xl bg-white border border-gray-500 focus:border-[#44E489] outline-none w-full md:w-1/2" // Adjusted width and background
              required
            />
          </div>

          {/* Link Input */}
          <div className="flex items-center gap-4">
            <LinkIcon style={{ fontSize: 32, color: '#F6F2E9' }} />
            <input
              type="text" // Changed to text to allow non-strict URLs initially, formatted on submit
              name="link"
              id="link"
              value={post.link}
              onChange={handleChange}
              placeholder="Enter URL (e.g. example.com)"
              className="pl-4 py-2 text-lg rounded-xl bg-white border border-gray-500 focus:border-[#44E489] outline-none w-full md:w-1/2" // Adjusted width and background
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <SubmitButton type="submit" variant="contained">
             Create Research
          </SubmitButton>
        </div>
      </form>

       {/* Removed old message/error display as it's handled by the fixed position divs */}
    </div>
  );
}