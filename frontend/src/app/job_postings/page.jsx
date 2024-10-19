export default function JobBoard() {
  return (
    <div className="flex flex-col bg-[#324A3A] min-h-screen w-10/12 p-8 text-white border-2">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-2">Job Board</h1>
        <h2 className="text-xl italic">* Bolsa de Trabajo</h2>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-8 border-2">
        <button className="bg-[#f0f4e8] text-black py-2 px-4 rounded-lg flex items-center gap-2 shadow-lg">
          <span className="material-icons">bookmark_border</span>
          Saved
        </button>
        <select className="py-2 px-4 bg-[#f0f4e8] text-black rounded-lg shadow-lg">
          <option>Select Type</option>
        </select>
        <select className="py-2 px-4 bg-[#f0f4e8] text-black rounded-lg shadow-lg">
          <option>Select Distance</option>
        </select>
        <input
          type="text"
          placeholder="Zip Code"
          className="py-2 px-4 bg-[#f0f4e8] text-black rounded-lg shadow-lg"
        />
      </div>

      {/* Job Listing & Details Section */}
      <div className="flex gap-8">
        {/* Job List */}
        <div className="w-1/3">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="bg-[#f0f4e8] text-black p-4 mb-4 rounded-xl shadow-lg flex items-center gap-4"
            >
              <div className={`h-12 w-12 rounded-full bg-[${index % 2 === 0 ? '#FFA500' : '#FF0000'}]`}></div>
              <div>
                <p className="text-lg font-bold">Librarian</p>
                <p className="text-sm">Boston Public Library</p>
              </div>
            </div>
          ))}
        </div>
    )
}