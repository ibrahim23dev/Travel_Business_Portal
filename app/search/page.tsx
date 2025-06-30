'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '../store';
import { setSearchResults } from '../features/searchSlice';
import Image from 'next/image';
import { formatDateTime, formatDate, formatDuration } from '../../Utility/formatDateTime';

export default function SearchPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { results, origin, destination, departureDate, adults, children, infant } = useSelector(
    (state: RootState) => state.search
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(21 * 60 + 44); // Initial 21:44 in seconds
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [refundable, setRefundable] = useState<boolean | null>(null); // null for all, true for refundable, false for non-refundable

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://api.tbp.travel/flights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            origin,
            destination,
            departureDate: new Date(departureDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
            returnDate: departureDate,
            passenger: {
              adult: adults,
              children,
              infant,
            },
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch flights');
        }

        const data = await response.json();
        dispatch(setSearchResults(data.data));
      } catch (err) {
        setError('An error occurred while fetching flights. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (origin && destination && departureDate) {
      fetchFlights();
    }
  }, [dispatch, origin, destination, departureDate, adults, children, infant]);

  useEffect(() => {
    // Update time remaining every second, starting from 11:50 AM +06 on June 30, 2025
    const startTime = new Date('2025-06-30T11:50:00+06:00').getTime();
    const now = new Date().getTime();
    const initialSeconds = Math.floor((21 * 60 + 44) - ((now - startTime) / 1000));
    setTimeRemaining(initialSeconds > 0 ? initialSeconds : 0);

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleBook = (resultid: string) => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      router.push(`/booking/${resultid}`);
    }
  };

  const handleAirlineChange = (airline: string) => {
    setSelectedAirlines((prev) =>
      prev.includes(airline) ? prev.filter((a) => a !== airline) : [...prev, airline]
    );
  };

  const handleRefundabilityChange = (value: boolean) => {
    setRefundable(refundable === value ? null : value);
  };

  const filteredResults = results
    .filter((flight) =>
      selectedAirlines.length === 0 ||
      selectedAirlines.includes(flight.itin_details[0].flight_data[0].airline_name)
    )
    .filter((flight) => {
      if (refundable === null) return true;
      return flight.itin_details[0].flight_data[0].is_refundable === refundable; // Assuming flight data has an is_refundable field
    });

  if (loading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-lg text-gray-600">Loading flights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 text-center text-red-500">
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Fixed Filter Sidebar */}
        <div className="bg-white rounded-lg mt-5 shadow-md w-full lg:w-1/4 p-4 lg:sticky lg:top-8 h-fit">
          {/* Time Remaining */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">⏳</span>
                <h3 className="text-lg font-semibold text-gray-800">Time Remaining</h3>
              </div>
              <span className="text-blue-600 font-medium">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Price Range */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">Price Range</h3>
              <span className="text-blue-600 cursor-pointer">▼</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Starts from <span className="font-medium">৳ 4,757</span> - <span className="font-medium">৳ 5,982</span> against your search. Price is a subject to change.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">BDT 4,757 - BDT 5,982</p>
          </div>

          {/* Flight Schedules */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">Flight Schedules</h3>
              <span className="text-blue-600 cursor-pointer">▼</span>
            </div>
            <div className="flex justify-between mb-2">
              <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">Departure</button>
              <button className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">Arrival</button>
            </div>
            <p className="text-sm text-gray-600 mb-2">Departure Dhaka: Anytime</p>
            <div className="flex justify-between text-sm text-gray-600">
              <span>00-06 AM</span>
              <span>06-12 PM</span>
              <span>12-06 PM</span>
              <span>06-12 AM</span>
            </div>
          </div>

          {/* Airlines */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">Airlines</h3>
              <span className="text-blue-600 cursor-pointer">▼</span>
            </div>
            <div className="space-y-2">
              <label className="flex items-center justify-between text-sm text-gray-700">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    onChange={() => handleAirlineChange('US-Bangla Airlines')}
                  />
                  <span>US-Bangla Airlines</span>
                </div>
                <span className="text-gray-600">৳ 4,797</span>
              </label>
              <label className="flex items-center justify-between text-sm text-gray-700">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    onChange={() => handleAirlineChange('Biman Bangladesh Airlines')}
                  />
                  <span>Biman Bangladesh Airli...</span>
                </div>
                <span className="text-gray-600">৳ 5,697</span>
              </label>
              <label className="flex items-center justify-between text-sm text-gray-700">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    onChange={() => handleAirlineChange('NOVOAIR')}
                  />
                  <span>NOVOAIR</span>
                </div>
                <span className="text-gray-600">৳ 4,757</span>
              </label>
              <label className="flex items-center justify-between text-sm text-gray-700">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    onChange={() => handleAirlineChange('Air Astra')}
                  />
                  <span>Air Astra</span>
                </div>
                <span className="text-gray-600">৳ 5,798</span>
              </label>
            </div>
          </div>

          {/* Refundability */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">Refundability</h3>
              <span className="text-blue-600 cursor-pointer">▼</span>
            </div>
            <div className="space-y-2">
              <label className="flex items-center justify-between text-sm text-gray-700">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    checked={refundable === true}
                    onChange={() => handleRefundabilityChange(true)}
                  />
                  <span>Refundable</span>
                </div>
              </label>
              <label className="flex items-center justify-between text-sm text-gray-700">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    checked={refundable === false}
                    onChange={() => handleRefundabilityChange(false)}
                  />
                  <span>Non-Refundable</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Flight Results with Scroll */}
        <div className="w-full lg:w-3/4 py-12">
          <h1 className="text-3xl text-black font-bold mb-8">
            Flights from {origin} to {destination} ({formatDate(departureDate)})
          </h1>
          {filteredResults.length === 0 ? (
            <p className="text-lg text-gray-600">No flights found for the selected criteria.</p>
          ) : (
            <div className="space-y-4">
              {filteredResults.map((flight) => {
                const flightData = flight.itin_details[0].flight_data[0];
                return (
                  <div
                    key={flight.resultid}
                    className="bg-white border border-gray-200 rounded-lg shadow-md p-6 flex flex-col md:flex-row justify-between items-center w-full transition-all duration-200 hover:shadow-lg"
                  >
                    <div className="flex items-center space-x-6">
                      <div className="flex-shrink-0">
                        <Image
                          src={flight.air_logo}
                          alt={flightData.airline_name}
                          width={60}
                          height={60}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <div className="text-sm font-medium text-gray-700">
                          {flightData.origincode} - {flightData.destinationcode}
                        </div>
                        <div className="text-xl font-bold text-gray-900">{flightData.airline_name}</div>
                        <div className="text-sm text-gray-600">{formatDuration(flightData.duration)}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-8 text-center">
                      <div className="flex flex-col space-y-2">
                        <div className="text-lg font-semibold text-gray-800">
                          {formatDateTime(flightData.departuredate).split(' ')[1]}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatDateTime(flightData.departuredate).split(' ')[0]}
                        </div>
                        <div className="text-xs text-gray-500">{flightData.origincode}</div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <div className="text-lg font-semibold text-gray-800">
                          {formatDateTime(flightData.arrivaldate).split(' ')[1]}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatDateTime(flightData.arrivaldate).split(' ')[0]}
                        </div>
                        <div className="text-xs text-gray-500">{flightData.destinationcode}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <div className="text-sm font-medium text-gray-700">
                        {flight.itin_details[0].layover === 0 ? 'Non-Stop' : `${flight.itin_details[0].layover} Stop(s)`}
                      </div>
                      <div className="text-xs text-gray-500">{flightData.destinationcode}</div>
                    </div>
                    <div className="flex flex-col items-end space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-green-600 text-xl font-bold">
                          ৳ {flight.price_info.total.toLocaleString()}
                        </span>
                        <span className="text-gray-500 text-sm line-through">
                          ৳ {(flight.price_info.total * 1.1).toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => handleBook(flight.resultid)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}