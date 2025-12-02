import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from './client';
import { ApiResponse, PaginatedResponse, User } from '../types';
import { QUERY_KEYS } from '../utils/constants';

interface UsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  active?: boolean;
}

interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  role: 'ADMIN' | 'EDITOR' | 'AUTHOR';
  bio?: string;
  profileImage?: string;
}

interface UpdateUserRequest {
  email?: string;
  name?: string;
  role?: 'ADMIN' | 'EDITOR' | 'AUTHOR';
  bio?: string;
  profileImage?: string;
}

export const useUsers = (params?: UsersParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USERS, params],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<User>>('/users', { params });
      return response.data;
    },
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USERS, id],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserRequest) => {
      const response = await apiClient.post<ApiResponse<User>>('/users', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserRequest }) => {
      const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const response = await apiClient.patch<ApiResponse<User>>(`/users/${id}/role`, { role });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const endpoint = active ? `/users/${id}/activate` : `/users/${id}/deactivate`;
      const response = await apiClient.patch<ApiResponse<User>>(endpoint);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
  });
};
