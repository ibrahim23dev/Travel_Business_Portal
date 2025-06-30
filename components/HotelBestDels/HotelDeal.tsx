// Defines the structure for a single hotel deal
export interface HotelDeal {
  id: number;
  name: string;
  location: string; // Used for filtering by tab
  imageUrl: string;
  rating: number;
  reviews: number; // Example: (123 Ratings)
  price: number;
  durationDays: number;
  exploreUrl: string;
}

// Mock data for the hotel deals
export const hotelDeals: HotelDeal[] = [
  {
    id: 1,
    name: "Sea Pearl Beach Resort & Spa Cox's Bazar",
    location: "Cox's Bazar",
    // Using a high-quality online image
    imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 4.5,
    reviews: 150,
    price: 980.00,
    durationDays: 7,
    exploreUrl: "#",
  },
  {
    id: 2,
    name: "Bhawal Resort & Spa",
    location: "Sayeman", // Assuming this is under the "Sayeman" tab for variety
    // Using a high-quality online image
    imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1925&q=80",
    rating: 5,
    reviews: 210,
    price: 980.00,
    durationDays: 7,
    exploreUrl: "#",
  },
  {
    id: 3,
    name: "Grand Sylhet Hotel & Resort",
    location: "Grand Sultan", // Assuming this is under "Grand Sultan"
    // Using a high-quality online image
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 4.0,
    reviews: 95,
    price: 980.00,
    durationDays: 7,
    exploreUrl: "#",
  },
  {
    id: 4,
    name: "Grand Sylhet Hotel & Resort",
    location: "Cox's Bazar", // Assuming this is under "Grand Sultan"
    // Using a high-quality online image
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 4.0,
    reviews: 95,
    price: 980.00,
    durationDays: 7,
    exploreUrl: "#",
  },
  {
    id: 5,
    name: "Grand Sylhet Hotel & Resort",
    location: "Cox's Bazar", // Assuming this is under "Grand Sultan"
    // Using a high-quality online image
    imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1925&q=80",
    rating: 4.0,
    reviews: 95,
    price: 980.00,
    durationDays: 7,
    exploreUrl: "#",
  },
   // Add more hotels for other tabs if needed
];

// Define the tabs for filtering
export const locationTabs = ["Cox's Bazar", "Sayeman", "Seagull", "Western", "Grand Sultan"];