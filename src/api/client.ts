import axios from 'axios';

const baseURL =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL
    ? String(import.meta.env.VITE_API_BASE_URL).replace(/\/$/, '')
    : '';

/** Axios client for Airaven backend (`airaven-backend`). Leave base URL empty to skip HTTP calls. */
export const api = axios.create({
  baseURL: baseURL ? `${baseURL}/api/v1` : '',
  timeout: 20_000,
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.response.use(
  (res) => res,
  (err: unknown) => {
    if (axios.isAxiosError(err)) {
      return Promise.reject(
        new Error(err.response?.data?.message ?? err.message ?? 'Request failed'),
      );
    }
    return Promise.reject(err instanceof Error ? err : new Error('Request failed'));
  },
);

export function isApiConfigured(): boolean {
  return Boolean(baseURL);
}
