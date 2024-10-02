import Link from 'next/link'
import TitleCard from './TitleCard';

export default function ProductOffers() {
  return (
    <section className="flex flex-col md:flex-row justify-between items-center px-8 py-24 border-b-2">
      {/* Title Section */}
      <TitleCard header="Product Offers" translation="* Ofertas de Productos" />

      {/* Product Cards Section */}
      <div className="md:w-6/12 flex flex-wrap justify-between">
        {/* Product Card 1 */}
        <div className="bg-[#F6F2E9] p-4 rounded-xl shadow-lg w-64 h-full flex flex-col justify-between">
          <div>
            <div className="h-12 w-12 bg-orange-500 rounded-full mb-4"></div> {/* Circle */}
            <div className="p-4 bg-white rounded-xl">
              <p className="text-lg text-center">20% off ticket price</p>
            </div>
            <div className="px-2 py-4 rounded-lg">
              <p className="text-xs">Company: Museum of Fine Arts</p>
              <hr className="my-2 border-gray-700" />              
              <p className="text-xs">Offer lasts 9/10 thru 9/25</p>
            </div>
          </div>
          <div className="flex justify-end mt-4 text-xs">
            <a href="#" className="text-blue-600 hover:underline">See More</a>
          </div>
        </div>
        {/* Product Card 2 */}
        <div className="bg-[#F6F2E9] p-4 rounded-xl shadow-lg w-64 h-full flex flex-col justify-between">
            <div>
                <div className="h-12 w-12 bg-red-500 rounded-full mb-4"></div> {/* Red circle */}
                {/* Offer Text */}
                <div className="p-4 bg-white rounded-xl">
                    <p className="text-lg text-center">30% off all items</p>
                </div>
                {/* Company Info */}
                <div className="px-2 py-4 rounded-lg">
                    <p className="text-xs">Company: Local Artisans</p>
                    <hr className="my-2 border-gray-700" />              
                    <p className="text-xs">Offer valid through 9/30</p>
                </div>
            </div>

            {/* See More Link */}
            <div className="flex justify-end mt-4 text-xs">
                <a href="#" className="text-blue-600 hover:underline">See More</a>
            </div>
        </div>
      </div>
    </section>
  );
}
