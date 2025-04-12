import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsClient } from '@/api/event.client';
import { AxiosError } from 'axios';
import { IdParam, PaginationResponse } from '@/types/types';
import { EventListAllResponse } from '@/dto/event-doc.dto';
import { EventModel } from '@/domain/EventModel';

export const EVENT_QUERY_KEYS = {
  list: 'eventList',
  detail: 'eventDetail',
  show: 'eventShow',
  setting: 'eventSetting',
  payment: 'eventPayment',
};

interface EventListParams {
  keyword?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const useGetEventList = ({
  keyword,
  status,
  page,
  limit,
}: {
  keyword: string;
  status: string;
  page: number;
  limit: number;
}) => {
  return useQuery<PaginationResponse<EventModel>, Error>({
    queryKey: ['events', keyword, status, page, limit],
    queryFn: () =>
      eventsClient.getList({
        keyword,
        status,
        page,
        limit,
      }),
    placeholderData: (previousData) => previousData, // replaces keepPreviousData
  });
};

export const useEventMutations = (eventId?: IdParam) => {
  const queryClient = useQueryClient();

  const infoDraftMutation = useMutation({
    mutationFn: async (data: any) => {
      const [categoryIds, categories] = data.category.split('_');

      delete data.category;
      return await eventsClient.createDraft({
        ...data,
        categoriesIds: [categoryIds],
        categories: [categories],
        id: eventId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [EVENT_QUERY_KEYS.detail, eventId],
      });
    },
  });

  const showMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!eventId) throw new Error('Event ID is required');
      return await eventsClient.updateShow(eventId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [EVENT_QUERY_KEYS.show, eventId],
      });
    },
  });

  const settingMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!eventId) throw new Error('Event ID is required');
      return await eventsClient.updateSetting(eventId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [EVENT_QUERY_KEYS.setting, eventId],
      });
    },
  });

  const paymentMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!eventId) throw new Error('Event ID is required');
      return await eventsClient.updatePayment(eventId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [EVENT_QUERY_KEYS.payment, eventId],
      });
    },
  });

  return {
    infoDraftMutation,
    showMutation,
    settingMutation,
    paymentMutation,
  };
};
