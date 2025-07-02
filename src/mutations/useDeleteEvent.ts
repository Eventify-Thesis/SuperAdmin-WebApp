import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IdParam } from '@/types/types';
import { message } from 'antd';
import { eventsClient } from '@/api/event.client';

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: IdParam) => {
      try {
        await eventsClient.delete(eventId);
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate the events list query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['events'], exact: false });
      message.success('Event deleted successfully');
    },
    onError: (error: Error) => {
      console.error('Error in delete mutation onError:', error);
      message.error('Failed to delete event');
    },
  });
};