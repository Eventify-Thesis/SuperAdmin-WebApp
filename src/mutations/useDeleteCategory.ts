import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryClient } from '@/api/category.client';
import { GET_CATEGORIES_QUERY_KEY } from '@/queries/useCategoryQueries';

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // categoryClient.deleteOne could be a function that sends DELETE /categories/:code
    mutationFn: async (code: string) => {
      return await categoryClient.deleteByCode(code);
    },
    onSuccess: () => {
      // Invalidate the categories query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: [GET_CATEGORIES_QUERY_KEY] });
    },
  });
};
