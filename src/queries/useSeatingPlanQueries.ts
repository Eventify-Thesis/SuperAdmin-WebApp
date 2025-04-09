import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seatingPlanClient } from '@/api/seating-plan.client';
import { AxiosError } from 'axios';
import { IdParam, QueryFilters } from '@/types/types';
import { SeatingPlanModel } from '@/domain/SeatingPlanModel';
import { SeatingPlanCategoryModel } from '@/domain/SeatingPlanCategoryModel';

export const SEATING_PLAN_QUERY_KEYS = {
  list: 'seatingPlanList',
  detail: 'seatingPlanDetail',
  categories: 'seatingPlanCategories',
};

export const useGetSeatingPlanList = (
  eventId: IdParam,
  params: QueryFilters,
) => {
  return useQuery<{ docs: SeatingPlanModel[]; totalDocs: number }, AxiosError>({
    queryKey: [SEATING_PLAN_QUERY_KEYS.list, eventId, params],
    queryFn: async () => {
      const data = await seatingPlanClient.getList(eventId, {
        limit: 100000,
        page: 1,
      });
      return data;
    },
    enabled: !!eventId,
  });
};

export const useGetSeatingPlanDetail = (eventId: IdParam, planId: IdParam) => {
  return useQuery<SeatingPlanModel, AxiosError>({
    queryKey: [SEATING_PLAN_QUERY_KEYS.detail, eventId, planId],
    queryFn: async () => {
      const data = await seatingPlanClient.getDetail(eventId, planId);
      return data;
    },
    enabled: !!eventId && !!planId,
  });
};

export const useGetSeatingPlanCategories = (
  eventId: IdParam,
  planId: IdParam,
  options?: { enabled?: boolean },
) => {
  return useQuery<SeatingPlanCategoryModel[], AxiosError>({
    queryKey: [SEATING_PLAN_QUERY_KEYS.categories, eventId, planId],
    queryFn: async () => {
      const data = await seatingPlanClient.getCategories(eventId, planId);
      console.log(data);
      return data;
    },
    enabled: (options?.enabled ?? true) && !!eventId && !!planId,
  });
};

export const useSeatingPlanMutations = (eventId: IdParam, id?: IdParam) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!eventId) throw new Error('Event ID is required');
      return await seatingPlanClient.create(eventId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [SEATING_PLAN_QUERY_KEYS.list, eventId],
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!eventId) throw new Error('Event ID is required');
      if (!id) throw new Error('Seating plan ID is required');
      return await seatingPlanClient.update(eventId, id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [SEATING_PLAN_QUERY_KEYS.detail, eventId],
      });
      queryClient.invalidateQueries({
        queryKey: [SEATING_PLAN_QUERY_KEYS.list, eventId],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (planId: string) => {
      if (!eventId) throw new Error('Event ID is required');
      return await seatingPlanClient.delete(eventId, planId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [SEATING_PLAN_QUERY_KEYS.list, eventId],
      });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
