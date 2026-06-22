import { api } from '@/lib/api';
import { Result, PaginatedResponse } from '@/types';
import { ApiResponse } from '@/features/auth/api';
import { AssignResultPayload, UpdateResultPayload } from './types';

export interface GetResultsParams {
  page?: number;
  limit?: number;
}

export const getMyResults = async (params: GetResultsParams = {}): Promise<ApiResponse<PaginatedResponse<Result>>> => {
  return api.get('/results/my', { params });
};

export const getEventResults = async (eventId: string, params: GetResultsParams = {}): Promise<ApiResponse<PaginatedResponse<Result>>> => {
  return api.get(`/results/event/${eventId}`, { params });
};

export const assignResult = async (payload: AssignResultPayload): Promise<ApiResponse<Result>> => {
  return api.post('/results', payload);
};

export const updateResult = async (id: string, payload: UpdateResultPayload): Promise<ApiResponse<Result>> => {
  return api.put(`/results/${id}`, payload);
};

export const deleteResult = async (id: string): Promise<ApiResponse<null>> => {
  return api.delete(`/results/${id}`);
};
