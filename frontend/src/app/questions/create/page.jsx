'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { Inter, Proza_Libre } from 'next/font/google';
const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function CreateQA() {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
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
    if (!formData.question || !formData.answer) {
      setErrorMessage('Please fill in both the question and the answer.');
      return;
    }

    // Submit form data to the API using axios
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/q_and_as`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) { // 201 Created
        setSuccessMessage('Q&A created successfully!');
        setErrorMessage('');
        // Reset form
        setFormData({
          question: '',
          answer: '',
        });
      } else {
        setErrorMessage('Failed to create Q&A.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage(error.response?.data?.error || 'Error submitting form. Please try again later.');
    }
  };

  return (
    <div className={`flex flex-col items-center bg-[#214933] min-h-screen w-full p-36 ${prozaLibre.className} text-white`}>
      <h1 className="text-[70px] font-bold mb-6">Create a Q&A</h1>

      {/* Success or Error Message */}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-[#335843] p-8 rounded-xl shadow-lg w-full max-w-xl">
        <div className="mb-4">
          <label htmlFor="question" className="block text-sm mb-2">
            Question:
          </label>
          <textarea
            id="question"
            name="question"
            value={formData.question}
            onChange={handleChange}
            className="w-full p-2 rounded-md text-black"
            placeholder="Enter the question"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="answer" className="block text-sm mb-2">
            Answer:
          </label>
          <textarea
            id="answer"
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            className="w-full p-2 rounded-md text-black"
            placeholder="Enter the answer"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Q&A
        </button>
      </form>
    </div>
  );
}