import Link from 'next/link'

export default function GetInvolved() {
    return (
      <section className="flex flex-col md:flex-row justify-between items-start p-8">
        {/* Title Section */}
        <div className="md:w-1/3 flex flex-col items-start">
          <h2 className="text-6xl font-bold mb-4 leading-tight">Get <br /> Involved</h2>
          <p className="italic mb-8">* Involúcrate</p>
          <a href="#" className="text-white hover:underline mt-4">See More &gt;&gt;</a>
        </div>
  
        {/* Involvement Opportunities Section */}
        <div className="md:w-2/3 flex justify-start space-x-6">
          {/* Opportunity 1 */}
          <div className="bg-white p-4 rounded shadow-lg w-64">
            <h3 className="text-lg font-bold">Guest Speaker at Boston University</h3>
            <p className="text-sm">Join us as a guest speaker for the upcoming semester.</p>
            <a href="#" className="text-blue-600 hover:underline mt-4 inline-block">See More &gt;&gt;</a>
          </div>
  
          {/* Opportunity 2 */}
          <div className="bg-white p-4 rounded shadow-lg w-64">
            <h3 className="text-lg font-bold">Volunteer at Local Events</h3>
            <p className="text-sm">Help organize events in your community.</p>
            <a href="#" className="text-blue-600 hover:underline mt-4 inline-block">See More &gt;&gt;</a>
          </div>
        </div>
      </section>
    );
  }