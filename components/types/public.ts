export interface ExclusiveOffers {
  id: number;
  code: string;
  discount: string;
  discount_type: string;
  title: string;
  summary: string;
  thumbnail: string;
  image: string;
  homepage_thumbnail: string;
  promotion_type: string;
  type: string;
  link: string;
  is_domestic: boolean;
}

export interface HomePageInfo {

  //placesInBangladesh: PlacesInBangladesh[] | [];
  //topAirlines: TopAirlines[] | [];
  popularDestinations: PopularDestination[];
  isLoading: boolean;

  exclusiveOffers: any[];

  //hotelDeals: HotelDeals[] | [];E
  //tourPackages: TourPackages[] | [];
  //popularRoutes: PopularRoutes[] | [];
}

export interface PopularDestination {
  name: string;
  code: string;
  image: string;
  rating: number;
  reviewCount: number;
  number_of_properties: number;
}