'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import TitleCard from './TitleCard';
import { Inter, Proza_Libre } from 'next/font/google';

const inter = Inter({ subsets: ["latin"] });
const prozaLibre = Proza_Libre({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function ProductOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchOffers() {
      try {
        console.log('Fetching offers', process.env.NEXT_PUBLIC_API_BASE_URL);
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiBaseUrl}/product_offers?limit=2`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch offers');
        }
          
        const data = await response.json();
        console.log('Product Offers Data: ', data);
        setOffers(data.slice(0, 2)); // Take first two offers
        setLoading(false);
      } catch (error) {
        console.error('Error fetching offers:', error);
        setLoading(false);
      }
    }
    
    fetchOffers();
  }, []);
  
  return (
    <section className="flex flex-col md:flex-row justify-between items-center px-8 py-24 border-b-2">
      {/* Title Section */}
      <TitleCard 
        header="Product Offers" 
        translation="* Ofertas de Productos" 
        link="/benefits_discounts" 
      />

      {/* Product Cards Section */}
      <div className={`md:w-6/12 flex flex-wrap justify-between ${prozaLibre.className}`}>
        {loading ? (
          // Loading state
          <p>Loading offers...</p>
        ) : offers.length > 0 ? (
          // Map through actual offers
          offers.map((offer) => (
            <div key={offer.id} className="bg-[#F6F2E9] p-4 rounded-xl shadow-lg w-64 h-full flex flex-col justify-between">
              <div>
                {offer.pic_url ? (
                  <img 
                    src={offer.pic_url} 
                    alt={offer.offerTitle} 
                    className="h-12 w-12 rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="h-12 w-12 bg-orange-500 rounded-full mb-4"></div>
                )}
                <div className={`p-4 bg-white rounded-xl`}>
                  <p className="text-lg text-center">{offer.offerTitle}</p>
                </div>
                <div className={`px-2 py-4 rounded-lg`}>
                  <p className="text-xs">Company: {offer.place}</p>
                  <hr className="my-2 border-gray-700" />              
                  <p className="text-xs">
                    Offer valid from {new Date(offer.startDate).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                    {" thru "}{new Date(offer.endDate).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className={`flex justify-end mt-4 text-xs`}>
                <Link href={`/product_offers/${offer.id}`} className="text-blue-600 hover:underline">
                  See More
                </Link>
              </div>
            </div>
          ))
        ) : (
          // No offers case
          <p>No offers available at this time.</p>
        )}
      </div>
    </section>
  );
}