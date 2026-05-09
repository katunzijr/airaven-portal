export type PropertyType = "house" | "apartment" | "room" | "hall" | "frame" | "villa" | "cabin" | "cottage";

export type TripType = "adventure" | "cultural" | "food" | "nature" | "city" | "wellness";

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  images: string[];
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  location: {
    city: string;
    country: string;
    address: string;
    lat: number;
    lng: number;
  };
  host: {
    id: string;
    name: string;
    avatar: string;
    superhost: boolean;
  };
  amenities: string[];
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  isFavorite: boolean;
  tags: string[];
  checkIn: string;
  checkOut: string;
  cancellationPolicy: string;
  instantBook: boolean;
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  type: TripType;
  images: string[];
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  duration: string;
  location: {
    city: string;
    country: string;
  };
  host: {
    id: string;
    name: string;
    avatar: string;
  };
  maxGroupSize: number;
  includes: string[];
  languages: string[];
  isFavorite: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

export interface SearchFilters {
  location: string;
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  type: PropertyType | "all";
  priceMin: number;
  priceMax: number;
  instantBook: boolean;
  superhost: boolean;
}

export interface Booking {
  id: string;
  propertyId: string;
  property: Property;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  joinedDate: string;
  wishlist: string[];
  bookings: Booking[];
}
