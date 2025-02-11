
'use client'

import { Inter, Proza_Libre } from 'next/font/google'; // Import the Proza Libre font
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function AdminCard({id, offerTitle, place, link, pic, startDate, index, offerDesc, isSaved, BusinessType, distance, toggleCardSaved, instruct}) {


    const handleClick = () => {
        toggleCardSaved(index);
    }

    const handleDelete = async (eventId) => {
        try {
          const response = await fetch(`http://localhost:3001/product_offers/${id}`, {
            method: 'DELETE',
          });
      
          if (!response.ok) {
            throw new Error('Failed to delete event');
          }
      
        } catch (error) {
          console.error('Error:', error);
        }
      };
      



    return (
            <div className="border flex flex-col justify-evenly rounded-3xl bg-[#F6F2E9] w-80 h-56">
                <Link href={{
                    pathname: `/benefits_discounts/${place}`,
                    query: { offerTitle, place, link, instruct, startDate, offerDesc, index, isSaved, BusinessType, distance, toggleCardSaved, pic }
                    }}>
                <div className="flex flex-row justify-center items-center gap-2 hover:cursor-pointer">
                    {/* gonna be image circle */}
                    <div className="w-20 h-20 bg-orange-400 rounded-full"/>
                    <div className="flex items-center w-48 h-14 bg-white rounded-full">
                        <p className={`p-4 text-2xl text-[#214933] ${prozaLibre.className} overflow-hidden text-ellipsis whitespace-nowrap`}>{offerTitle}</p>
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
                    <div className='flex flex-row mt-auto ml-auto gap-2 cursor-pointer'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#FF746C" class="size-6" onClick={handleDelete}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>

                        {/* ADDDDDD DELETE THING */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#43e48a" viewBox="0 0 24 24" stroke-width="1.5" stroke="#214933" class="size-6"  >
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" fill={isSaved ? '#214933' : 'none'} viewBox="0 0 24 24" stroke-width="2" stroke="#214933" class="size-6" onClick={handleClick}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg>
                    </div>
                </div>
            </div>
    )
}