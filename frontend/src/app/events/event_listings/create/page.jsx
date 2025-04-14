'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Proza_Libre } from 'next/font/google'; // Keep the font
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

// Re-using the styled button from the original createNew page
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
  '& .MuiButton-label, & p': { // Target text inside the button
    color: 'black', // Set text color to black
    fontWeight: '600', // Example: make text bold
  },
});

const InputField = ({ label, id, ...props }) => (
  <div className="mb-4 w-full">
    <label htmlFor={id} className={`block text-[#214933] ${prozaLibre.className} font-semibold mb-1`}>{label}</label>
    <input
      id={id}
      {...props}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black bg-white"
    />
  </div>
);

const TextAreaField = ({ label, id, ...props }) => (
  <div className="mb-4 w-full">
    <label htmlFor={id} className={`block text-[#214933] ${prozaLibre.className} font-semibold mb-1`}>{label}</label>
    <textarea
      id={id}
      {...props}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black bg-white"
      rows="3"
    />
  </div>
);

const FileInputField = ({ label, id, ...props }) => (
  <div className="mb-4 w-full">
    <label htmlFor={id} className={`block text-[#214933] ${prozaLibre.className} font-semibold mb-1`}>{label}</label>
    <input
      id={id}
      type="file"
      {...props}
      className="w-full text-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#e0f2e8] file:text-[#214933] hover:file:bg-[#c1e0cf]"
    />
  </div>
);

export default function CreateNewEventPage() {
  // State from create/page.jsx
  const [event, setEvent] = useState({
    eventName: '',
    eventType: '',
    startDate: '',
    endDate: '',
    location: '',
    org: '',
    timeStart: '',
    timeEnd: '',
    eventDesc: '',
    instruct: '',
    pic: null, // For contact person image
    phone: '',
    image: null, // For event banner image
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // For banner preview
  const [picPreview, setPicPreview] = useState(null);     // For contact pic preview
  const router = useRouter(); // Get the router instance

  // Get API base URL from environment variables
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const authToken = "your_auth_token_here"; // Replace with actual auth logic if needed

  // Handlers from create/page.jsx
  const handleChange = (e) => {
    setEvent({
      ...event,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file upload for pic (contact person image)
  const handlePicChange = (e) => {
    const file = e.target.files[0];
    setEvent({
      ...event,
      pic: file,
    });
    if (file) {
        setPicPreview(URL.createObjectURL(file));
    } else {
        setPicPreview(null);
    }
  };

  // Handle file upload for event banner image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEvent({
      ...event,
      image: file,
    });
    // Generate preview
    if (file) {
        setImagePreview(URL.createObjectURL(file));
    } else {
        setImagePreview(null);
    }
  };

  // Submit handler from create/page.jsx
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const formData = new FormData();
    formData.append('eventlist[eventName]', event.eventName);
    formData.append('eventlist[eventType]', event.eventType);
    formData.append('eventlist[startDate]', event.startDate);
    formData.append('eventlist[endDate]', event.endDate);
    formData.append('eventlist[location]', event.location);
    formData.append('eventlist[org]', event.org);
    formData.append('eventlist[timeStart]', event.timeStart);
    formData.append('eventlist[timeEnd]', event.timeEnd);
    formData.append('eventlist[eventDesc]', event.eventDesc);
    formData.append('eventlist[instruct]', event.instruct);
    formData.append('eventlist[phone]', event.phone);

    if (event.pic) {
      formData.append('eventlist[pic]', event.pic);
    }
    if (event.image) {
      formData.append('eventlist[image]', event.image);
    }

    // Basic validation (optional, add more as needed)
    if (!event.eventName || !event.eventType || !event.startDate || !event.endDate || !event.timeStart || !event.timeEnd || !event.location || !event.org || !event.phone || !event.eventDesc) {
        setError("Please fill in all required fields.");
        return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/eventlists`, {
        method: 'POST',
        headers: {
          // Add Authorization header if your API requires it
          // 'Authorization': `Bearer ${authToken}`,
          // FormData sets Content-Type automatically
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network response was not ok' }));
        throw new Error(errorData.message || 'Failed to create event');
      }

      const result = await response.json();
      setMessage('Event created successfully!');
      // Optionally reset form or redirect
      setEvent({
        eventName: '', eventType: '', startDate: '', endDate: '', location: '',
        org: '', timeStart: '', timeEnd: '', eventDesc: '', instruct: '',
        pic: null, phone: '', image: null,
      });
      setImagePreview(null);
      setPicPreview(null);

      // Redirect after a short delay to allow the user to see the success message (optional)
      setTimeout(() => {
          router.push('/events/event_listings'); // Redirect to the event listings page
      }, 1500); // Redirect after 1.5 seconds

      // Or redirect immediately:
      // router.push('/events/event_listings');

    } catch (err) {
      setError(`Error creating event: ${err.message}`);
      console.error('Error:', err);
    }
  };

  // Layout structure adapted from original createNew/page.jsx
  return (
    <div className="flex flex-col w-full min-h-screen p-14">
      <h1 className={`text-4xl font-bold text-[#F6F2E9] mb-8 text-center ${prozaLibre.className}`}>Create New Event</h1>

      {message && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 border border-green-300 rounded-lg">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col w-full">
        {/* Top Section: Image and Core Details */}
        <div className="flex flex-col md:flex-row gap-8 w-full mb-8">
          {/* Left Side: Event Banner Image Upload */}
          <div className="flex flex-col justify-start items-center basis-full md:basis-1/2 h-auto min-h-[300px] bg-[#F6F2E9] rounded-xl p-6">
            <h2 className={`text-2xl text-[#214933] font-semibold mb-4 ${prozaLibre.className}`}>Event Banner</h2>
            <FileInputField
              label="Upload Banner Image (Optional)"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
            />
            {imagePreview && (
              <div className="mt-4 w-full max-h-64 overflow-hidden rounded-lg border border-gray-300">
                <img src={imagePreview} alt="Event Banner Preview" className="object-contain w-full h-full" />
              </div>
            )}
            {!imagePreview && (
                 <div className="mt-4 w-full h-40 flex items-center justify-center bg-gray-100 rounded-lg border border-dashed border-gray-300">
                    <span className="text-gray-500">Image Preview</span>
                 </div>
             )}
          </div>

          {/* Right Side: Date, Time, Location, Phone */}
          <div className="flex flex-col justify-start items-start basis-full md:basis-1/2 h-auto bg-[#F6F2E9] rounded-xl p-6">
            <h2 className={`text-2xl text-[#214933] font-semibold mb-4 ${prozaLibre.className}`}>Key Details</h2>
            <InputField
              label="Start Date*"
              type="date"
              id="startDate"
              name="startDate"
              value={event.startDate}
              onChange={handleChange}
              required
            />
            <InputField
              label="End Date*"
              type="date"
              id="endDate"
              name="endDate"
              value={event.endDate}
              onChange={handleChange}
              required
            />
             <InputField
              label="Start Time*"
              type="time"
              id="timeStart"
              name="timeStart"
              value={event.timeStart}
              onChange={handleChange}
              required
            />
            <InputField
              label="End Time*"
              type="time"
              id="timeEnd"
              name="timeEnd"
              value={event.timeEnd}
              onChange={handleChange}
              required
            />
            <InputField
              label="Location*"
              type="text"
              id="location"
              name="location"
              value={event.location}
              onChange={handleChange}
              placeholder="e.g., Online, Main Hall"
              required
            />
             <InputField
              label="Contact Phone*"
              type="tel"
              id="phone"
              name="phone"
              value={event.phone}
              onChange={handleChange}
              placeholder="(123)-456-7890"
              required
            />
          </div>
        </div>

        {/* Bottom Section: Event Info, Description, Instructions */}
        <div className='flex flex-col w-full h-auto bg-[#F6F2E9] rounded-xl p-6'>
            <h2 className={`text-2xl text-[#214933] font-semibold mb-4 ${prozaLibre.className}`}>Event Information</h2>

             <InputField
              label="Event Name*"
              type="text"
              id="eventName"
              name="eventName"
              value={event.eventName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black bg-white text-3xl mb-4" // Larger text for name
            />

            <InputField
              label="Event Type*"
              type="text"
              id="eventType"
              name="eventType"
              value={event.eventType}
              onChange={handleChange}
              placeholder="e.g., Workshop, Conference, Social"
              required
            />

            <InputField
              label="Organizer*"
              type="text"
              id="org"
              name="org"
              value={event.org}
              onChange={handleChange}
              required
            />

            <TextAreaField
                label="Event Description*"
                id="eventDesc"
                name="eventDesc"
                value={event.eventDesc}
                onChange={handleChange}
                required
             />

             <TextAreaField
                label="Instructions / Details (Optional)"
                id="instruct"
                name="instruct"
                value={event.instruct}
                onChange={handleChange}
                placeholder="e.g., Link to join, specific requirements"
             />

             <FileInputField
                label="Contact Person Image (Optional)"
                id="pic"
                name="pic"
                onChange={handlePicChange}
                accept="image/*"
             />
             {picPreview && (
              <div className="mt-2 w-32 h-32 overflow-hidden rounded-full border border-gray-300">
                <img src={picPreview} alt="Contact Pic Preview" className="object-cover w-full h-full" />
              </div>
            )}


            <div className="mt-8 flex justify-center">
                 <CustomButton type="submit" variant="contained">
                    <p>Create Event</p>
                 </CustomButton>
             </div>

        </div>
      </form>
    </div>
  );
}