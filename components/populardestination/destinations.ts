// /data/destinations.ts

// TypeScript interface for a single destination
export interface Destination {
  id: number;
  name: string;
  image: string;
  rating: number;
  reviews: number;
}

// Array of destination data
export const popularDestinations: Destination[] = [
  {
    id: 1,
    name: 'Singapore',
    image: 'https://images.pexels.com/photos/220794/pexels-photo-220794.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 4.4,
    reviews: 11788,
  },
  {
    id: 2,
    name: 'Malaysia',
    image: 'https://images.pexels.com/photos/3727255/pexels-photo-3727255.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 4.4,
    reviews: 11788,
  },
  {
    id: 3,
    name: 'Indonesia',
    image: 'https://images.pexels.com/photos/3727255/pexels-photo-3727255.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 4.4,
    reviews: 11788,
  },
];

// Data for the special "call to action" card
export const callToActionCard = {
  image: 'https://images.pexels.com/photos/3727255/pexels-photo-3727255.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
};