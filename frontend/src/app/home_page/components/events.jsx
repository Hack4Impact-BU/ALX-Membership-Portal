import Link from 'next/link';
import TitleCard from './TitleCard'; // Assuming ReusableHeader is in the same directory

export default function UpcomingEvents() {
  return (
    <section className="flex flex-col md:flex-row justify-between items-center px-8 py-8 pb-24 border-b-2">
      {/* Title Section (Replaced with ReusableHeader) */}
      <TitleCard header="Upcoming Events" translation="* Próximos eventos" />

      {/* Event Cards Section */}
      <div className="md:w-6/12 flex flex-wrap justify-between">
        {/* Event Card 1 */}
        <div className="bg-[#F6F2E9] p-4 rounded-xl shadow-lg w-64 h-full flex flex-col justify-between">
          <div>
            <div className="h-12 w-12 bg-blue-500 rounded-full mb-4"></div> {/* Circle */}
            <div className="p-4 bg-white rounded-xl">
              <p className="text-lg text-center">Event Name</p>
            </div>
            <div className="px-2 py-4 rounded-lg">
              <p className="text-xs">Location: Boston, MA</p>
              <hr className="my-2 border-gray-700" />
              <p className="text-xs">Event Date: 9/18</p>
            </div>
          </div>
          <div className="flex justify-end mt-4 text-xs">
            <a href="#" className="text-blue-600 hover:underline">See More</a>
          </div>
        </div>

        {/* Event Card 2 */}
        <div className="bg-[#F6F2E9] p-4 rounded-xl shadow-lg w-64 h-full flex flex-col justify-between">
          <div>
            <div className="h-12 w-12 bg-orange-500 rounded-full mb-4"></div> {/* Circle */}
            <div className="p-4 bg-white rounded-xl">
              <p className="text-lg text-center">Event Name</p>
            </div>
            <div className="px-2 py-4 rounded-lg">
              <p className="text-xs">Location: Boston, MA</p>
              <hr className="my-2 border-gray-700" />
              <p className="text-xs">Event Date: 9/18</p>
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