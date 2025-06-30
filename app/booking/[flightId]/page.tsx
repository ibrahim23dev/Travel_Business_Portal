'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatDateTime, formatDate, formatDuration } from '../../../Utility/formatDateTime';

interface Passenger {
  type: 'adult' | 'child';
  name: string;
  age: number;
  passport: string;
}

// ========================================================================
// THIS IS THE CRITICAL FIX
// The interface MUST include `searchParams` to match Next.js's internal PageProps type.
// ========================================================================
interface BookingPageProps {
  params: {
    flightId: string;
  };
  // Add searchParams to the interface, even if you don't use it.
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function BookingPage({ params }: BookingPageProps) {
  const router = useRouter();
  const { results, adults, children } = useSelector((state: RootState) => state.search);
  const selectedFlight = results.find((flight) => flight.resultid === params.flightId);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (adults > 0 || children > 0) {
      const initialPassengers: Passenger[] = [
        ...Array(adults).fill(null).map(() => ({ type: 'adult' as const, name: '', age: 0, passport: '' })),
        ...Array(children).fill(null).map(() => ({ type: 'child' as const, name: '', age: 0, passport: '' })),
      ];
      setPassengers(initialPassengers);
    }
  }, [adults, children]);

  if (!selectedFlight) {
    return (
      <div className="container mx-auto py-12 text-center text-red-500">
        <p className="text-lg">Flight not found.</p>
      </div>
    );
  }

  if (passengers.length === 0) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-lg">Loading passenger forms...</p>
      </div>
    );
  }

  const flightData = selectedFlight.itin_details[0].flight_data[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = passengers.every(
      (p) => p.name && p.age > 0 && (p.type === 'adult' ? p.passport : true)
    );
    if (!isValid) {
      setError('Please fill out all required fields correctly.');
      return;
    }
    setError(null); // Clear error on successful validation
    console.log('Booking submitted:', { flight: selectedFlight, passengers });
    router.push('/confirmation');
  };

  const handlePassengerChange = (index: number, field: keyof Passenger, value: string | number) => {
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

      {/* Flight Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center space-x-0 md:space-x-4">
          <Image
            src={selectedFlight.air_logo}
            alt={flightData.airline_name}
            width={50}
            height={50}
            className="object-contain mb-4 md:mb-0"
          />
          <div className="flex-1">
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
              {selectedFlight.itin_details[0].layover === 0 ? 'Non-stop' : `${selectedFlight.itin_details[0].layover} stop(s)`}
            </p>
            <p className="text-gray-600">Baggage: {flightData.baggage_details}</p>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <p className="text-xl font-bold">
              {selectedFlight.price_info.currency}{' '}
              {selectedFlight.price_info.total.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Passenger Information Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-500">{error}</p>}
        {passengers.map((passenger, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              {passenger.type === 'adult' ? `Adult ${index + 1}` : `Child ${index + 1 - adults}`}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={passenger.name}
                onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                placeholder="Age"
                value={passenger.age || ''}
                onChange={(e) => handlePassengerChange(index, 'age', parseInt(e.target.value, 10) || 0)}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder={`Passport Number${passenger.type === 'child' ? ' (Optional)' : ''}`}
                value={passenger.passport}
                onChange={(e) => handlePassengerChange(index, 'passport', e.target.value)}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={passenger.type === 'adult'}
              />
            </div>
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
}