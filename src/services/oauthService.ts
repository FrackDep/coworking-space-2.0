import * as AuthSession from 'expo-auth-session';

import type { AuthTokens, OAuthProfile } from '../types';

const GITHUB_CLIENT_ID = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID ?? '';

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_URL = 'https://api.github.com/user';

export const oauthRedirectUri = AuthSession.makeRedirectUri({
  scheme: 'coworking-space',
  path: 'auth',
});

export const githubDiscovery = {
  authorizationEndpoint: GITHUB_AUTHORIZE_URL,
  tokenEndpoint: GITHUB_TOKEN_URL,
} as const;

export const githubClientId = GITHUB_CLIENT_ID;

export const githubScopes = ['read:user', 'user:email'];

export function isGithubConfigured(): boolean {
  return GITHUB_CLIENT_ID !== '';
}

interface GithubTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface GithubUserResponse {
  id: number;
  login: string;
  name?: string | null;
  email?: string | null;
  avatar_url?: string;
}

async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string,
): Promise<AuthTokens> {
  const response = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      code,
      code_verifier: codeVerifier,
      redirect_uri: oauthRedirectUri,
    }),
  });

  const data = (await response.json()) as GithubTokenResponse;

  if (data.access_token === undefined) {
    throw new Error(data.error_description ?? 'GitHub rechazó el código de autorización');
  }

  return { accessToken: data.access_token, refreshToken: '' };
}

async function fetchGithubProfile(accessToken: string): Promise<OAuthProfile> {
  const response = await fetch(GITHUB_USER_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
    },
  });

  if (!response.ok) {
    throw new Error('No pudimos leer tu perfil de GitHub');
  }

  const data = (await response.json()) as GithubUserResponse;
  const parts = (data.name ?? data.login).split(' ');

  return {
    id: data.id,
    username: data.login,
    email: data.email ?? `${data.login}@users.noreply.github.com`,
    firstName: parts[0],
    lastName: parts.slice(1).join(' ') || 'GitHub',
    image: data.avatar_url ?? '',
  };
}

export interface GithubSignInResult {
  profile: OAuthProfile;
  accessToken: string;
}

export async function completeGithubSignIn(
  code: string,
  codeVerifier: string,
): Promise<GithubSignInResult> {
  const tokens = await exchangeCodeForTokens(code, codeVerifier);
  const profile = await fetchGithubProfile(tokens.accessToken);

  return { profile, accessToken: tokens.accessToken };
}
