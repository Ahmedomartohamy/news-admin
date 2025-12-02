import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from './client';
import { ApiResponse, Comment, CommentStats, PaginatedResponse } from '../types';
import { QUERY_KEYS } from '../utils/constants';

interface CommentsParams {
  page?: number;
  limit?: number;
  status?: string;
  articleId?: string;
}

interface CreateCommentRequest {
  content: string;
  articleId: string;
}

interface UpdateCommentRequest {
  content: string;
}

export const useComments = (params?: CommentsParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.COMMENTS, params],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<Comment>>('/comments', { params });
      return response.data;
    },
  });
};

export const useCommentStats = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.COMMENTS, 'stats'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<CommentStats>>('/comments/stats');
      return response.data.data;
    },
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCommentRequest) => {
      const response = await apiClient.post<ApiResponse<Comment>>('/comments', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMMENTS });
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCommentRequest }) => {
      const response = await apiClient.put<ApiResponse<Comment>>(`/comments/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMMENTS });
    },
  });
};

export const useApproveComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch<ApiResponse<Comment>>(`/comments/${id}/approve`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMMENTS });
    },
  });
};

export const useRejectComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch<ApiResponse<Comment>>(`/comments/${id}/reject`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMMENTS });
    },
  });
};

export const useMarkCommentAsSpam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch<ApiResponse<Comment>>(`/comments/${id}/spam`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMMENTS });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/comments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMMENTS });
    },
  });
};
