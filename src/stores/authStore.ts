import { safeStorage } from '../storage/safeStorage';
import axios from 'axios';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import * as authService from '../services/authService';
import { setTokenRefresher } from '../services/api';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  readTokenExpiry,
  saveTokens,
} from '../services/tokenService';
import { toAuthUser, toOAuthUser } from '../utils/memberMapper';
import type {
  AuthUser,
  LoginCredentials,
  OAuthProfile,
  RegisterData,
} from '../types';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isRestoring: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (account: RegisterData) => Promise<void>;
  signInWithOAuth: (profile: OAuthProfile, accessToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  restoreSession: () => Promise<void>;
  clearError: () => void;
}

function describeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    if (status === 400 || status === 401) {
      return 'Usuario o contraseña incorrectos.';
    }

    if (status === 429) {
      return 'Demasiados intentos seguidos. Espera un momento y vuelve a probar.';
    }

    if (error.code === 'ECONNABORTED') {
      return 'La conexión tardó demasiado. Revisa tu internet e inténtalo de nuevo.';
    }

    return 'No pudimos conectar con el servicio de autenticación.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocurrió un error inesperado al iniciar sesión.';
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isRestoring: true,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.login(credentials);

          await saveTokens({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });

          set({
            user: toAuthUser(response),
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ error: describeError(error), isLoading: false });
          throw error;
        }
      },

      register: async (account) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.register(account);

          await saveTokens({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });

          set({
            user: toAuthUser(response),
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ error: describeError(error), isLoading: false });
          throw error;
        }
      },

      signInWithOAuth: async (profile, accessToken) => {
        await saveTokens({ accessToken, refreshToken: '' });
        set({
          user: toOAuthUser(profile),
          isAuthenticated: true,
          error: null,
        });
      },

      logout: async () => {
        await clearTokens();
        set({ user: null, isAuthenticated: false, error: null });
      },

      refreshTokens: async () => {
        try {
          const refreshToken = await getRefreshToken();

          if (refreshToken === null || refreshToken === '') {
            await get().logout();
            return;
          }

          const tokens = await authService.refreshTokens(refreshToken);
          await saveTokens(tokens);
          set({ error: null });
        } catch (error) {
          set({ error: describeError(error) });
          await get().logout();
        }
      },

      restoreSession: async () => {
        try {
          const token = await getAccessToken();

          if (token === null || token === '') {
            set({ user: null, isAuthenticated: false });
            return;
          }

          const expiry = readTokenExpiry(token);
          const now = Math.floor(Date.now() / 1000);

          if (expiry !== null && expiry <= now) {
            await get().refreshTokens();
            return;
          }

          set({ isAuthenticated: get().user !== null });
        } catch {
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isRestoring: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'nido.auth',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

setTokenRefresher(async () => {
  const refreshToken = await getRefreshToken();

  if (refreshToken === null || refreshToken === '') {
    return null;
  }

  try {
    const tokens = await authService.refreshTokens(refreshToken);
    await saveTokens(tokens);
    return tokens.accessToken;
  } catch {
    await useAuthStore.getState().logout();
    return null;
  }
});
