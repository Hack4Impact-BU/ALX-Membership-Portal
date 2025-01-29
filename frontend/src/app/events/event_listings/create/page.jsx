'use client';
import React, { useState } from 'react';
import axios from 'axios';

export default function CreateEvent() {
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
    pic: null,
    phone: '',
  });

  const authToken = "your_auth_token_here";

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    setEvent({
      ...event,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setEvent({
      ...event,
      pic: e.target.files[0],
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('event[eventName]', event.eventName);
    formData.append('event[eventType]', event.eventType);
    formData.append('event[startDate]', event.startDate);
    formData.append('event[endDate]', event.endDate);
    formData.append('event[location]', event.location);
    formData.append('event[org]', event.org);
    formData.append('event[timeStart]', event.timeStart);
    formData.append('event[timeEnd]', event.timeEnd);
    formData.append('event[eventDesc]', event.eventDesc);
    formData.append('event[instruct]', event.instruct);
    formData.append('event[pic]', event.pic);
    formData.append('event[phone]', event.phone);

    try {
      const response = await axios.post(`http://localhost:3001/eventlists`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      setMessage('Event created successfully!');
      setError(null);
    } catch (error) {
      setError('Error creating event.');
      setMessage(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Create an Event</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        {/* Event Name */}
        <div className="mb-4">
          <label htmlFor="eventName" className="block text-gray-700 font-bold mb-2">Event Name</label>
          <input
            type="text"
            name="eventName"
            id="eventName"
            value={event.eventName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Event Type */}
        <div className="mb-4">
          <label htmlFor="eventType" className="block text-gray-700 font-bold mb-2">Event Type</label>
          <input
            type="text"
            name="eventType"
            id="eventType"
            value={event.eventType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Start Date */}
        <div className="mb-4">
          <label htmlFor="startDate" className="block text-gray-700 font-bold mb-2">Start Date</label>
          <input
            type="date"
            name="startDate"
            id="startDate"
            value={event.startDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* End Date */}
        <div className="mb-4">
          <label htmlFor="endDate" className="block text-gray-700 font-bold mb-2">End Date</label>
          <input
            type="date"
            name="endDate"
            id="endDate"
            value={event.endDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <label htmlFor="location" className="block text-gray-700 font-bold mb-2">Location</label>
          <input
            type="text"
            name="location"
            id="location"
            value={event.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Organizer */}
        <div className="mb-4">
          <label htmlFor="org" className="block text-gray-700 font-bold mb-2">Organizer</label>
          <input
            type="text"
            name="org"
            id="org"
            value={event.org}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Event Description */}
        <div className="mb-4">
          <label htmlFor="eventDesc" className="block text-gray-700 font-bold mb-2">Event Description</label>
          <textarea
            name="eventDesc"
            id="eventDesc"
            value={event.eventDesc}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Instructions */}
        <div className="mb-4">
          <label htmlFor="instruct" className="block text-gray-700 font-bold mb-2">Instructions</label>
          <textarea
            name="instruct"
            id="instruct"
            value={event.instruct}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={event.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Event Image */}
        <div className="mb-4">
          <label htmlFor="pic" className="block text-gray-700 font-bold mb-2">Event Image</label>
          <input
            type="file"
            name="pic"
            id="pic"
            onChange={handleFileChange}
            className="w-full"
            accept="image/*"
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg">Create Event</button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
