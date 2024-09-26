import Link from 'next/link'

export default function ProductOffers() {
    return (
      <section className="flex flex-col md:flex-row justify-between items-start p-8">
        {/* Title Section */}
        <div className="md:w-1/3 flex flex-col items-start">
          <h2 className="text-6xl font-bold mb-4 leading-tight">Product <br /> Offers</h2>
          <p className="italic mb-8">* Ofertas de Productos</p>
          <a href="#" className="text-white hover:underline mt-4">See More &gt;&gt;</a>
        </div>
  
        {/* Product Cards Section */}
        <div className="md:w-2/3 flex justify-start space-x-6">
          {/* Product Card 1 */}
          <div className="bg-white p-4 rounded shadow-lg w-64">
            <div className="h-8 w-8 bg-orange-500 rounded-full mb-2"></div>
            <p className="text-lg font-bold">20% off ticket price</p>
            <p className="text-sm">Company: Museum of Fine Arts</p>
            <p className="text-sm">Offer lasts 9/10 thru 9/25</p>
            <a href="#" className="text-blue-600 hover:underline mt-4 inline-block">See More &gt;&gt;</a>
          </div>
  
          {/* Product Card 2 */}
          <div className="bg-white p-4 rounded shadow-lg w-64">
            <div className="h-8 w-8 bg-red-500 rounded-full mb-2"></div>
            <p className="text-lg font-bold">30% off all items</p>
            <p className="text-sm">Company: Local Artisans</p>
            <p className="text-sm">Offer valid through 9/30</p>
            <a href="#" className="text-blue-600 hover:underline mt-4 inline-block">See More &gt;&gt;</a>
          </div>
        </div>
      </section>
    );
  }