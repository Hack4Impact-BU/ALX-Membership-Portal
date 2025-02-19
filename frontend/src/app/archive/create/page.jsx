'use client';
import React, { useState } from 'react';

export default function CreatePost() {
  const [post, setPost] = useState({
    researchTitle: '',
    researchDesc: '',
    link: '',
    date: '',
    location: '',
  });

  const authToken = "your_auth_token_here";

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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('research[researchTitle]', post.researchTitle);
    formData.append('research[researchDesc]', post.researchDesc);
    formData.append('research[link]', post.link);
    formData.append('research[date]', post.date);
    formData.append('research[location]', post.location);

    try {
      const response = await fetch(`${apiBaseUrl}/research`, {
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
      setMessage('Post created successfully!');
      setError(null);
    } catch (error) {
      setError('Error creating post.');
      setMessage(null);
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Create a Post</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        {/* Research Title */}
        <div className="mb-4">
          <label htmlFor="researchTitle" className="block text-gray-700 font-bold mb-2">Research Title</label>
          <input
            type="text"
            name="researchTitle"
            id="researchTitle"
            value={post.researchTitle}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Research Description */}
        <div className="mb-4">
          <label htmlFor="researchDesc" className="block text-gray-700 font-bold mb-2">Research Description</label>
          <textarea
            name="researchDesc"
            id="researchDesc"
            value={post.researchDesc}
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
            value={post.link}
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
            value={post.date}
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
            value={post.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg">Create Post</button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}