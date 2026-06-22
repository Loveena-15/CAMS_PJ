import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyResults, getEventResults, assignResult, updateResult, deleteResult, GetResultsParams } from '../api';
import { AssignResultPayload, UpdateResultPayload } from '../types';
import toast from 'react-hot-toast';

export const useMyResults = (params: GetResultsParams) => {
  return useQuery({
    queryKey: ['results', 'my', params],
    queryFn: () => getMyResults(params),
  });
};

export const useEventResults = (eventId: string, params: GetResultsParams) => {
  return useQuery({
    queryKey: ['results', 'event', eventId, params],
    queryFn: () => getEventResults(eventId, params),
    enabled: !!eventId,
  });
};

export const useAssignResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignResultPayload) => assignResult(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['results', 'event', variables.eventId] });
      toast.success('Result assigned successfully');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message || 'Failed to assign result';
      toast.error(msg);
    }
  });
};

export const useUpdateResult = (eventId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateResultPayload }) => updateResult(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results', 'event', eventId] });
      toast.success('Result updated successfully');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message || 'Failed to update result';
      toast.error(msg);
    }
  });
};

export const useDeleteResult = (eventId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteResult(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results', 'event', eventId] });
      toast.success('Result removed successfully');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message || 'Failed to remove result';
      toast.error(msg);
    }
  });
};
