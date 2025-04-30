import { useQuery } from '@tanstack/react-query';
import { categoryClient } from '@/api/category.client';
import { Category } from '@/api/categories.api';

export const GET_CATEGORIES_QUERY_KEY = 'categories';

export const useGetCategories = () => {
  return useQuery<Category[]>({
    queryKey: [GET_CATEGORIES_QUERY_KEY],
    queryFn: async () => {
      return await categoryClient.getAll();
    },
  });
};
