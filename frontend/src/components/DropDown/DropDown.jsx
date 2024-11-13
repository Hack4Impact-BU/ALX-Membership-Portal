'use client'

import { useState } from "react"


export default function DropDown({id, font, dropTitle, dropDown=[], selectedValue, setSelectedValue}) {

  const [isOpen, setIsOpen] = useState(false)

  const toggleDown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item) => {
    setSelectedValue(item);
    setIsOpen(false);
  }

  return (
    <div className={`relative inline-block text-left ${font.className}`}>
      <div className="w-72">
        <button type="button" 
        class="inline-flex w-full h-14 items-center justify-between gap-x-1.5 rounded-md bg-[#335843] px-3 py-2 text-sm text-white shadow-md hover:brightness-95"
        aria-expanded={isOpen} 
        aria-haspopup="true"
        onClick={toggleDown} 
        >
          {selectedValue || dropTitle}
          <svg className="-mr-1 h-5 w-5 text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
          </svg>
        </button>
  </div>

  {/* <!--
    Dropdown menu, show/hide based on menu state.

    Entering: "transition ease-out duration-100"
      From: "transform opacity-0 scale-95"
      To: "transform opacity-100 scale-100"
    Leaving: "transition ease-in duration-75"
      From: "transform opacity-100 scale-100"
      To: "transform opacity-0 scale-95"
  --> */}
  <div className={`${
          isOpen ? "opacity-100 scale-100" : "hidden opacity-0 scale-95"
        } absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition transform duration-200 ease-out`}>
    <div className="py-1" role="none">
      {/* <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" --> */}
      {/* <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1">Museums</a>
      <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1">Cafes</a>
      <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1">Gym</a>
      <form method="POST" action="#" role="none">
        <button type="submit" class="block w-full px-4 py-2 text-left text-sm text-gray-700" role="menuitem" tabindex="-1">Sign out</button>
      </form> */}
      {dropDown.map((item, index) => (
        <a key={index} className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" onClick={() => handleItemClick(item)}>
          {item}
        </a>
      ))}
    </div>
  </div>
</div>

  )
}