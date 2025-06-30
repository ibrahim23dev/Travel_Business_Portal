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

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://api.tbp.travel/flights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add authentication headers if required (e.g., API key)
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

  const handleBook = (resultid: string) => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      router.push(`/booking/${resultid}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-lg">Loading flights...</p>
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

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">
        Flights from {origin} to {destination} ({formatDate(departureDate)})
      </h1>
      {results.length === 0 ? (
        <p className="text-lg text-gray-600">No flights found for the selected criteria.</p>
      ) : (
        <div className="space-y-4">
          {results.map((flight) => {
            const flightData = flight.itin_details[0].flight_data[0];
            return (
              <div
                key={flight.resultid}
                className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div className="flex items-center space-x-4">
                  <Image
                    src={flight.air_logo}
                    alt={flightData.airline_name}
                    width={50}
                    height={50}
                    className="object-contain"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{flightData.airline_name}</h3>
                    <p className="text-gray-600">
                      {flightData.flight_name} • {flightData.equipmenttext}
                    </p>
                    <p className="text-gray-600">
                      {formatDateTime(flightData.departuredate)} -{' '}
                      {formatDateTime(flightData.arrivaldate)} •{' '}
                      {formatDuration(flightData.duration)}
                    </p>
                    <p className="text-gray-600">
                      {flightData.origincode} → {flightData.destinationcode} •{' '}
                      {flight.itin_details[0].layover === 0 ? 'Non-stop' : `${flight.itin_details[0].layover} stop(s)`}
                    </p>
                    <p className="text-gray-600">Baggage: {flightData.baggage_details}</p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:text-right">
                  <p className="text-xl font-bold">
                    {flight.price_info.currency} {flight.price_info.total.toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleBook(flight.resultid)}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}