'use client';
import React, { useState } from 'react';
import axios from 'axios';

export default function NewInvolvement() {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    description: '',
    date: '',
    time: '',
    location: '',
    phone: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (
      !formData.title ||
      !formData.summary ||
      !formData.description ||
      !formData.date ||
      !formData.time ||
      !formData.location ||
      !formData.phone
    ) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    // Submit form data to the API using axios
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get_involveds`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 201) { // 201 Created
        setSuccessMessage('Involvement created successfully!');
        setErrorMessage('');
        // Reset form
        setFormData({
          title: '',
          summary: '',
          description: '',
          date: '',
          time: '',
          location: '',
          phone: ''
        });
      } else {
        setErrorMessage('Failed to create involvement.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage(error.response?.data?.error || 'Error submitting form. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col items-center bg-[#214933] min-h-screen w-full p-8 text-white">
      <h1 className="text-[70px] font-bold mb-6">Create New Involvement</h1>

      {/* Success or Error Message */}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-[#335843] p-8 rounded-xl shadow-lg w-full max-w-xl">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm mb-2">
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 rounded-md text-black"
            placeholder="Enter title"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="summary" className="block text-sm mb-2">
            Summary:
          </label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            className="w-full p-2 rounded-md text-black"
            placeholder="Enter summary"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm mb-2">
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 rounded-md text-black"
            placeholder="Enter description"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block text-sm mb-2">
            Date:
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 rounded-md text-black"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="time" className="block text-sm mb-2">
            Time:
          </label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full p-2 rounded-md text-black"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="location" className="block text-sm mb-2">
            Location:
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 rounded-md text-black"
            placeholder="Enter location"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm mb-2">
            Phone Number:
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 rounded-md text-black"
            placeholder="Enter phone number"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Involvement
        </button>
      </form>
    </div>
  );
}