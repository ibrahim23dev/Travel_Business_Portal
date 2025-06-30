"use client";
import React, { useState } from 'react';
import { hotelDeals, locationTabs } from './HotelDeal';
import HotelCard from './HotelCard';

// Icons
import { VscVerifiedFilled } from 'react-icons/vsc';
import { BsFillTagFill } from 'react-icons/bs';
import { IoGlobeOutline } from 'react-icons/io5';

const BestHotelDeals: React.FC = () => {
  // State to keep track of the active tab
  const [activeTab, setActiveTab] = useState('Cox\'s Bazar');

  // Filter hotels based on the active tab
  const filteredHotels = hotelDeals.filter(hotel => hotel.location === activeTab);

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Best Hotel Deals</h2>
          <div className="flex justify-center items-center space-x-6 text-gray-600">
            <span className="flex items-center">
              <VscVerifiedFilled className="text-blue-500 mr-2" /> Premium Hotel
            </span>
            <span className="flex items-center">
              <BsFillTagFill className="text-blue-500 mr-2" /> Best Price Guarantee
            </span>
            <span className="flex items-center">
              <IoGlobeOutline className="text-blue-500 mr-2" /> Worldwide Destinations
            </span>
          </div>
        </div>

        {/* Location Tabs Section */}
        <div className="flex justify-center mb-10">
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-full">
            {locationTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-300
                  ${activeTab === tab 
                    ? 'bg-gray-800 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-200'
                  }`
                }
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        {/* Hotel Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* We map over the data for the active tab. For this example, only one card is shown per tab. */}
          {/* If there are no hotels for a tab, we can show a message. */}
          {filteredHotels.length > 0 ? (
            filteredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))
          ) : (
             <div className="col-span-full text-center py-10">
                <p className="text-gray-500">No hotel deals available for {activeTab} right now.</p>
             </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BestHotelDeals;