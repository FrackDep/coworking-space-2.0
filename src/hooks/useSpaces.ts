import { useState } from 'react';
import { getItem, setItem } from '../storage/safeStorage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '../services/api';
import { cachedSpacesKey } from '../storage/mmkv';
import type {
  CreateSpacePayload,
  Space,
  SpacePost,
  UpdateSpacePayload,
} from '../types';
import { parseCache, serializeCache } from '../utils/spaceCache';
import { toPost, toSpace } from '../utils/spaceMapper';

export const SPACES_QUERY_KEY = ['spaces'] as const;

interface UseSpacesResult {
  data: Space[] | undefined;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  isFromCache: boolean;
  refetch: () => void;
}

export function useSpaces(): UseSpacesResult {
  const [isFromCache, setIsFromCache] = useState(false);

  const query = useQuery<Space[]>({
    queryKey: SPACES_QUERY_KEY,
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<SpacePost[]>('/posts', {
          params: { _limit: 20 },
        });
        const spaces = data.map(toSpace);

        await setItem(cachedSpacesKey, serializeCache(spaces));
        setIsFromCache(false);

        return spaces;
      } catch (error) {
        const raw = await getItem(cachedSpacesKey);

        if (raw !== null) {
          setIsFromCache(true);
          return parseCache(raw);
        }

        throw error;
      }
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching,
    isFromCache,
    refetch: query.refetch,
  };
}

export function useSpaceById(id: string) {
  return useQuery<Space>({
    queryKey: [...SPACES_QUERY_KEY, id],
    queryFn: async () => {
      const { data } = await apiClient.get<SpacePost>(`/posts/${id}`);
      return toSpace(data);
    },
    enabled: id !== '',
  });
}

export function useCreateSpace() {
  const queryClient = useQueryClient();

  return useMutation<SpacePost, Error, CreateSpacePayload>({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post<SpacePost>('/posts', toPost(payload));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SPACES_QUERY_KEY });
    },
    onError: (error) => {
      console.error('No se pudo crear el espacio:', error.message);
    },
  });
}

export function useUpdateSpace() {
  const queryClient = useQueryClient();

  return useMutation<SpacePost, Error, UpdateSpacePayload>({
    mutationFn: async (payload) => {
      const { data } = await apiClient.put<SpacePost>(
        `/posts/${payload.id}`,
        toPost(payload),
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: SPACES_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...SPACES_QUERY_KEY, variables.id],
      });
    },
    onError: (error) => {
      console.error('No se pudo actualizar el espacio:', error.message);
    },
  });
}
