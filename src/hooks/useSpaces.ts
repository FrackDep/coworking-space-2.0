import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '../services/api';
import type {
  CreateSpacePayload,
  Space,
  SpacePost,
  UpdateSpacePayload,
} from '../types';
import { toPost, toSpace } from '../utils/spaceMapper';

export const SPACES_QUERY_KEY = ['spaces'] as const;

export function useSpaces() {
  return useQuery<Space[]>({
    queryKey: SPACES_QUERY_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get<SpacePost[]>('/posts', {
        params: { _limit: 20 },
      });
      return data.map(toSpace);
    },
  });
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
