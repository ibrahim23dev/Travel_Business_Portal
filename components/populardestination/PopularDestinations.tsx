// /components/PopularDestinations.tsx

import React from 'react';
import Image from 'next/image';
import { popularDestinations, callToActionCard, Destination } from './destinations';

// A reusable card component for standard destinations
const DestinationCard = ({ destination }: { destination: Destination }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
    <div className="relative h-56 w-full">
      <Image
        src={destination.image}
        alt={`View of ${destination.name}`}
        layout="fill"
        objectFit="cover"
      />
    </div>
    <div className="p-5">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{destination.name}</h3>
      <div className="flex items-center space-x-2">
        <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-md">
          {destination.rating}/5
        </span>
        <span className="text-gray-500 text-sm">({destination.reviews.toLocaleString()} reviews)</span>
      </div>
    </div>
  </div>
);

// The special "Go Now" card component
const GoNowCard = () => (
  <div className="relative bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out h-full">
    <div className="relative h-full w-full">
      <Image
        src={callToActionCard.image}
        alt="Cozy bedroom for travel"
        layout="fill"
        objectFit="cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
        <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition-colors duration-300">
          Go Now
        </button>
      </div>
    </div>
  </div>
);

// The main container component
const PopularDestinations = () => {
  return (
    <section className="w-full  py-16 sm:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Popular Destinations
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            We promise to prioritize your and surpass your expectations at every turn. Whether you're seeking professional Expertise, Creative solutions or reliable support.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {popularDestinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
          <GoNowCard />
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;