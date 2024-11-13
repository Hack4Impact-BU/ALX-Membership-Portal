
'use client'

import { useState } from 'react';
import { Inter, Proza_Libre } from 'next/font/google'; // Import the Proza Libre font
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function EventCard({EventDescription, Location, WebsiteLink, pic, Date, index, description, saved, Time, distance, toggleCardSaved, EventName, EventOrganizer}) {

    const [isSaved, setIsSaved] = useState(saved);

    const handleClick = () => {
        setIsSaved(!isSaved);
        toggleCardSaved(index);
    }


    return (
            <div className="border flex flex-col justify-evenly rounded-3xl bg-[#F6F2E9] w-96 h-64">
                <Link href={{
                    pathname: `/events/event_listings/${Location}`,
                    query: { EventDescription, Location, WebsiteLink, pic, Date, description, index, saved, Time, distance, toggleCardSaved, EventName, EventOrganizer }
                    }}>
                <div className="flex flex-row justify-center items-center gap-2 hover:cursor-pointer">
                    {/* gonna be image circle */}
                    <div className="w-20 h-20 bg-orange-400 rounded-full"/>
                    <div className="flex items-center justify-center w-60 h-14 bg-white rounded-full">
                        <p className={`p-4 text-2xl text-[#214933] ${prozaLibre.className} overflow-hidden text-ellipsis whitespace-nowrap`}>{EventName}</p>
                    </div>
                </div>
                </Link>
                <div className='flex flex-row w-full pl-8 pr-5'>
                    <div className='flex flex-col justify-center'>
                        <p className={`text-sm ${prozaLibre.className} text-[#214933]`}>{Location}</p>
                        <p className={`text-sm ${prozaLibre.className} text-[#214933]`}>{Date}</p>
                        <p className={`text-sm ${prozaLibre.className} text-[#214933]`}>{Time}</p>
                        <div className='w-16 h-px bg-black my-2'/>
                        <p className={`text-sm ${prozaLibre.className} text-[#214933] w-full font-bold`}>Event Organizer:</p>
                        <p className={`text-sm ${prozaLibre.className} text-[#214933]`}>{EventOrganizer}</p>
                        
                    </div>
                    <div className='flex flex-col mt-auto ml-auto'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill={saved ? '#214933' : 'none'} viewBox="0 0 24 24" stroke-width="2" stroke="#214933" class="size-6" onClick={handleClick}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg>
                    </div>
                </div>
            </div>
    )
}