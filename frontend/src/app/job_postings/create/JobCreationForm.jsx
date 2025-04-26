'use client';
import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { Proza_Libre } from 'next/font/google';

const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function JobCreationForm({ onCancel, onJobCreated, apiBaseUrl }) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    responsibilities: '',
    requirements: '',
    salary: '',
    contact: '',
    logo: null,
    location: '',
    job_type: '',
    logo_url: '',
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        logo: file
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = new FormData();
    form.append('job[title]', formData.title);
    form.append('job[company]', formData.company);
    form.append('job[description]', formData.description);
    form.append('job[responsibilities]', formData.responsibilities);
    form.append('job[requirements]', formData.requirements);
    form.append('job[salary]', formData.salary);
    form.append('job[contact]', formData.contact);
    form.append('job[location]', formData.location);
    form.append('job[job_type]', formData.job_type);
    if (formData.logo) {
      form.append('job[logo]', formData.logo);
    }
    
    axios.post(`${apiBaseUrl}/jobs`, form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        // Notify parent component of the new job
        onJobCreated(response.data);
        // Reset form
        setFormData({
          title: '',
          company: '',
          description: '',
          responsibilities: '',
          requirements: '',
          salary: '',
          contact: '',
          location: '',
          job_type: '',
        });
        setPreviewUrl(null);
      })
      .catch(error => {
        console.error("Error creating job:", error);
        setError("Failed to create job. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // Helper function to create display format with bullet points
  const formatWithBullets = (text) => {
    if (!text) return '';
    return text.split('. ')
      .filter(item => item.trim())
      .map(item => `• ${item}${!item.endsWith('.') ? '.' : ''}`)
      .join('\n');
  };

  return (
    <div className={`relative flex-grow bg-[#F6F2E9] text-black p-8 rounded-xl shadow-lg max-w-[600px] w-full ${prozaLibre.className}`}>
      <button 
        onClick={onCancel}
        className="absolute top-4 right-4 text-gray-500 hover:text-black"
      >
        <CloseIcon />
      </button>
      
      <h2 className="text-3xl font-bold mb-6">Create New Job</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="w-1/3 flex flex-col items-center">
            <label className="block text-lg font-semibold mb-2">Logo</label>
            <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 mb-2 flex items-center justify-center">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="text-sm w-full"
            />
          </div>
          
          <div className="w-2/3">
            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">Job Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Software Engineer, Project Manager, etc."
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-lg font-semibold mb-2">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company name"
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-lg font-semibold mb-2">Job Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter job description..."
            className="w-full p-3 border rounded h-32"
            required
          ></textarea>
        </div>
        
        <div>
          <label className="block text-lg font-semibold mb-2">Responsibilities:</label>
          <textarea
            name="responsibilities"
            value={formData.responsibilities}
            onChange={handleChange}
            placeholder="Enter job responsibilities (separate with periods for bullet points)"
            className="w-full p-3 border rounded h-24"
            required
          ></textarea>
        </div>
        
        <div>
          <label className="block text-lg font-semibold mb-2">Requirements:</label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="Enter job requirements (separate with periods for bullet points)"
            className="w-full p-3 border rounded h-24"
            required
          ></textarea>
        </div>
        
        <div>
          <label className="block text-lg font-semibold mb-2">Salary:</label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="Enter compensation details"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-lg font-semibold mb-2">Contact:</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Email or phone number"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-lg font-semibold mb-2">Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. New York, NY or Remote"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-lg font-semibold mb-2">Job Type:</label>
          <select
            name="job_type"
            value={formData.job_type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Job Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Temporary">Temporary</option>
          </select>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-[#214933] text-white py-3 px-8 rounded-lg hover:bg-[#16332a] transition-colors ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Creating...' : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  );
}