import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from './client';
import { ApiResponse, Tag } from '../types';
import { QUERY_KEYS } from '../utils/constants';

interface CreateTagRequest {
  name: string;
  slug?: string;
}

interface UpdateTagRequest {
  name?: string;
  slug?: string;
}

export const useTags = () => {
  return useQuery({
    queryKey: QUERY_KEYS.TAGS,
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Tag[]>>('/tags');
      return response.data.data;
    },
  });
};

export const usePopularTags = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.TAGS, 'popular'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Tag[]>>('/tags/popular');
      return response.data.data;
    },
  });
};

export const useTag = (slug: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.TAGS, slug],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Tag>>(`/tags/${slug}`);
      return response.data.data;
    },
    enabled: !!slug,
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTagRequest) => {
      const response = await apiClient.post<ApiResponse<Tag>>('/tags', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TAGS });
    },
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTagRequest }) => {
      const response = await apiClient.put<ApiResponse<Tag>>(`/tags/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TAGS });
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/tags/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TAGS });
    },
  });
};
