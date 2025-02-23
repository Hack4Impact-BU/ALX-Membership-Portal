'use client';
import React, { useState } from 'react';

export default function CreateTraining() {
  const [training, setTraining] = useState({
    trainingTitle: '',
    trainingDesc: '',
    link: '',
    date: '',
  });

  const authToken = "your_auth_token_here";

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    setTraining({
      ...training,
      [e.target.name]: e.target.value,
    });
  };

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('training[trainingTitle]', training.trainingTitle);
    formData.append('training[trainingDesc]', training.trainingDesc);
    formData.append('training[link]', training.link);
    formData.append('training[date]', training.date);

    try {
      const response = await fetch(`${apiBaseUrl}/training`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setMessage('Training created successfully!');
      setError(null);
    } catch (error) {
      setError('Error creating training.');
      setMessage(null);
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Create a Training</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        {/* Training Title */}
        <div className="mb-4">
          <label htmlFor="trainingTitle" className="block text-gray-700 font-bold mb-2">Training Title</label>
          <input
            type="text"
            name="trainingTitle"
            id="trainingTitle"
            value={training.trainingTitle}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Training Description */}
        <div className="mb-4">
          <label htmlFor="trainingDesc" className="block text-gray-700 font-bold mb-2">Training Description</label>
          <textarea
            name="trainingDesc"
            id="trainingDesc"
            value={training.trainingDesc}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Link */}
        <div className="mb-4">
          <label htmlFor="link" className="block text-gray-700 font-bold mb-2">Link</label>
          <input
            type="url"
            name="link"
            id="link"
            value={training.link}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Date */}
        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700 font-bold mb-2">Date</label>
          <input
            type="date"
            name="date"
            id="date"
            value={training.date}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg">Create Training</button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}