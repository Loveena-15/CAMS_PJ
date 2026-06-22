import { api } from '@/lib/api';
import { Registration, PaginatedResponse } from '@/types';
import { ApiResponse } from '@/features/auth/api';
import { RegisterEventPayload } from './types';

export interface GetRegistrationsParams {
  page?: number;
  limit?: number;
}

export const registerForEvent = async (payload: RegisterEventPayload): Promise<ApiResponse<Registration>> => {
  return api.post('/registrations', payload);
};

export const getMyRegistrations = async (params: GetRegistrationsParams = {}): Promise<ApiResponse<PaginatedResponse<Registration>>> => {
  return api.get('/registrations/my', { params });
};

export const getEventRegistrations = async (eventId: string, params: GetRegistrationsParams = {}): Promise<ApiResponse<PaginatedResponse<Registration>>> => {
  return api.get(`/registrations/event/${eventId}`, { params });
};

export const cancelRegistration = async (id: string): Promise<ApiResponse<null>> => {
  return api.delete(`/registrations/${id}`);
};
