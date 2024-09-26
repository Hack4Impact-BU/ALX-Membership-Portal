import Link from 'next/link'

export default function JobBoard() {
    return (
      <section className="flex flex-col md:flex-row justify-between items-start p-8">
        {/* Title Section */}
        <div className="md:w-1/3 flex flex-col items-start">
          <h2 className="text-6xl font-bold mb-4 leading-tight">Job <br /> Board</h2>
          <p className="italic mb-8">* Bolsa de Trabajo</p>
          <a href="#" className="text-white hover:underline mt-4">See More &gt;&gt;</a>
        </div>
  
        {/* Job Listings Section */}
        <div className="md:w-2/3 flex justify-start space-x-6">
          {/* Job Listing 1 */}
          <div className="bg-white p-4 rounded shadow-lg w-64">
            <div className="h-8 w-8 bg-blue-500 rounded-full mb-2"></div>
            <p className="text-lg font-bold">Business Name</p>
            <p className="text-sm">Job Description: Software Engineer</p>
            <a href="#" className="text-blue-600 hover:underline mt-4 inline-block">See More &gt;&gt;</a>
          </div>
  
          {/* Job Listing 2 */}
          <div className="bg-white p-4 rounded shadow-lg w-64">
            <div className="h-8 w-8 bg-orange-500 rounded-full mb-2"></div>
            <p className="text-lg font-bold">Business Name</p>
            <p className="text-sm">Job Description: Marketing Manager</p>
            <a href="#" className="text-blue-600 hover:underline mt-4 inline-block">See More &gt;&gt;</a>
          </div>
        </div>
      </section>
    );
  }