import Link from 'next/link'

export default function UpcomingEvents() {
    return (
      <section className="flex flex-col md:flex-row justify-between items-start p-8">
        {/* Title Section */}
        <div className="md:w-1/3 flex flex-col items-start">
          <h2 className="text-6xl font-bold mb-4 leading-tight">Upcoming <br /> Events</h2>
          <p className="italic mb-8">* Próximos eventos</p>
          <a href="#" className="text-white hover:underline mt-4">See More &gt;&gt;</a>
        </div>
  
        {/* Event Cards Section */}
        <div className="md:w-2/3 flex justify-start space-x-6">
          {/* Event Card 1 */}
          <div className="bg-white p-4 rounded shadow-lg w-64">
            <div className="h-8 w-8 bg-blue-500 rounded-full mb-2"></div>
            <h3 className="text-lg font-bold">Event Name</h3>
            <p className="text-sm">Boston, MA</p>
            <p className="text-sm">Wednesday, September 18</p>
            <p className="text-sm">5:00 p.m. EST</p>
            <hr className="my-2" />
            <p className="text-sm font-bold">Event Organizers:</p>
            <p className="text-sm">Amplify LatinX</p>
            <a href="#" className="text-blue-600 hover:underline mt-4 inline-block">See More &gt;&gt;</a>
          </div>
  
          {/* Event Card 2 */}
          <div className="bg-white p-4 rounded shadow-lg w-64">
            <div className="h-8 w-8 bg-orange-500 rounded-full mb-2"></div>
            <h3 className="text-lg font-bold">Event Name</h3>
            <p className="text-sm">Boston, MA</p>
            <p className="text-sm">Wednesday, September 18</p>
            <p className="text-sm">5:00 p.m. EST</p>
            <hr className="my-2" />
            <p className="text-sm font-bold">Event Organizers:</p>
            <p className="text-sm">Amplify LatinX</p>
            <a href="#" className="text-blue-600 hover:underline mt-4 inline-block">See More &gt;&gt;</a>
          </div>
        </div>
      </section>
    );
  }