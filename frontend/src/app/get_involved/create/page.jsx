'use client';
import React, { useState, useRef } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

export default function InvolvementCreationForm({ onCancel, onInvolvementCreated, apiBaseUrl }) {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    description: '',
    date: '',
    time: '',
    location: '',
    phone: ''
  });
  
  // Phone input parts
  const [phoneInputs, setPhoneInputs] = useState({
    areaCode: '',
    prefix: '',
    lineNumber: ''
  });
  
  // References for phone input fields
  const prefixRef = useRef(null);
  const lineNumberRef = useRef(null);
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle phone input changes with auto-focus advancing
  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    
    // Only allow numbers
    const numbersOnly = value.replace(/[^\d]/g, '');
    
    // Update the specific part of the phone number
    setPhoneInputs(prev => ({
      ...prev,
      [name]: numbersOnly
    }));
    
    // Auto-advance to next field when current field is filled
    if (name === 'areaCode' && numbersOnly.length === 3) {
      prefixRef.current.focus();
    } else if (name === 'prefix' && numbersOnly.length === 3) {
      lineNumberRef.current.focus();
    }
    
    // Combine all parts to create the formatted phone number
    const newAreaCode = name === 'areaCode' ? numbersOnly : phoneInputs.areaCode;
    const newPrefix = name === 'prefix' ? numbersOnly : phoneInputs.prefix;
    const newLineNumber = name === 'lineNumber' ? numbersOnly : phoneInputs.lineNumber;
    
    // Format as (123) 456-7890
    const formattedPhone = `(${newAreaCode}) ${newPrefix}-${newLineNumber}`;
    
    // Store the formatted phone in the form data
    setFormData(prev => ({
      ...prev,
      phone: formattedPhone
    }));
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    if (newDate) {
      const formattedDate = newDate.format('MMMM D, YYYY');
      setFormData(prev => ({
        ...prev,
        date: formattedDate
      }));
    }
  };

  const handleTimeChange = (newTime) => {
    setSelectedTime(newTime);
    if (newTime) {
      const formattedTime = newTime.format('h:mm A');
      setFormData(prev => ({
        ...prev,
        time: formattedTime
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate phone number is complete
    if (phoneInputs.areaCode.length !== 3 || phoneInputs.prefix.length !== 3 || phoneInputs.lineNumber.length !== 4) {
      setError("Please enter a complete phone number");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    axios.post(`${apiBaseUrl}/get_involveds`, { get_involved: formData })
      .then(response => {
        // Notify parent component of the new involvement opportunity
        onInvolvementCreated(response.data);
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
        setPhoneInputs({
          areaCode: '',
          prefix: '',
          lineNumber: ''
        });
        setSelectedDate(null);
        setSelectedTime(null);
      })
      .catch(error => {
        console.error("Error creating involvement opportunity:", error);
        setError("Failed to create opportunity. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="bg-[#335843] text-white p-8 rounded-xl shadow-lg flex flex-col flex-grow relative" style={{ minHeight: '200px' }}>
      <button 
        onClick={onCancel}
        className="absolute top-4 right-4 text-gray-300 hover:text-white"
      >
        <CloseIcon />
      </button>
      
      <h3 className="text-[28px] font-semibold mb-6">Create New Involvement Opportunity</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-800 text-white rounded-lg">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter opportunity title"
            className="w-full p-2 border rounded bg-[#214933] text-white"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Summary:</label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            placeholder="Brief summary of the opportunity"
            className="w-full p-3 border rounded bg-[#214933] text-white h-20"
            required
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Full description of the opportunity"
            className="w-full p-3 border rounded bg-[#214933] text-white h-32"
            required
          ></textarea>
        </div>
        
        <div className="grid grid-cols-2 gap-8 mb-4">
          <div>
            <label className="block text-lg font-semibold mb-2">Date:</label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker 
                  label="Select date" 
                  value={selectedDate}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      sx: {
                        '& .MuiInputBase-root': {
                          backgroundColor: '#214933',
                          color: 'white'
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.7)'
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.3)'
                        },
                        '& .MuiSvgIcon-root': {
                          color: 'white'
                        }
                      }
                    },
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
            <input
              type="hidden"
              name="date"
              value={formData.date}
              required
            />
          </div>
          
          <div>
            <label className="block text-lg font-semibold mb-2">Time:</label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['TimePicker']}>
                <TimePicker 
                  label="Select time" 
                  value={selectedTime}
                  onChange={handleTimeChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      sx: {
                        '& .MuiInputBase-root': {
                          backgroundColor: '#214933',
                          color: 'white'
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.7)'
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.3)'
                        },
                        '& .MuiSvgIcon-root': {
                          color: 'white'
                        }
                      }
                    },
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
            <input
              type="hidden"
              name="time"
              value={formData.time}
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
              placeholder="Address or venue name"
              className="w-full p-2 border rounded bg-[#214933] text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-lg font-semibold mb-2">Contact Phone:</label>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#214933] rounded border p-2">
                <span className="text-white mr-1">(</span>
                <input
                  type="text"
                  name="areaCode"
                  value={phoneInputs.areaCode}
                  onChange={handlePhoneChange}
                  placeholder="123"
                  maxLength={3}
                  className="w-10 bg-transparent text-white focus:outline-none"
                  required
                />
                <span className="text-white">)</span>
              </div>
              
              <input
                type="text"
                name="prefix"
                value={phoneInputs.prefix}
                onChange={handlePhoneChange}
                placeholder="456"
                maxLength={3}
                className="w-12 p-2 border rounded bg-[#214933] text-white focus:outline-none"
                required
                ref={prefixRef}
              />
              
              <span className="text-white">-</span>
              
              <input
                type="text"
                name="lineNumber"
                value={phoneInputs.lineNumber}
                onChange={handlePhoneChange}
                placeholder="7890"
                maxLength={4}
                className="w-16 p-2 border rounded bg-[#214933] text-white focus:outline-none"
                required
                ref={lineNumberRef}
              />
            </div>
            <input
              type="hidden"
              name="phone"
              value={formData.phone}
              required
            />
          </div>
        </div>
        
        <div className="mt-auto">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-500 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Creating...' : 'Create Opportunity'}
          </button>
        </div>
      </form>
    </div>
  );
}