"use client";
import React from 'react';
import { HotelDeal } from './HotelDeal'; // Import the type definition
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { AiOutlineStar } from 'react-icons/ai';
import { HiOutlineArrowSmRight } from 'react-icons/hi';

interface HotelCardProps {
  hotel: HotelDeal;
}

// Helper to render star ratings dynamically
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} className="text-yellow-500" />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
    } else {
      stars.push(<AiOutlineStar key={i} className="text-yellow-500" />);
    }
  }
  return <div className="flex items-center">{stars}</div>;
};


const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300">
      <img
        src={hotel.imageUrl}
        alt={`View of ${hotel.name}`}
        className="w-full h-56 object-cover"
      />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {hotel.name}
        </h3>
        <div className="flex items-center mb-4">
          <StarRating rating={hotel.rating} />
          <span className="text-gray-600 ml-2">({hotel.reviews} Ratings)</span>
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-6">
          ${hotel.price.toFixed(2)}<span className="text-base font-normal text-gray-500">/Person</span>
        </div>
        
        <div className="mt-auto flex justify-between items-center">
          <span className="text-gray-600">{hotel.durationDays} Days</span>
          <a
            href={hotel.exploreUrl}
            className="flex items-center text-lg font-medium text-blue-600 border border-gray-300 rounded-full py-2 px-4 hover:bg-blue-600 hover:text-white transition-colors duration-300 group"
          >
            Explore
            <HiOutlineArrowSmRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;