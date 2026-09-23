import axios from 'axios';

import { apiClient } from './api';
import { isDemoToken } from './tokenService';
import type { AuthResponse, AuthTokens, LoginCredentials, RegisterData } from '../types';

const AUTH_BASE_URL = 'https://dummyjson.com/auth';
const DEMO_DELAY_MS = 800;

export const DEMO_CREDENTIALS: LoginCredentials = {
  username: 'emilys',
  password: 'emilyspass',
};

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await axios.post<AuthResponse>(`${AUTH_BASE_URL}/login`, {
    username: credentials.username,
    password: credentials.password,
    expiresInMins: 30,
  });

  return data;
}

export async function register(account: RegisterData): Promise<AuthResponse> {
  await new Promise((resolve) => setTimeout(resolve, DEMO_DELAY_MS));

  const stamp = Date.now();

  return {
    id: 900000 + (stamp % 10000),
    username: account.username,
    email: account.email,
    firstName: account.firstName ?? account.username,
    lastName: account.lastName ?? 'Nido',
    image: '',
    accessToken: `demo-access-${stamp}`,
    refreshToken: `demo-refresh-${stamp}`,
  };
}

export async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  if (isDemoToken(refreshToken)) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const stamp = Date.now();

    return {
      accessToken: `demo-access-${stamp}`,
      refreshToken: `demo-refresh-${stamp}`,
    };
  }

  const { data } = await axios.post<AuthTokens>(`${AUTH_BASE_URL}/refresh`, {
    refreshToken,
    expiresInMins: 30,
  });

  return data;
}

export async function getProfile(): Promise<AuthResponse> {
  const { data } = await apiClient.get<AuthResponse>(`${AUTH_BASE_URL}/me`);
  return data;
}
