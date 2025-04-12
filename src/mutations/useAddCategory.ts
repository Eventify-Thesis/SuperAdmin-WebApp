import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryClient } from '@/api/category.client';
import { GET_CATEGORIES_QUERY_KEY } from '@/queries/useCategoryQueries';
import type { CreateCategoryDto } from '@/api/categories.api';

interface CreateCategoryVariables {
  categoryData: CreateCategoryDto;
}

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ categoryData }: CreateCategoryVariables) => {
      return await categoryClient.add(categoryData);
    },
    onSuccess: () => {
      // Invalidate the categories query so that the list is updated
      queryClient.invalidateQueries({ queryKey: [GET_CATEGORIES_QUERY_KEY] });
    },
  });
};
