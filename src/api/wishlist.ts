import type { Property } from '@/types';
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

export async function fetchWishlist(): Promise<Property[]> {
  if (!isApiConfigured()) throw new Error('VITE_API_BASE_URL is not set');
  return unwrap(api.get<ApiEnvelope<Property[]>>('/wishlist'));
}

export async function toggleWishlist(
  propertyId: string,
): Promise<{ saved: boolean; wishlist: string[] }> {
  if (!isApiConfigured()) throw new Error('VITE_API_BASE_URL is not set');
  return unwrap(
    api.post<ApiEnvelope<{ saved: boolean; wishlist: string[] }>>(
      `/wishlist/${encodeURIComponent(propertyId)}/toggle`,
    ),
  );
}
