import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login, register, logout } from '../api';
import { useAuthStore } from '@/store/authStore';
import { LoginPayload, RegisterPayload } from '../types';

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginPayload) => login(data),
    onSuccess: (res) => {
      const { user, accessToken, refreshToken } = res.data;
      setAuth(user, accessToken, refreshToken);
      
      // Redirect users after login based on role
      if (user.role === 'ADMIN') {
        navigate('/admin/home', { replace: true });
      } else {
        navigate('/student/home', { replace: true });
      }
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: RegisterPayload) => register(data),
    onSuccess: (res) => {
      const { user, accessToken, refreshToken } = res.data;
      setAuth(user, accessToken, refreshToken);
      
      // Force student role on register redirect as per backend logic
      navigate('/student/home', { replace: true });
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.logout);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  return useMutation({
    mutationFn: async () => {
      if (!refreshToken) return;
      await logout(refreshToken);
    },
    onSettled: () => {
      // Always clear local auth state and redirect even if backend call fails
      clearAuth();
      navigate('/login', { replace: true });
    },
  });
};
