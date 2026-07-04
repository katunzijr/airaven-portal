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
  listingId?: string;
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
  forceNew?: boolean;
}

export interface UpdatePropertyDetailsPayload {
  title: string;
  description: string;
  images: string[];
  checkIn?: string;
  checkOut?: string;
  cancellationPolicy?: string;
}

/** @deprecated alias */
export type UpdateListingPayload = UpdatePropertyDetailsPayload;

export interface CreateRoomListingPayload {
  name: string;
  description?: string;
  price: number;
  maxGuests: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  amenities?: string[];
  images?: string[];
  quantity?: number;
  instantBook?: boolean;
}

export interface UpdateRoomListingPayload {
  name?: string;
  description?: string;
  price?: number;
  maxGuests?: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  amenities?: string[];
  images?: string[];
  quantity?: number;
  instantBook?: boolean;
}

export type { PropertyListing } from '@/types';
