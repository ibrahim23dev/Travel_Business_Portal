'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SearchForm from '../components/SearchForm';
import BestHotelDeals from '../components/HotelBestDels/BestHotelDeals';
import PopularDestinations from '@/components/populardestination/PopularDestinations';
import { HomePageInfo } from '@/components/types';

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function Home({destinations}: { destinations: HomePageInfo }) {
  const [publicData, setPublicData] = useState<HomePageInfo | null>(null);
  const [publicIsLoading, setPublicIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data fetching (replace with real API call)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setPublicIsLoading(true);
        // Dummy data (replace with API fetch)
        const dummyData: HomePageInfo = destinations;
        setPublicData(dummyData);
        setPublicIsLoading(false);
      } catch (err) {
        setError('Failed to load data');
        setPublicIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <motion.section
        className="bg-blue-700 text-white py-16 sm:py-20 text-center"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 font-murecho">
            Find Your Perfect Flight
          </h1>
          <p className="text-lg sm:text-xl mb-8 font-nunito max-w-2xl mx-auto">
            Search and book flights with the best prices, tailored to your travel needs.
          </p>
          <div className=" mx-auto">
            <SearchForm />
          </div>
        </div>
      </motion.section>

      {/* Popular Destinations Section */}
      <motion.section
        className="py-16 bg-gray-100"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {error ? (
            <p className="text-red-500 text-center text-lg font-nunito">
              Error: {error}
            </p>
          ) : (
            <PopularDestinations/>
          )}
        </div>
      </motion.section>

      {/* Best Hotel Deals Section */}
      <motion.section
        className="bg-white py-16"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <BestHotelDeals />
        </div>
      </motion.section>
    </div>
  );
}