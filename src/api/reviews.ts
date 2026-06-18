import type { Review } from '@/types';
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

export async function fetchPropertyReviews(propertyId: string): Promise<Review[]> {
  if (!isApiConfigured()) return [];
  return unwrap(
    api.get<ApiEnvelope<Review[]>>('/reviews', { params: { propertyId } }),
  );
}

export async function createPropertyReview(payload: {
  propertyId: string;
  rating: number;
  comment: string;
}): Promise<Review> {
  if (!isApiConfigured()) throw new Error('VITE_API_BASE_URL is not set');
  return unwrap(api.post<ApiEnvelope<Review>>('/reviews', payload));
}
