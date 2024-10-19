'use client'
import React from 'react';
import BookmarksIcon from '@mui/icons-material/Bookmarks';

export default function JobBoard() {
  return (
    <div className="bg-[#324A3A] min-h-screen p-8 text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-2">Job Board</h1>
        <h2 className="text-xl italic">* Bolsa de Trabajo</h2>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        {/* Saved Button */}
        <div className="flex flex-col w-1/5">
          {/* Invisible label to align with the rest */}
          <label className="mb-2 invisible">Placeholder</label>
          <button className="bg-[#335843] text-[#F6F2E9] py-3 px-6 rounded-lg flex items-center gap-2 shadow-lg">
            <BookmarksIcon />
            Saved
          </button>
        </div>

        {/* Business Type Selection */}
        <div className="flex flex-col w-1/5">
          <label htmlFor="businessType" className="mb-2 text-[#F6F2E9]">Business Type</label>
          <select
            id="businessType"
            className="py-3 px-3 bg-[#335843] text-[#A9A9A9] rounded-m shadow-lg"
          >
            <option>Select Type</option>
          </select>
        </div>

        {/* Distance Selection */}
        <div className="flex flex-col w-1/5">
          <label htmlFor="distance" className="mb-2 text-[#F6F2E9]">Distance</label>
          <select
            id="distance"
            className="py-3 px-3 bg-[#335843] text-[#A9A9A9] rounded-m shadow-lg"
          >
            <option>Select Distance</option>
          </select>
        </div>

        {/* Zip Code Input */}
        <div className="flex flex-col w-1/5">
          <label htmlFor="zipCode" className="mb-2 text-[#F6F2E9]">Zip Code</label>
          <input
            type="text"
            id="zipCode"
            placeholder="Zip Code"
            className="py-3 px-3 bg-[#335843] text-[#F6F2E9] rounded-m shadow-lg"
          />
        </div>
      </div>
      {/* Job Listing & Details Section */}
      <div className="flex gap-8">
        {/* Job List */}
        <div className="w-1/3">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="bg-[#f0f4e8] text-black p-4 mb-4 rounded-xl shadow-lg flex items-center gap-4"
            >
              <div className={`h-12 w-12 rounded-full bg-[${index % 2 === 0 ? '#FFA500' : '#FF0000'}]`}></div>
              <div>
                <p className="text-lg font-bold">Librarian</p>
                <p className="text-sm">Boston Public Library</p>
              </div>
            </div>
          ))}
        </div>

        {/* Job Details */}
        <div className="flex-grow bg-[#F6F2E9] text-black p-8 rounded-xl shadow-lg">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-16 w-16 rounded-full bg-[#FFA500]"></div>
            <div>
              <h3 className="text-3xl font-bold">Librarian</h3>
              <p>Boston Public Library</p>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">Job Description:</h4>
            <p className="mb-4">
              We are seeking a passionate and knowledgeable Librarian to join our team at the Boston Public Library. 
              The ideal candidate will have a strong commitment to public service, excellent organizational skills, 
              and a deep understanding of library science and information management. Compensation: $27/hr
            </p>

            <h4 className="text-xl font-semibold mb-2">Responsibilities:</h4>
            <ul className="list-disc ml-8 mb-4">
              <li>Assist patrons in locating and using library resources</li>
              <li>Develop and maintain library collections</li>
              <li>Plan and conduct library programs and events</li>
              <li>Provide reference and research assistance</li>
              <li>Collaborate with other departments and community organizations</li>
            </ul>

            <h4 className="text-xl font-semibold mb-2">Requirements:</h4>
            <ul className="list-disc ml-8 mb-4">
              <li>Master's degree in Library Science from an ALA-accredited institution</li>
              <li>2+ years of experience in a library setting</li>
              <li>Strong knowledge of library systems and databases</li>
              <li>Excellent communication and interpersonal skills</li>
              <li>Fluency in English and Spanish preferred</li>
            </ul>

            <p>Contact: <a href="https://www.bpl.org/jobs-at-the-bpl/" className="text-blue-600 hover:underline">https://www.bpl.org/jobs-at-the-bpl/</a></p>
          </div>
        </div>
      </div>
    </div>
  );

        {/* Job Details */}
        <div className="flex-grow bg-[#F6F2E9] text-black p-8 rounded-xl shadow-lg">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-16 w-16 rounded-full bg-[#FFA500]"></div>
            <div>
              <h3 className="text-3xl font-bold">Librarian</h3>
              <p>Boston Public Library</p>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">Job Description:</h4>
            <p className="mb-4">
              We are seeking a passionate and knowledgeable Librarian to join our team at the Boston Public Library. 
              The ideal candidate will have a strong commitment to public service, excellent organizational skills, 
              and a deep understanding of library science and information management. Compensation: $27/hr
            </p>

            <h4 className="text-xl font-semibold mb-2">Responsibilities:</h4>
            <ul className="list-disc ml-8 mb-4">
              <li>Assist patrons in locating and using library resources</li>
              <li>Develop and maintain library collections</li>
              <li>Plan and conduct library programs and events</li>
              <li>Provide reference and research assistance</li>
              <li>Collaborate with other departments and community organizations</li>
            </ul>

            <h4 className="text-xl font-semibold mb-2">Requirements:</h4>
            <ul className="list-disc ml-8 mb-4">
              <li>Master's degree in Library Science from an ALA-accredited institution</li>
              <li>2+ years of experience in a library setting</li>
              <li>Strong knowledge of library systems and databases</li>
              <li>Excellent communication and interpersonal skills</li>
              <li>Fluency in English and Spanish preferred</li>
            </ul>

            <p>Contact: <a href="https://www.bpl.org/jobs-at-the-bpl/" className="text-blue-600 hover:underline">https://www.bpl.org/jobs-at-the-bpl/</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}