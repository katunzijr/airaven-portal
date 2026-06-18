import type { Property } from '@/types';
import type {
  AvailabilityRange,
  CreateHostProfilePayload,
  CreatePropertyPayload,
  HostProfile,
  UpdateListingPayload,
} from '@/types/host';
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

function assertApi(): void {
  if (!isApiConfigured()) throw new Error('VITE_API_BASE_URL is not set');
}

export async function getHostProfile(): Promise<HostProfile | null> {
  assertApi();
  try {
    return await unwrap(api.get<ApiEnvelope<HostProfile>>('/hosts/me'));
  } catch (err) {
    if (err instanceof Error && err.message.includes('not found')) return null;
    throw err;
  }
}

export async function createHostProfile(payload: CreateHostProfilePayload): Promise<HostProfile> {
  assertApi();
  return unwrap(api.post<ApiEnvelope<HostProfile>>('/hosts/me', payload));
}

export async function createHostProperty(payload: CreatePropertyPayload): Promise<Property> {
  assertApi();
  return unwrap(api.post<ApiEnvelope<Property>>('/hosts/me/properties', payload));
}

export async function updateHostListing(
  propertyId: string,
  payload: UpdateListingPayload,
): Promise<Property> {
  assertApi();
  return unwrap(
    api.patch<ApiEnvelope<Property>>(`/hosts/me/properties/${encodeURIComponent(propertyId)}/listing`, payload),
  );
}

export async function setHostAvailability(
  propertyId: string,
  ranges: AvailabilityRange[],
): Promise<AvailabilityRange[]> {
  assertApi();
  return unwrap(
    api.put<ApiEnvelope<AvailabilityRange[]>>(
      `/hosts/me/properties/${encodeURIComponent(propertyId)}/availability`,
      { ranges },
    ),
  );
}

export async function publishHostListing(propertyId: string): Promise<Property> {
  assertApi();
  return unwrap(
    api.post<ApiEnvelope<Property>>(`/hosts/me/properties/${encodeURIComponent(propertyId)}/publish`),
  );
}

export async function fetchPropertyAvailability(propertyId: string): Promise<AvailabilityRange[]> {
  assertApi();
  return unwrap(
    api.get<ApiEnvelope<AvailabilityRange[]>>(`/properties/${encodeURIComponent(propertyId)}/availability`),
  );
}
