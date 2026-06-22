import { api } from '@/lib/api';
import { Event, PaginatedResponse } from '@/types';
import { ApiResponse } from '@/features/auth/api';

export interface GetEventsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  department?: string;
  status?: string;
}

export const getEvents = async (params: GetEventsParams = {}): Promise<ApiResponse<PaginatedResponse<Event>>> => {
  return api.get('/events', { params });
};

export const getEventById = async (id: string): Promise<ApiResponse<Event>> => {
  return api.get(`/events/${id}`);
};

import { CreateEventPayload, UpdateEventPayload } from './types';

export const createEvent = async (payload: CreateEventPayload): Promise<ApiResponse<Event>> => {
  return api.post('/events', payload);
};

export const updateEvent = async (id: string, payload: UpdateEventPayload): Promise<ApiResponse<Event>> => {
  return api.put(`/events/${id}`, payload);
};

export const deleteEvent = async (id: string): Promise<ApiResponse<null>> => {
  return api.delete(`/events/${id}`);
};
