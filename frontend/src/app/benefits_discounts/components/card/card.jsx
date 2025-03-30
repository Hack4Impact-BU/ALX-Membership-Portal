'use client'

import { Inter, Proza_Libre } from 'next/font/google'; // Import the Proza Libre font
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function Card({offerTitle, place, link, pic_url, startDate, index, offerDesc, isSaved, BusinessType, distance, toggleCardSaved, instruct}) {
    console.log("Card received pic_url:", pic_url); // Debug image URL

    const handleClick = () => {
        toggleCardSaved(index);
    }

    return (
            <div className="border flex flex-col justify-evenly rounded-3xl bg-[#F6F2E9] w-80 h-56 transition-transform duration-300 hover:scale-105">
                <Link href={{
                    pathname: `/benefits_discounts/${place}`,
                    query: { offerTitle, place, link, instruct, startDate, offerDesc, index, isSaved, BusinessType, distance, toggleCardSaved, pic_url }
                    }}>
                <div className="flex flex-row items-center justify-center gap-2 cursor-pointer mt-4">
                    {/* Image circle - using existing layout */}
                    {pic_url ? (
                        <img 
                            src={pic_url} 
                            alt={offerTitle} 
                            onError={(e) => {
                                console.log("Image failed to load:", pic_url);
                                e.target.onerror = null; 
                                e.target.src = ""; // Set to empty
                                e.target.style.display = "none"; // Hide on error
                                e.target.parentNode.classList.add("bg-[#214933]"); // Add background
                            }}
                            className="w-20 h-20 rounded-full object-cover" 
                        />
                    ) : (
                        <div className="w-20 h-20 bg-[#214933] rounded-full" />
                    )}
                    <div className="flex items-center justify-center w-60 h-14 bg-white rounded-full">
                        <p className={`text-xl text-[#214933] ${prozaLibre.className} px-4 overflow-hidden text-ellipsis whitespace-nowrap`}>
                            {offerTitle}
                        </p>
                    </div>
                </div>
                </Link>
                <div className='flex flex-row w-full pl-5 pr-5'>
                    <div className='flex flex-col justify-center'>
                        <p className={`text-sm ${prozaLibre.className} text-[#214933]`}>{place}</p>
                        <div className='w-16 h-px bg-black mt-2 mb-2'/>
                        <p className={`text-sm ${prozaLibre.className} text-[#214933] w-4/5`}>{offerTitle}</p>
                        <p className={`font-bold text-sm ${prozaLibre.className} text-[#214933]`}>{startDate}</p>
                        
                    </div>
                    <div className='flex flex-col mt-auto ml-auto'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill={isSaved ? '#214933' : 'none'} viewBox="0 0 24 24" stroke-width="2" stroke="#214933" class="size-6" onClick={handleClick}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg>
                    </div>
                </div>
            </div>
    )
}
