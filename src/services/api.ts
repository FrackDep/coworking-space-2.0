import axios from 'axios';

import type { InternalAxiosRequestConfig } from 'axios';

import { getAccessToken } from './tokenService';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://jsonplaceholder.typicode.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

type TokenRefresher = () => Promise<string | null>;

let tokenRefresher: TokenRefresher | null = null;

export function setTokenRefresher(refresher: TokenRefresher): void {
  tokenRefresher = refresher;
}

interface RetryableConfig extends InternalAxiosRequestConfig {
  retried?: boolean;
}

apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();

  if (token !== null && token !== '') {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const config = error.config as RetryableConfig | undefined;
    const isUnauthorized = error.response?.status === 401;

    if (
      isUnauthorized &&
      config !== undefined &&
      config.retried !== true &&
      tokenRefresher !== null
    ) {
      config.retried = true;
      const newToken = await tokenRefresher();

      if (newToken !== null) {
        config.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(config);
      }
    }

    if (__DEV__) {
      console.error('[API Error]', error.response?.status, error.config?.url);
    }

    return Promise.reject(error);
  },
);
