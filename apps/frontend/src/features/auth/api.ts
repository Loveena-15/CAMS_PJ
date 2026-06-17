import { api } from '@/lib/api';
import { AuthResponse } from '@/types';
import { LoginPayload, RegisterPayload } from './types';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const login = async (payload: LoginPayload): Promise<ApiResponse<AuthResponse>> => {
  return api.post('/auth/login', payload);
};

export const register = async (payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> => {
  return api.post('/auth/register', payload);
};

export const logout = async (refreshToken: string): Promise<ApiResponse<null>> => {
  return api.post('/auth/logout', { refreshToken });
};
