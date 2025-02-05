'use client';
import React, { useState } from 'react';
import axios from 'axios';

export default function JobCreate() {
  const [job, setJob] = useState({
    title: '',
    company: '',
    description: '',
    logo: null,
  });

  const authToken = "hi"

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setJob({
      ...job,
      logo: e.target.files[0],
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('job[title]', job.title);
    formData.append('job[company]', job.company);
    formData.append('job[description]', job.description);
    formData.append('job[responsibilities]', job.responsibilities);
    formData.append('job[requirements]', job.requirements);
    formData.append('job[salary]', job.salary);
    formData.append('job[contact]', job.contact);
    formData.append('job[logo]', job.logo);
  
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`
        },
      });
  
      setMessage('Job created successfully!');
      setError(null);
    } catch (error) {
      setError('Error creating job.');
      setMessage(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Create a Job</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Job Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={job.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="company" className="block text-gray-700 font-bold mb-2">Company Name</label>
          <input
            type="text"
            name="company"
            id="company"
            value={job.company}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Job Description</label>
          <textarea
            name="description"
            id="description"
            value={job.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="responsibilities" className="block text-gray-700 font-bold mb-2">Job Responsibilities</label>
          <textarea
            name="responsibilities"
            id="responsibilities"
            value={job.responsibilities}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="requirements" className="block text-gray-700 font-bold mb-2">Job Requirements</label>
          <textarea
            name="requirements"
            id="requirements"
            value={job.requirements}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="salary" className="block text-gray-700 font-bold mb-2">Salary</label>
          <input
            type="text"
            name="salary"
            id="salary"
            value={job.salary}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="contact" className="block text-gray-700 font-bold mb-2">Contact Information</label>
          <input
            type="text"
            name="contact"
            id="contact"
            value={job.contact}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="logo" className="block text-gray-700 font-bold mb-2">Company Logo</label>
          <input
            type="file"
            name="logo"
            id="logo"
            onChange={handleFileChange}
            className="w-full"
            accept="image/*"
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg">Submit</button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}