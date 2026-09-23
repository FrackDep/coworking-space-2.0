import { deleteSecret, readSecret, saveSecret } from '../storage/secureStore';
import { jwtDecode } from 'jwt-decode';

import type { AuthTokens, JwtPayload } from '../types';

const ACCESS_KEY = 'nido.auth.accessToken';
const REFRESH_KEY = 'nido.auth.refreshToken';

export const DEMO_TOKEN_PREFIX = 'demo';

export function isDemoToken(token: string): boolean {
  return token.startsWith(DEMO_TOKEN_PREFIX);
}

export async function saveTokens(tokens: AuthTokens): Promise<void> {
  await Promise.all([
    saveSecret(ACCESS_KEY, tokens.accessToken),
    saveSecret(REFRESH_KEY, tokens.refreshToken),
  ]);
}

export async function getAccessToken(): Promise<string | null> {
  return readSecret(ACCESS_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return readSecret(REFRESH_KEY);
}

export async function clearTokens(): Promise<void> {
  await Promise.all([
    deleteSecret(ACCESS_KEY),
    deleteSecret(REFRESH_KEY),
  ]);
}

export function readTokenExpiry(token: string): number | null {
  try {
    const payload = jwtDecode<JwtPayload>(token);
    return payload.exp ?? null;
  } catch {
    return null;
  }
}

export function readTokenClaims(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}
