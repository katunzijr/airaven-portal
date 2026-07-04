export type PropertyType =
  | "house"
  | "apartment"
  | "room"
  | "hall"
  | "frame"
  | "villa"
  | "cabin"
  | "cottage"
  | "beachfront"
  | "business"
  | "plot";

export interface PropertyListing {
  id: string;
  propertyId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  features: string[];
  images: string[];
  quantity: number;
  sortOrder: number;
  instantBook: boolean;
  status: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  images: string[];
  coverImages?: string[];
  price: number;
  fromPrice?: number;
  listingCount?: number;
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
  listings?: PropertyListing[];
  status?: string;
  canReview?: boolean;
  hasReviewed?: boolean;
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
  listingId?: string;
  listing?: PropertyListing;
  property: Property;
  checkIn: string;
  checkOut: string;
  guests: number;
  units?: number;
  totalPrice: number;
  currency?: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  paymentStatus?: "pending" | "paid" | "failed" | "cancelled";
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
