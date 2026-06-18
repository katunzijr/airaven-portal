import type { Booking, Category, Property, Trip } from '@/types';
import type { AvailabilityRange } from '@/types/host';
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
  return unwrap(api.get<ApiEnvelope<Category[]>>('/categories'));
}

export async function fetchProperties(params?: Record<string, string | number | boolean>): Promise<Property[]> {
  if (!isApiConfigured()) throw new Error('VITE_API_BASE_URL is not set');
  return unwrap(api.get<ApiEnvelope<Property[]>>('/properties', { params }));
}

export async function fetchProperty(id: string): Promise<Property> {
  if (!isApiConfigured()) throw new Error('VITE_API_BASE_URL is not set');
  return unwrap(api.get<ApiEnvelope<Property>>(`/properties/${encodeURIComponent(id)}`));
}

export async function fetchTrips(type?: string): Promise<Trip[]> {
  if (!isApiConfigured()) throw new Error('VITE_API_BASE_URL is not set');
  const params = type && type !== 'all' ? { type } : undefined;
  return unwrap(api.get<ApiEnvelope<Trip[]>>('/trips', { params }));
}

export async function fetchTrip(id: string): Promise<Trip> {
  if (!isApiConfigured()) throw new Error('VITE_API_BASE_URL is not set');
  return unwrap(api.get<ApiEnvelope<Trip>>(`/trips/${encodeURIComponent(id)}`));
}

export async function fetchBookings(): Promise<Booking[]> {
  if (!isApiConfigured()) throw new Error('VITE_API_BASE_URL is not set');
  return unwrap(api.get<ApiEnvelope<Booking[]>>('/bookings'));
}

export async function fetchBooking(id: string): Promise<Booking> {
  if (!isApiConfigured()) throw new Error('VITE_API_BASE_URL is not set');
  return unwrap(api.get<ApiEnvelope<Booking>>(`/bookings/${encodeURIComponent(id)}`));
}

export async function startBookingCheckout(payload: {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}): Promise<{ bookingId: string; redirectUrl: string; totalPrice: number; currency: string }> {
  if (!isApiConfigured()) throw new Error('VITE_API_BASE_URL is not set');
  return unwrap(api.post<ApiEnvelope<{ bookingId: string; redirectUrl: string; totalPrice: number; currency: string }>>('/bookings/checkout', payload));
}

export async function fetchPropertyAvailability(propertyId: string): Promise<AvailabilityRange[]> {
  if (!isApiConfigured()) throw new Error('VITE_API_BASE_URL is not set');
  return unwrap(
    api.get<ApiEnvelope<AvailabilityRange[]>>(`/properties/${encodeURIComponent(propertyId)}/availability`),
  );
}

export async function createBooking(payload: {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status?: Booking['status'];
}): Promise<Booking> {
  if (!isApiConfigured()) throw new Error('VITE_API_BASE_URL is not set');
  return unwrap(api.post<ApiEnvelope<Booking>>('/bookings', payload));
}
