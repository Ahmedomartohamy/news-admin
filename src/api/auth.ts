import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient, { setAccessToken } from './client';
import { ApiResponse, User } from '../types';
import { QUERY_KEYS } from '../utils/constants';
import { useAuthStore } from '../store/authStore';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  profileImage?: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const useLogin = () => {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data);
      return response.data.data;
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH });
    },
  });
};

export const useMe = () => {
  const { setUser, clearAuth } = useAuthStore();

  return useQuery({
    queryKey: QUERY_KEYS.AUTH,
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<User>>('/auth/me');
      return response.data.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setUser(data);
    },
    onError: () => {
      clearAuth();
      setAccessToken(null);
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await apiClient.put<ApiResponse<User>>('/auth/me', data);
      return response.data.data;
    },
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      const response = await apiClient.put<ApiResponse<void>>('/auth/change-password', data);
      return response.data;
    },
  });
};

export const useLogout = () => {
  const { clearAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout');
    },
    onSuccess: () => {
      setAccessToken(null);
      clearAuth();
      queryClient.clear();
    },
  });
};
