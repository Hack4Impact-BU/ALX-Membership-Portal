'use client';
import React, { useState, useEffect, useMemo } from 'react';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Inter, Proza_Libre } from 'next/font/google';
import axios from 'axios';
import LoadingScreen from '@/components/LoadingScreen';
import Hyperlinks from '@/components/Hyperlinks';
import JobCreationForm from './create/JobCreationForm';
import SearchIcon from '@mui/icons-material/Search';

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function JobBoard() {  
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false); // Toggle delete mode
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Editing states
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState('');

    // New filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [minSalary, setMinSalary] = useState('');
  

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

  const cities = useMemo(() => {
    const citySet = new Set(jobs.map(job => {
      // Extract city from location if available
      // This assumes a format like "City, State" or just "City"
      if (job.location) {
        return job.location.split(',')[0].trim();
      }
      return '';
    }).filter(city => city !== ''));
    
    return Array.from(citySet).sort();
  }, [jobs]);

  // Extract salary ranges for filter
  const salaryRanges = [
    { label: 'Any', value: '' },
    { label: '$30,000+', value: '30000' },
    { label: '$50,000+', value: '50000' },
    { label: '$70,000+', value: '70000' },
    { label: '$100,000+', value: '100000' },
    { label: '$150,000+', value: '150000' },
    { label: '$200,000+', value: '200000' },
    { label: '$250,000+', value: '250000' },
  ];

  // Improved salary parsing to handle ranges properly
  const parseSalary = (salaryStr) => {
    if (!salaryStr) return 0;
    
    // Extract all numbers from the salary string
    const matches = salaryStr.match(/\d[\d,]*/g);
    if (!matches || matches.length === 0) return 0;
    
    // Convert all matches to numbers by removing commas and parsing
    const numbers = matches.map(num => parseInt(num.replace(/,/g, ''), 10));
    
    // If there are multiple numbers (likely a range), return the highest value
    // This assumes ranges like "$30,000 - $50,000" or "$30,000 to $50,000"
    if (numbers.length > 1) {
      return Math.max(...numbers);
    }
    
    // Otherwise just return the single number found
    return numbers[0];
  };

  // Filter jobs based on all criteria
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Filter by search query (job title)
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by city
      const matchesCity = !selectedCity || 
        (job.location && job.location.toLowerCase().includes(selectedCity.toLowerCase()));
      
      // Filter by minimum salary
      const jobSalary = parseSalary(job.salary);
      const matchesSalary = !minSalary || jobSalary >= parseInt(minSalary, 10);
      
      return matchesSearch && matchesCity && matchesSalary;
    });
  }, [jobs, searchQuery, selectedCity, minSalary]);

  return (
    <div className="flex flex-col bg-[#214933] min-h-screen w-10/12 p-8 mt-12 text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[70px] font-bold mb-2 font-custom">Job Board</h1>
        <h2 className="text-[30px] italic font-custom">* Bolsa de Trabajo</h2>
      </div>

      {/* Filters Section - Removed Saved Button */}
      <div className={`flex justify-center gap-4 mb-8 ${prozaLibre.className}`}>

        <div className={`flex flex-col w-1/4 ${prozaLibre.className}`}>
          <label htmlFor="searchQuery" className="mb-2 text-[#F6F2E9]">Search Jobs</label>
          <div className="relative">
            <input
              id="searchQuery"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search job titles..."
              className="py-3 px-3 pl-10 bg-[#335843] text-[#F6F2E9] rounded-m shadow-lg w-full"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A9A9A9]" />
          </div>
        </div>

        <div className={`flex flex-col w-1/4 ${prozaLibre.className}`}>
          <label htmlFor="citySelect" className="mb-2 text-[#F6F2E9]">City</label>
          <select 
            id="citySelect"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="py-3 px-3 bg-[#335843] text-[#F6F2E9] rounded-m shadow-lg"
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className={`flex flex-col w-1/4 ${prozaLibre.className}`}>
          <label htmlFor="minSalary" className="mb-2 text-[#F6F2E9]">Minimum Salary</label>
          <select
            id="minSalary"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
            className="py-3 px-3 bg-[#335843] text-[#F6F2E9] rounded-m shadow-lg"
          >
            {salaryRanges.map(range => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Job Content Section - Increased height */}
      <div className="job-content-section h-[72vh] flex-grow mb-8">
        {isLoading ? (
          <LoadingScreen />
        ) : filteredJobs.length === 0 && !showCreateForm ? (
          <div className="flex flex-col items-center h-full justify-center">
            <p className="text-white text-2xl mb-4">No jobs found</p>
          </div>
        ) : (
          <div className={`flex justify-center gap-8 ${prozaLibre.className} h-full`}>
            {/* Job List - Fixed overflow and added padding */}
            <div className="w-1/4 overflow-y-auto overflow-x-visible pr-4 pl-2 h-full">
              {/* The list container now has padding to account for card expansion */}
              <div className="pr-3 pl-1">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => {
                      if (!deleteMode) setSelectedJob(job);
                    }}
                    className={`relative bg-[#F6F2E9] text-black p-4 mb-4 rounded-xl shadow-lg flex items-center gap-4 cursor-pointer 
                      ${selectedJob?.id === job.id ? 'ring-4 ring-[#214933] scale-105 transition-transform' : ''}`}
                  >
                    {deleteMode && (
                      <button
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteJob(job.id);
                        }}
                      >
                        ✕
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
            </div>

            {/* Vertical bar */}
            <div className="h-full w-1 bg-white"></div>

            {/* Job Details or Create Form - Added overflow scrolling */}
            {showCreateForm ? (
              <div className="flex-grow max-w-[600px] w-full h-full overflow-y-auto">
                <JobCreationForm
                  onJobCreated={handleJobCreated}
                  onCancel={handleCancelCreate}
                  apiBaseUrl={apiBaseUrl}
                />
              </div>
            ) : selectedJob && (
              <div className="relative flex-grow bg-[#F6F2E9] text-black p-8 rounded-xl shadow-lg max-w-[600px] w-full h-full overflow-y-auto">
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
              </div>
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