import Link from 'next/link'
import TitleCard from './TitleCard';
import { Inter, Proza_Libre } from 'next/font/google'; // Correctly importing Inter and Proza_Libre

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function JobBoard() {
  return (
    <section className="flex flex-col md:flex-row justify-between items-center px-8 py-24 border-b-2">
      {/* Title Section (Replaced with ReusableHeader) */}
      <TitleCard header="Job Board" translation="* Bolsa de Trabajo" />

      {/* Job Listings Section */}
      <div className={`md:w-6/12 flex flex-wrap justify-between ${prozaLibre.className}`}>
        {/* Job Listing 1 */}
        <div className="bg-[#F6F2E9] p-4 rounded-xl shadow-lg w-64 h-full flex flex-col justify-between">
          <div>
            <div className="h-12 w-12 bg-blue-500 rounded-full mb-4"></div> {/* Circle */}
            <div className="p-4 bg-white rounded-xl">
              <p className="text-lg text-center">Software Engineer</p>
            </div>
            <div className="px-2 py-4 rounded-lg">
              <p className="text-xs">Company: Tech Corp</p>
              <hr className="my-2 border-gray-700" />              
              <p className="text-xs">Posted: 9/10</p>
            </div>
          </div>
          <div className="flex justify-end mt-4 text-xs">
            <a href="#" className="text-blue-600 hover:underline">See More</a>
          </div>
        </div>

        {/* Job Listing 2 */}
        <div className="bg-[#F6F2E9] p-4 rounded-xl shadow-lg w-64 h-full flex flex-col justify-between">
          <div>
            <div className="h-12 w-12 bg-orange-500 rounded-full mb-4"></div> {/* Circle */}
            <div className="p-4 bg-white rounded-xl">
              <p className="text-lg text-center">Marketing Manager</p>
            </div>
            <div className="px-2 py-4 rounded-lg">
              <p className="text-xs">Company: Local Biz</p>
              <hr className="my-2 border-gray-700" />              
              <p className="text-xs">Posted: 9/12</p>
            </div>
          </div>
          <div className="flex justify-end mt-4 text-xs">
            <a href="#" className="text-blue-600 hover:underline">See More</a>
          </div>
        </div>
      </div>
    </section>
  );
}
