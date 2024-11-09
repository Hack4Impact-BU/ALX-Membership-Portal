
import { Proza_Libre } from 'next/font/google'; // Import the Proza Libre font

const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default async function Page({ searchParams }) {
    const {
      offer = null,
      location = null,
      link = null,
      pic = null,
      date = null,
      index = null,
      saved = null,
      type = null,
      distance = null,
      description = null,
    } = searchParams; // Destructure query parameters
  
    return (
      <div className="flex flex-col w-full h-[1280px]">
        <div className="flex flex-row gap-8 w-full h-2/5 p-12">
            <div className="flex flex-col justify-center items-center basis-1/2 h-full bg-[#F6F2E9] rounded-xl">
                <h1>IMAGE GOES HERE</h1>
            </div>
            <div className="flex flex-col justify-around items-start basis-1/2 h-full bg-[#F6F2E9] rounded-xl p-12">
                <div className="flex flex-row gap-4 justify-center items-center">

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#214933" class="size-14">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                    <p className={`text-2xl text-[#214933] ${prozaLibre.className}`}>date{offer}</p>
                </div>
                <div className="flex flex-row gap-4 justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#214933" className="size-14">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>

                    <p className={`text-2xl text-[#214933] ${prozaLibre.className}`}>time{date}</p>
                </div>
                <div className="flex flex-row gap-4 justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#214933" class="size-14">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    <p className={`text-2xl text-[#214933] ${prozaLibre.className}`}>location{location}</p>
                </div>
                <div class="h-1 bg-[#214933] w-full"></div>

                <div className='flex flex-row gap-4 justify-center items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#214933" className="size-14">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                    </svg>
                    <p className={`text-2xl text-[#214933] ${prozaLibre.className}`}>(123)-456-7890</p>
                </div>

            </div>
        </div>
        <div className='flex flex-row h-3/5 w-full px-12 mt-[-1rem]'>
            <div className='flex flex-col w-full h-full bg-[#F6F2E9] rounded-xl p-12'>
                <div className='flex flex-row justify-between items-center gap-2'>
                    <div className='flex flex-row ju items-center gap-8'>
                        <div className="w-36 h-36 bg-red-400 rounded-full"/>
                        <p className={`text-5xl text-[#214933] ${prozaLibre.className}`}>{location}</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill={'none'} viewBox="0 0 24 24" stroke-width="2" stroke="#214933" class="size-20">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                    </svg>
                </div>

                <p className={`text-[60px] text-black ${prozaLibre.className} my-4`}>{offer}</p>

                <p className={`text-2xl text-black ${prozaLibre.className} mb-4`}>Offer Description:<br/>{description}</p>

                <div class="w-full h-1 bg-[#214933] mt-12 mb-6"></div>

                <p className={`text-2xl text-black ${prozaLibre.className} mb-4`}>Instructions to Redeem:</p>
                <ul>
                    <li>fdsajkflsd</li>
                </ul>


            </div>
        </div>
      </div>
    );
  }
  