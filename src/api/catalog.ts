import type { Booking, Category, Property, Trip } from '@/types';
import { api, isApiConfigured } from '@/api/client';

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data?: T;
}

async function unwrap<T>(promise: Promise<{ data: ApiEnvelope<T> }>): Promise<T> {
  const { data } = await promise;
  if (!data.success || data.data === undefined) {
    throw new Error(data.message ?? 'API error');
  }
  return data.data;
}

export async function fetchCategories(): Promise<Category[]> {
  if (!isApiConfigured()) throw new Error('VITE_API_BASE_URL is not set');
  return unwrap(api.get<Category[]>('/categories'));
}

export async function fetchProperties(params?: Record<string, string | number | boolean>): Promise<Property[]> {
  if (!isApiConfigured()) throw new Error('VITE_API_BASE_URL is not set');
  return unwrap(api.get<Property[]>('/properties', { params }));
}

export async function fetchProperty(id: string): Promise<Property> {
  if (!isApiConfigured()) throw new Error('VITE_API_BASE_URL is not set');
  return unwrap(api.get<Property>(`/properties/${encodeURIComponent(id)}`));
}

export async function fetchTrips(type?: string): Promise<Trip[]> {
  if (!isApiConfigured()) throw new Error('VITE_API_BASE_URL is not set');
  const params = type && type !== 'all' ? { type } : undefined;
  return unwrap(api.get<Trip[]>('/trips', { params }));
}

export async function fetchTrip(id: string): Promise<Trip> {
  if (!isApiConfigured()) throw new Error('VITE_API_BASE_URL is not set');
  return unwrap(api.get<Trip>(`/trips/${encodeURIComponent(id)}`));
}

export async function fetchBookings(userId: string): Promise<Booking[]> {
  if (!isApiConfigured()) throw new Error('VITE_API_BASE_URL is not set');
  return unwrap(api.get<Booking[]>('/bookings', { params: { userId } }));
}

export async function createBooking(payload: {
  propertyId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status?: Booking['status'];
}): Promise<Booking> {
  if (!isApiConfigured()) throw new Error('VITE_API_BASE_URL is not set');
  return unwrap(api.post<Booking>('/bookings', payload));
}
