import { useQuery } from '@tanstack/react-query';
import apiClient from './client';
import { ApiResponse, Article, DashboardStats } from '../types';
import { QUERY_KEYS } from '../utils/constants';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_STATS,
    queryFn: async () => {
      const [usersRes, articlesRes, commentsRes, mediaRes] = await Promise.all([
        apiClient.get<ApiResponse<{ total: number }>>('/users/stats'),
        apiClient.get<ApiResponse<{ total: number }>>('/articles/stats'),
        apiClient.get<ApiResponse<{ total: number }>>('/comments/stats'),
        apiClient.get<ApiResponse<{ total: number }>>('/media/stats'),
      ]);

      const stats: DashboardStats = {
        users: usersRes.data.data.total || 0,
        articles: articlesRes.data.data.total || 0,
        comments: commentsRes.data.data.total || 0,
        media: mediaRes.data.data.total || 0,
      };

      return stats;
    },
    retry: false,
  });
};

export const useLatestArticles = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ARTICLES, 'latest'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Article[]>>('/articles', {
        params: { limit: 5, sort: 'createdAt', order: 'desc' },
      });
      return response.data.data;
    },
  });
};
