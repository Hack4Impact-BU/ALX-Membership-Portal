'use client';
import React, { useState, useEffect } from 'react';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Inter, Proza_Libre } from 'next/font/google';
import axios from 'axios';
import LoadingScreen from '@/components/LoadingScreen';
import Hyperlinks from '@/components/Hyperlinks';
import JobCreationForm from './create/JobCreationForm';

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false); // Toggle delete mode
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Editing states
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    setIsLoading(true);
    const startTime = Date.now(); // Record start time
    axios.get(`${apiBaseUrl}/jobs`)
      .then((response) => {
        const data = response.data;
        const elapsed = Date.now() - startTime;
        const minDelay = 300; // Minimum loading time in milliseconds
        const remainingDelay = minDelay - elapsed;
        if (remainingDelay > 0) {
          setTimeout(() => {
            setJobs(data);
            setSelectedJob(data[0]);
            setIsLoading(false);
          }, remainingDelay);
        } else {
          setJobs(data);
          setSelectedJob(data[0]);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        setIsLoading(false);
      });
  };

  // Delete a job by its id
  const deleteJob = (jobId) => {
    axios.delete(`${apiBaseUrl}/jobs/${jobId}`)
      .then(() => {
        setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
        if (selectedJob && selectedJob.id === jobId) {
          setSelectedJob(jobs.length > 1 ? jobs.find(job => job.id !== jobId) : null);
        }
      })
      .catch((error) => {
        console.error("Error deleting job:", error);
      });
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleCreateJob = () => {
    setShowCreateForm(true);
    setSelectedJob(null);
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
    setSelectedJob(jobs[0] || null);
  };

  const handleJobCreated = (newJob) => {
    // Add new job to list and select it
    setJobs(prev => [newJob, ...prev]);
    setSelectedJob(newJob);
    setShowCreateForm(false);
  };

  // Handle editing functions
  const handleEdit = (field) => {
    setEditingField(field);
    setEditingValue(selectedJob[field]);
  };

  const handleEditChange = (e) => {
    setEditingValue(e.target.value);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`${apiBaseUrl}/jobs/${selectedJob.id}`, {
        job: { [editingField]: editingValue }
      });
      
      // Update local state
      const updatedJob = { ...selectedJob, [editingField]: editingValue };
      setSelectedJob(updatedJob);
      setJobs(prevJobs => 
        prevJobs.map(job => job.id === selectedJob.id ? updatedJob : job)
      );
      
      // Reset editing state
      setEditingField(null);
    } catch (error) {
      console.error('Error saving edit:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
  };

  return (
    <div className="flex flex-col bg-[#214933] min-h-screen w-10/12 p-8 mt-12 text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[70px] font-bold mb-2 font-custom">Job Board</h1>
        <h2 className="text-[30px] italic font-custom">* Bolsa de Trabajo</h2>
      </div>

      {/* Filters Section */}
      <div className={`flex justify-center gap-4 mb-8 ${prozaLibre.className}`}>
        {/* Saved Button */}
        <div className="flex flex-col w-1/5">
          <label className="mb-2 invisible">Placeholder</label>
          <button className="bg-[#F6F2E9] text-[#214933] py-3 px-6 rounded-lg flex items-center gap-2 shadow-lg">
            <BookmarksIcon />
            Saved
          </button>
        </div>

        {/* Business Type Selection */}
        <div className={`flex flex-col w-1/5 ${prozaLibre.className}`}>
          <label htmlFor="businessType" className="mb-2 text-[#F6F2E9]">Business Type</label>
          <select id="businessType" className="py-3 px-3 bg-[#335843] text-[#A9A9A9] rounded-m shadow-lg">
            <option>Select Type</option>
            <option value="tech">Tech</option>
            <option value="finance">Finance</option>
            <option value="healthcare">Healthcare</option>
          </select>
        </div>

        {/* Distance Selection */}
        <div className={`flex flex-col w-1/5 ${prozaLibre.className}`}>
          <label htmlFor="distance" className="mb-2 text-[#F6F2E9]">Distance</label>
          <select id="distance" className="py-3 px-3 bg-[#335843] text-[#A9A9A9] rounded-m shadow-lg">
            <option>Select Distance</option>
            <option value="5">5 miles</option>
            <option value="10">10 miles</option>
            <option value="20">20 miles</option>
          </select>
        </div>

        {/* Zip Code Input */}
        <div className={`flex flex-col w-1/5 ${prozaLibre.className}`}>
          <label htmlFor="zipCode" className="mb-2 text-[#F6F2E9]">Zip Code</label>
          <input
            type="text"
            id="zipCode"
            placeholder="Zip Code"
            className="py-3 px-3 bg-[#335843] text-[#F6F2E9] rounded-m shadow-lg"
          />
        </div>
      </div>

      {/* Job Content Section */}
      <div className="job-content-section">
        {isLoading ? (
          <LoadingScreen />
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center">
            <p className="text-white text-2xl mb-4">No jobs found</p>
          </div>
        ) : (
          <div className={`flex justify-center gap-8 ${prozaLibre.className}`}>
            {/* Job List */}
            <div className="w-1/4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => {
                    setSelectedJob(job);
                    setShowCreateForm(false);
                    setEditingField(null); // Clear any editing when switching jobs
                  }}
                  className={`relative bg-[#F6F2E9] text-black p-4 mb-4 rounded-xl shadow-lg flex items-center gap-4 cursor-pointer 
                    ${selectedJob?.id === job.id && !showCreateForm ? 'ring-4 ring-[#214933] scale-110 transition-transform' : ''}`}
                >
                  {deleteMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteJob(job.id);
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      x
                    </button>
                  )}
                  {job.logo_url ? (
                    <img src={job.logo_url} alt={`${job.title} logo`} className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <div className="h-12 w-12 rounded-full" style={{ backgroundColor: '#FFA500' }}></div>
                  )}
                  <div>
                    <p className="text-lg font-bold">{job.title}</p>
                    <p className="text-sm">{job.company}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Vertical bar */}
            <div className="h-auto w-1 bg-white"></div>

            {/* Job Details or Create Form */}
            {showCreateForm ? (
              <JobCreationForm 
                onCancel={handleCancelCreate}
                onJobCreated={handleJobCreated}
                apiBaseUrl={apiBaseUrl}
              />
            ) : (
              selectedJob && (
                <div className="relative flex-grow bg-[#F6F2E9] text-black p-8 rounded-xl shadow-lg max-w-[600px] w-full">
                  <div className="flex items-center gap-4 mb-8">
                    {selectedJob?.logo_url ? (
                      <img src={selectedJob.logo_url} alt={`${selectedJob.title} logo`} className="h-16 w-16 rounded-full object-cover" />
                    ) : (
                      <div className="h-16 w-16 rounded-full" style={{ backgroundColor: '#FFA500' }}></div>
                    )}
                    <div className="flex-grow">
                      {editingField === 'title' ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingValue}
                            onChange={handleEditChange}
                            className="bg-white border border-gray-300 rounded p-2 text-3xl font-bold w-full"
                          />
                          <div className="flex gap-1">
                            <button onClick={handleSaveEdit} className="p-1 rounded-full bg-green-500 text-white">
                              <CheckIcon fontSize="small" />
                            </button>
                            <button onClick={handleCancelEdit} className="p-1 rounded-full bg-gray-300 text-gray-700">
                              <CloseIcon fontSize="small" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h3 className="text-3xl font-bold">{selectedJob?.title}</h3>
                          <button onClick={() => handleEdit('title')} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300">
                            <EditIcon fontSize="small" className="text-gray-700" />
                          </button>
                        </div>
                      )}

                      {editingField === 'company' ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingValue}
                            onChange={handleEditChange}
                            className="bg-white border border-gray-300 rounded p-1 w-full"
                          />
                          <div className="flex gap-1">
                            <button onClick={handleSaveEdit} className="p-1 rounded-full bg-green-500 text-white">
                              <CheckIcon fontSize="small" />
                            </button>
                            <button onClick={handleCancelEdit} className="p-1 rounded-full bg-gray-300 text-gray-700">
                              <CloseIcon fontSize="small" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <p>{selectedJob?.company}</p>
                          <button onClick={() => handleEdit('company')} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300">
                            <EditIcon fontSize="small" className="text-gray-700" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Job Description:</h4>
                    {editingField === 'description' ? (
                      <div className="mb-8">
                        <textarea
                          value={editingValue}
                          onChange={handleEditChange}
                          className="bg-white border border-gray-300 rounded p-2 w-full min-h-[100px]"
                        />
                        <div className="flex justify-end gap-1 mt-2">
                          <button onClick={handleSaveEdit} className="p-1 px-3 rounded bg-green-500 text-white">
                            Save
                          </button>
                          <button onClick={handleCancelEdit} className="p-1 px-3 rounded bg-gray-300 text-gray-700">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 mb-8">
                        <p className="flex-grow">{selectedJob?.description}</p>
                        <button onClick={() => handleEdit('description')} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 flex-shrink-0">
                          <EditIcon fontSize="small" className="text-gray-700" />
                        </button>
                      </div>
                    )}

                    <h4 className="text-xl font-semibold mb-4">Responsibilities:</h4>
                    {editingField === 'responsibilities' ? (
                      <div className="mb-8">
                        <textarea
                          value={editingValue}
                          onChange={handleEditChange}
                          className="bg-white border border-gray-300 rounded p-2 w-full min-h-[100px]"
                          placeholder="Enter responsibilities separated by periods"
                        />
                        <div className="flex justify-end gap-1 mt-2">
                          <button onClick={handleSaveEdit} className="p-1 px-3 rounded bg-green-500 text-white">
                            Save
                          </button>
                          <button onClick={handleCancelEdit} className="p-1 px-3 rounded bg-gray-300 text-gray-700">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-8">
                        <div className="flex items-start gap-2">
                          <ul className="list-disc ml-8 flex-grow">
                            {selectedJob?.responsibilities.split('. ').filter(item => item.trim()).map((responsibility, index) => (
                              <li key={index}>{responsibility}</li>
                            ))}
                          </ul>
                          <button onClick={() => handleEdit('responsibilities')} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 flex-shrink-0">
                            <EditIcon fontSize="small" className="text-gray-700" />
                          </button>
                        </div>
                      </div>
                    )}

                    <h4 className="text-xl font-semibold mb-4">Requirements:</h4>
                    {editingField === 'requirements' ? (
                      <div className="mb-8">
                        <textarea
                          value={editingValue}
                          onChange={handleEditChange}
                          className="bg-white border border-gray-300 rounded p-2 w-full min-h-[100px]"
                          placeholder="Enter requirements separated by periods"
                        />
                        <div className="flex justify-end gap-1 mt-2">
                          <button onClick={handleSaveEdit} className="p-1 px-3 rounded bg-green-500 text-white">
                            Save
                          </button>
                          <button onClick={handleCancelEdit} className="p-1 px-3 rounded bg-gray-300 text-gray-700">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-8">
                        <div className="flex items-start gap-2">
                          <ul className="list-disc ml-8 flex-grow">
                            {selectedJob?.requirements.split('. ').filter(item => item.trim()).map((requirement, index) => (
                              <li key={index}>{requirement}</li>
                            ))}
                          </ul>
                          <button onClick={() => handleEdit('requirements')} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 flex-shrink-0">
                            <EditIcon fontSize="small" className="text-gray-700" />
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex mb-8">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <span>Contact: </span>
                          {editingField === 'contact' ? (
                            <div className="flex items-center gap-2 flex-grow">
                              <input
                                type="text"
                                value={editingValue}
                                onChange={handleEditChange}
                                className="bg-white border border-gray-300 rounded p-1 flex-grow"
                              />
                              <button onClick={handleSaveEdit} className="p-1 rounded-full bg-green-500 text-white">
                                <CheckIcon fontSize="small" />
                              </button>
                              <button onClick={handleCancelEdit} className="p-1 rounded-full bg-gray-300 text-gray-700">
                                <CloseIcon fontSize="small" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <a href={`mailto:${selectedJob?.contact}`} className="text-blue-600 hover:underline flex-grow">
                                {selectedJob?.contact}
                              </a>
                              <button onClick={() => handleEdit('contact')} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300">
                                <EditIcon fontSize="small" className="text-gray-700" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex mb-8">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <span>Compensation: </span>
                          {editingField === 'salary' ? (
                            <div className="flex items-center gap-2 flex-grow">
                              <input
                                type="text"
                                value={editingValue}
                                onChange={handleEditChange}
                                className="bg-white border border-gray-300 rounded p-1 flex-grow"
                              />
                              <button onClick={handleSaveEdit} className="p-1 rounded-full bg-green-500 text-white">
                                <CheckIcon fontSize="small" />
                              </button>
                              <button onClick={handleCancelEdit} className="p-1 rounded-full bg-gray-300 text-gray-700">
                                <CloseIcon fontSize="small" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <span className="flex-grow">{selectedJob?.salary}</span>
                              <button onClick={() => handleEdit('salary')} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300">
                                <EditIcon fontSize="small" className="text-gray-700" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bookmarks Icon */}
                  <div
                    className={`absolute bottom-4 right-4 p-2 rounded-full border-2 cursor-pointer transition-all
                    ${isBookmarked ? 'bg-green-700 text-white' : 'bg-transparent border-green-700 text-green-700'}`}
                    onClick={toggleBookmark}
                  >
                    <BookmarksIcon />
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Bottom Buttons */}
      <div className="flex justify-center mt-8 gap-4">
        <button
          onClick={handleCreateJob}
          className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 cursor-pointer"
        >
          Create New Job
        </button>
        <button 
          onClick={() => setDeleteMode(!deleteMode)}
          className={`py-3 px-6 rounded-lg flex items-center gap-2 shadow-lg ${
            deleteMode ? 'bg-gray-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {deleteMode ? "Cancel Delete" : "Delete Jobs"}
        </button>
      </div>
      <Hyperlinks />
    </div>
  );
}