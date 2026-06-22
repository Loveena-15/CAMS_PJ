import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyRegistrations, registerForEvent, cancelRegistration, GetRegistrationsParams } from '../api';
import { RegisterEventPayload } from '../types';
import toast from 'react-hot-toast';

export const useMyRegistrations = (params: GetRegistrationsParams) => {
  return useQuery({
    queryKey: ['registrations', 'my', params],
    queryFn: () => getMyRegistrations(params),
  });
};

export const useRegisterForEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterEventPayload) => registerForEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations', 'my'] });
      toast.success('Successfully registered for the event!');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message || 'Failed to register';
      toast.error(msg);
    }
  });
};

export const useCancelRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelRegistration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations', 'my'] });
      toast.success('Registration cancelled successfully');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message || 'Failed to cancel registration';
      toast.error(msg);
    }
  });
};
