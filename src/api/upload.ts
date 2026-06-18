import { api, isApiConfigured } from '@/api/client';

interface UploadResponse {
  urls: string[];
}

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export async function uploadListingImages(files: File[]): Promise<string[]> {
  if (!isApiConfigured()) throw new Error('VITE_API_BASE_URL is not set');
  if (!files.length) return [];

  const formData = new FormData();
  for (const file of files) {
    formData.append('images', file);
  }

  const { data } = await api.post<ApiEnvelope<UploadResponse>>('/uploads/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  if (!data.success || !data.data?.urls) {
    throw new Error(data.message ?? 'Upload failed');
  }

  return data.data.urls;
}
