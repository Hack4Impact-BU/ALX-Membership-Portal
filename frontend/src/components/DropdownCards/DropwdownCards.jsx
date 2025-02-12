'use client';
import React, { useState, useRef, useEffect } from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import CloseIcon from '@mui/icons-material/Close';

const DropdownCard = ({ item, index, expandedCard, toggleExpandCard, isDeleteMode, handleDeleteClick, fontName }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = expandedCard === index ? `${contentRef.current.scrollHeight}px` : '150px';
    }
  }, [expandedCard, index]);

  return (
    <div
      className={`bg-[#335843] rounded-xl shadow-lg flex flex-col w-full flex-grow p-8 relative ${fontName}`}
      ref={contentRef}
      style={{
        overflow: 'hidden',
        minHeight: '200px',
        maxHeight: '150px',
      }}
    >
      <h3 className="text-[28px] font-semibold mb-6">{item.title}</h3>
      
      {/* Display summary if collapsed, or full description if expanded */}
      <p className="mb-10">
        {expandedCard === index ? item.description : item.summary}
      </p>

      {expandedCard === index && (
        <div className="flex flex-col justify-end flex-grow mt-4">
          <div className="grid grid-cols-2 gap-8">
            <div className="flex items-center gap-4">
              <CalendarTodayIcon style={{ fontSize: 32 }} />
              <p className="text-lg">{item.date}</p>
            </div>
            <div className="flex items-center gap-4">
              <AccessTimeIcon style={{ fontSize: 32 }} />
              <p className="text-lg">{item.time}</p>
            </div>
            <div className="flex items-center gap-4">
              <LocationOnIcon style={{ fontSize: 32 }} />
              <p className="text-lg">{item.location}</p>
            </div>
            <div className="flex items-center gap-4">
              <PhoneIcon style={{ fontSize: 32 }} />
              <p className="text-lg">{item.phone}</p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Icon */}
      {isDeleteMode && (
        <button
          className="absolute top-4 right-4 bg-white rounded-full p-1 text-red-600" // White circle around the delete icon
          onClick={() => handleDeleteClick(item.id)}
        >
          <CloseIcon />
        </button>
      )}

      {/* Expand/Collapse Button */}
      <button
        onClick={() => toggleExpandCard(index)}
        className="absolute bottom-8 right-8 text-[#A9A9A9] bg-transparent hover:underline text-sm"
      >
        {expandedCard === index ? 'See Less <<' : 'See More >>'}
      </button>
    </div>
  );
};

export default DropdownCard;