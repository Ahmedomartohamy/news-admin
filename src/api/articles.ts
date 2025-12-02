import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from './client';
import { ApiResponse, Article, PaginatedResponse } from '../types';
import { QUERY_KEYS } from '../utils/constants';

interface ArticlesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  categoryId?: string;
  authorId?: string;
}

interface CreateArticleRequest {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  categoryId?: string;
  tagIds?: string[];
}

interface UpdateArticleRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  categoryId?: string;
  tagIds?: string[];
}

export const useArticles = (params?: ArticlesParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ARTICLES, params],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<Article>>('/articles', { params });
      return response.data;
    },
  });
};

export const useArticle = (slug: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ARTICLES, slug],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Article>>(`/articles/${slug}`);
      return response.data.data;
    },
    enabled: !!slug,
  });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateArticleRequest) => {
      const response = await apiClient.post<ApiResponse<Article>>('/articles', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ARTICLES });
    },
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateArticleRequest }) => {
      const response = await apiClient.put<ApiResponse<Article>>(`/articles/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ARTICLES });
    },
  });
};

export const usePublishArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch<ApiResponse<Article>>(`/articles/${id}/publish`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ARTICLES });
    },
  });
};

export const useArchiveArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch<ApiResponse<Article>>(`/articles/${id}/archive`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ARTICLES });
    },
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/articles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ARTICLES });
    },
  });
};
