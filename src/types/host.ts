import type { Property, PropertyType } from '@/types';

export interface HostProfile {
  id: string;
  userId: string;
  displayName: string;
  bio: string;
  avatar: string | null;
  phone: string | null;
  superhost: boolean;
  createdAt: string;
}

export interface AvailabilityRange {
  id?: string;
  propertyId?: string;
  startDate: string;
  endDate?: string;
  status: 'available' | 'blocked';
}

export interface CreateHostProfilePayload {
  displayName?: string;
  bio?: string;
  phone?: string;
  avatar?: string;
}

export interface CreatePropertyPayload {
  type: PropertyType;
  location: Property['location'];
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities?: string[];
}

export interface UpdateListingPayload {
  title: string;
  description: string;
  images: string[];
  price: number;
  checkIn?: string;
  checkOut?: string;
  cancellationPolicy?: string;
  instantBook?: boolean;
}
