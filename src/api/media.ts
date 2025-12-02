import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from './client';
import { ApiResponse, Media, MediaStats, PaginatedResponse } from '../types';
import { QUERY_KEYS } from '../utils/constants';

interface MediaParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const useMedia = (params?: MediaParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.MEDIA, params],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<Media>>('/media', { params });
      return response.data;
    },
  });
};

export const useMediaStats = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.MEDIA, 'stats'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<MediaStats>>('/media/stats');
      return response.data.data;
    },
  });
};

export const useUploadMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<ApiResponse<Media>>('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEDIA });
    },
  });
};

export const useUploadMultipleMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await apiClient.post<ApiResponse<Media[]>>('/media/upload-multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEDIA });
    },
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEDIA });
    },
  });
};
