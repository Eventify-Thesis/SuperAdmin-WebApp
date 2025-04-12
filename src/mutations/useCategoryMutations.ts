import axios from 'axios';

export const addCategory = async (category: string): Promise<void> => {
  await axios.post('/api/categories', { name: category });
};
