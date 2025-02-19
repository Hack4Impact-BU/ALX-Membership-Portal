'use client';
import React, { useState, useRef, useEffect } from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import CloseIcon from '@mui/icons-material/Close';

const DropdownCardAdmin = ({ item, index, expandedCard, toggleExpandCard, isDeleteMode, handleDeleteClick, fontName }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = expandedCard === index ? `${contentRef.current.scrollHeight}px` : '150px';
    }
  }, [expandedCard, index]);

  return (
    <div
      className={`bg-[#335843] rounded-xl shadow-lg flex flex-col w-full flex-grow p-8 my-2 relative ${fontName}`}
      ref={contentRef}
      style={{
        overflow: 'hidden',
        minHeight: '200px',
        maxHeight: '150px',
      }}
    >
      <h3 className="text-[28px] font-semibold mb-6">{item.researchTitle}</h3>
      
      {/* Display summary if collapsed, or full description if expanded */}
      <p className="mb-10">
        {expandedCard === index ? item.researchDesc : item.summary}
      </p>

      {expandedCard === index && (
        <div className="flex flex-col justify-end flex-grow mt-4">
          <div className="grid grid-cols-2 gap-8">
            <div className="flex items-center gap-4">
              <CalendarTodayIcon style={{ fontSize: 32 }} />
              <p className="text-lg">{item.date}</p>
            </div>
            <div className="flex items-center gap-4">
              <LocationOnIcon style={{ fontSize: 32 }} />
              <p className="text-lg">{item.location}</p>
            </div>
            <div className="flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
</svg>

              <p className="text-lg">{item.link}</p>
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

export default DropdownCardAdmin;