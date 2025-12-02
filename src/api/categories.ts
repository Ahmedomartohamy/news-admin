import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from './client';
import { ApiResponse, Category } from '../types';
import { QUERY_KEYS } from '../utils/constants';

interface CreateCategoryRequest {
  name: string;
  slug?: string;
  description?: string;
  parentId?: string;
}

interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  description?: string;
  parentId?: string;
}

export const useCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
      return response.data.data;
    },
  });
};

export const useCategoryTree = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.CATEGORIES, 'tree'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Category[]>>('/categories/tree');
      return response.data.data;
    },
  });
};

export const useCategory = (slug: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.CATEGORIES, slug],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Category>>(`/categories/${slug}`);
      return response.data.data;
    },
    enabled: !!slug,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategoryRequest) => {
      const response = await apiClient.post<ApiResponse<Category>>('/categories', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCategoryRequest }) => {
      const response = await apiClient.put<ApiResponse<Category>>(`/categories/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
    },
  });
};
