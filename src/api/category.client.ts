import { httpApi } from './http.api';
import { Category, CreateCategoryDto } from './categories.api';

export const categoryClient = {
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await httpApi.get('/categories');
      return response.data.data.result;
    } catch (e: any) {
      throw new Error(e);
    }
  },
  add: async (categoryData: CreateCategoryDto): Promise<void> => {
    try {
      await httpApi.post('super-admin/categories', categoryData);
    } catch (e: any) {
      throw new Error(e);
    }
  },
  deleteByCode: async (code: string): Promise<void> => {
    await httpApi.delete(`super-admin/categories/code/${code}`); 
  },
};
