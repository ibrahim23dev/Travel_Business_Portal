import { createSlice } from '@reduxjs/toolkit';

interface FlightData {
  is_refundable: boolean;
  refsegment: string;
  holdable_status: number;
  air_logo: string;
  airline_name: string;
  currency: string;
  carrier: string;
  bookingclasscode: string;
  flight_name: string;
  airlinedesignator: string;
  flightnumber: string;
  equipmentcode: string;
  equipmenttext: string;
  departuredate: string;
  arrivaldate: string;
  origincode: string;
  destinationcode: string;
  duration: number;
  baggage_details: string;
  pax_baggage: { adult: string };
}

interface ItinDetails {
  origindestinationorder: number;
  fare_rule: string;
  layover: number;
  flight_data: FlightData[];
}

interface PriceInfo {
  base: number;
  total: number;
  currency: string;
}

interface Flight {
  is_refundable: boolean;
  travel_type: string;
  resultid: string;
  salecurrencycode: string;
  air_logo: string;
  itin_details: ItinDetails[];
  variants: any[];
  variant_count: number;
  price_info: PriceInfo;
}

interface SearchState {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  children: number;
  infant: number;
  results: Flight[];
}

const initialState: SearchState = {
  origin: '',
  destination: '',
  departureDate: '',
  returnDate: '',
  adults: 1,
  children: 0,
  infant: 0,
  results: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchParams: (state, action) => {
      return { ...state, ...action.payload };
    },
    setSearchResults: (state, action) => {
      state.results = action.payload;
    },
  },
});

export const { setSearchParams, setSearchResults } = searchSlice.actions;
export default searchSlice.reducer;