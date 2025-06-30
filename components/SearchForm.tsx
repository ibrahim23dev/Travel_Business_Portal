'use client';

import { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setSearchParams } from '../app/features/searchSlice';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { IoIosSearch } from "react-icons/io";

// TODO: Update the import path below to the correct location of your Popover components.
// Example if using @radix-ui/react-popover:
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
// Or, if you have these components in another local file, update the path accordingly.
// import { Popover, PopoverContent, PopoverTrigger } from '../components/Popover';
//import { FlipHorizontalIcon } from 'lucide-react';
import { LuArrowRightLeft } from 'react-icons/lu';

interface Airport {
  code: string;
  name: string;
  airport: string;
}

interface FormData {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  children: number;
  infant: number;
  tripType: 'OneWay' | 'RoundTrip' | 'MultiCity';
}

export default function SearchForm() {
  const [formData, setFormData] = useState<FormData>({
    origin: 'Dhaka',
    destination: "Cox's Bazar",
    departureDate: '2025-06-30',
    returnDate: '2025-07-02',
    adults: 1,
    children: 0,
    infant: 0,
    tripType: 'RoundTrip',
  });

  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [sameCityError, setSameCityError] = useState(false);
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [originSearch, setOriginSearch] = useState('');
  const [destinationSearch, setDestinationSearch] = useState('');

  const dispatch = useDispatch();
  const router = useRouter();

  const airports: Airport[] = [
    { code: 'DAC', name: 'Dhaka, Bangladesh', airport: 'Hazrat Shahjalal Int...' },
    { code: 'CXB', name: "Cox's Bazar, Bangladesh", airport: "Cox's Bazar" },
    { code: 'JSR', name: 'Jessore, Bangladesh', airport: 'Jessore Airport' },
    { code: 'CGP', name: 'Chittagong, Bangladesh', airport: 'Shah Amanat International Airport' },
    { code: 'SPD', name: 'Saidpur, Bangladesh', airport: 'Saidpur Airport' },
    { code: 'ZYL', name: 'Sylhet, Bangladesh', airport: 'Osmani International Airport' },
  ];

  const filteredOriginAirports = useMemo(() => {
    return airports.filter((airport) =>
      airport.name.toLowerCase().includes(originSearch.toLowerCase()) ||
      airport.code.toLowerCase().includes(originSearch.toLowerCase())
    );
  }, [originSearch]);

  const filteredDestinationAirports = useMemo(() => {
    return airports.filter((airport) =>
      airport.name.toLowerCase().includes(destinationSearch.toLowerCase()) ||
      airport.code.toLowerCase().includes(destinationSearch.toLowerCase())
    );
  }, [destinationSearch]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const today = new Date('2025-06-29T15:14:00+06:00');
    const departure = new Date(formData.departureDate);
    const returnDate = formData.returnDate ? new Date(formData.returnDate) : null;

    if (formData.origin.toUpperCase() === formData.destination.toUpperCase()) {
      setSameCityError(true);
      alert('Departure and arrival cities cannot be the same.');
      return;
    }
    setSameCityError(false);

    if (isNaN(departure.getTime()) || departure < today) {
      alert('Departure date must be in the future.');
      return;
    }
    if (formData.tripType === 'RoundTrip' && returnDate && returnDate < departure) {
      alert('Return date must be after departure date.');
      return;
    }
    if (formData.adults < 1) {
      alert('At least one adult is required.');
      return;
    }
    if (formData.infant > formData.adults) {
      alert('Number of infants cannot exceed number of adults.');
      return;
    }

    const requestBody = {
      origin: formData.origin,
      destination: formData.destination,
      departureDate: new Date(formData.departureDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      returnDate: formData.returnDate
        ? new Date(formData.returnDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
        : undefined,
      passenger: {
        adult: formData.adults,
        children: formData.children,
        infant: formData.infant,
      },
      tripType: formData.tripType,
    };

    dispatch(setSearchParams(formData));
    router.push('/search');
  };

  const handleTripTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      tripType: value as FormData['tripType'],
      returnDate: value === 'RoundTrip' && !prev.returnDate ? prev.departureDate : prev.returnDate,
    }));
  };

  const handleSwapCities = () => {
    if (formData.origin.toUpperCase() === formData.destination.toUpperCase()) {
      setSameCityError(true);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
    setSameCityError(false);
  };

  const handleSelectOrigin = (airport: Airport) => {
    setFormData((prev) => ({ ...prev, origin: airport.name }));
    setShowOriginDropdown(false);
    setOriginSearch('');
  };

  const handleSelectDestination = (airport: Airport) => {
    setFormData((prev) => ({ ...prev, destination: airport.name }));
    setShowDestinationDropdown(false);
    setDestinationSearch('');
  };

  const totalPassengers = formData.adults + formData.children + formData.infant;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-7xl mx-auto">
      <div className="text-start text-gray-800">
        {/* Trip Type Selection */}
        <div className="mb-6">
          <RadioGroup
            value={formData.tripType}
            onValueChange={handleTripTypeChange}
            className="flex space-x-6"
          >
            {['OneWay', 'RoundTrip', 'MultiCity'].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <RadioGroupItem value={type} id={type.toLowerCase()} />
                <label
                  htmlFor={type.toLowerCase()}
                  className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {type === 'OneWay' ? 'One Way' : type === 'RoundTrip' ? 'Round Trip' : 'Multi City'}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0"
        >
          {/* Origin */}
          <div className="relative flex-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Departure City</label>
            <div
              className={`flex items-center h-[65px] p-3 border ${sameCityError ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors`}
              onClick={() => setShowOriginDropdown(!showOriginDropdown)}
            >
              <span className="text-blue-600 mr-2">✈️</span>
              <span className="text-sm font-medium">{formData.origin}</span>
            </div>
            {showOriginDropdown && (
              <div className="absolute z-20 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                <Input
                  type="text"
                  placeholder="Search city or code..."
                  value={originSearch}
                  onChange={(e) => setOriginSearch(e.target.value)}
                  className="p-2 m-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {filteredOriginAirports.length > 0 ? (
                  filteredOriginAirports.map((airport) => (
                    <div
                      key={airport.code}
                      className="p-3 text-sm hover:bg-blue-50 cursor-pointer transition-colors"
                      onClick={() => handleSelectOrigin(airport)}
                    >
                      <div className="font-medium">{airport.name}</div>
                      <div className="text-xs text-gray-500">{airport.airport} ({airport.code})</div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-sm text-gray-500">No results found</div>
                )}
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex justify-center md:mt-6">
            <Button
              type="button"
              onClick={handleSwapCities}
              className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
              title="Swap cities"
            >
              <LuArrowRightLeft  className="w-5 h-5 text-blue-600" />
            </Button>
          </div>

          {/* Destination */}
          <div className="relative flex-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Arrival City</label>
            <div
              className={`flex items-center h-[65px] p-3 border ${sameCityError ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors`}
              onClick={() => setShowDestinationDropdown(!showDestinationDropdown)}
            >
              <span className="text-blue-600 mr-2">✈️</span>
              <span className="text-sm font-medium">{formData.destination}</span>
            </div>
            {showDestinationDropdown && (
              <div className="absolute z-20 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                <Input
                  type="text"
                  placeholder="Search city or code..."
                  value={destinationSearch}
                  onChange={(e) => setDestinationSearch(e.target.value)}
                  className="p-2 m-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {filteredDestinationAirports.length > 0 ? (
                  filteredDestinationAirports.map((airport) => (
                    <div
                      key={airport.code}
                      className="p-3 text-sm hover:bg-blue-50 cursor-pointer transition-colors"
                      onClick={() => handleSelectDestination(airport)}
                    >
                      <div className="font-medium">{airport.name}</div>
                      <div className="text-xs text-gray-500 ">{airport.airport} ({airport.code})</div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-sm text-gray-500">No results found</div>
                )}
              </div>
            )}
          </div>

          {/* Departure Date */}
          <div className="flex-1 ">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Departure</label>
            <div className="flex items-center p-3 h-[65px] border border-gray-300 rounded-lg bg-white">
              <span className="text-blue-600 mr-2">📅</span>
              <input
                type="date"
                value={formData.departureDate}
                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                className="w-full p-0 border-none bg-transparent focus:outline-none text-sm"
                required
                min="2025-06-29"
              />
            </div>
          </div>

          {/* Return Date */}
          {formData.tripType === 'RoundTrip' && (
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Return</label>
              <div className="flex h-[65px] items-center p-3 border border-gray-300 rounded-lg bg-white">
                <span className="text-blue-600 mr-2">📅</span>
                <input
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                  className="w-full p-0 border-none bg-transparent focus:outline-none text-sm"
                  min={formData.departureDate || '2025-06-29'}
                />
              </div>
            </div>
          )}

          {/* Travelers/Class */}
          <div className="flex-1 ">
            <label className="block text-xs  font-semibold text-gray-600 mb-1">Travelers/Class</label>
            <Popover open={showPassengerDropdown} onOpenChange={setShowPassengerDropdown}>
              <PopoverTrigger asChild>
                <div className="flex items-center h-[65px] p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                  <span className="text-blue-600 mr-2">👤</span>
                  <span className="text-sm font-medium">
                    {totalPassengers} Traveler{totalPassengers !== 1 ? 's' : ''}, Economy
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4 bg-white border border-gray-300 rounded-lg shadow-xl">
                <div className="space-y-4">
                  {/* Adults */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Adults (12+)</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            adults: Math.max(1, prev.adults - 1),
                          }))
                        }
                        disabled={formData.adults <= 1}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{formData.adults}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            adults: Math.min(5, prev.adults + 1),
                          }))
                        }
                        disabled={formData.adults >= 5}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Children (2-11)</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            children: Math.max(0, prev.children - 1),
                          }))
                        }
                        disabled={formData.children <= 0}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{formData.children}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            children: Math.min(5, prev.children + 1),
                          }))
                        }
                        disabled={formData.children >= 5}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Infants */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Infants (0-2)</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            infant: Math.max(0, prev.infant - 1),
                          }))
                        }
                        disabled={formData.infant <= 0}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{formData.infant}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            infant: Math.min(prev.adults, prev.infant + 1),
                          }))
                        }
                        disabled={formData.infant >= formData.adults}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="button"
                    className="w-full  bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => setShowPassengerDropdown(false)}
                  >
                    Done
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Search Button */}
          <div className="md:mt-6">
            <Button
              type="submit"
              className="w-full md:w-auto bg-blue-600 h-[65px] text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-sm font-semibold transition-colors"
            >
              <IoIosSearch />
Search Flights
            </Button>
          </div>
        </form>

        {sameCityError && (
          <p className="mt-2 text-sm text-red-600">Departure and arrival cities cannot be the same.</p>
        )}
      </div>
    </div>
  );
}