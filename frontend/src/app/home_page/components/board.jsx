import Link from 'next/link'

export default function JobBoard() {
  return (
    <section className="flex flex-col md:flex-row justify-between items-start px-8 py-16 border-b-2">
      {/* Title Section */}
      <div className="md:w-1/3 flex flex-col items-start text-white">
        <h2 className="text-6xl font-bold mb-4 leading-tight">Job <br />Board</h2>
        <p className="italic mb-8">* Bolsa de Trabajo</p>
        <a href="#" className="text-white hover:underline mt-4">See More</a>
      </div>

      {/* Job Listings Section */}
      <div className="md:w-7/12 flex flex-wrap justify-start gap-6">
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
