import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../services/categories';

export default function useCategories() {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
  return { categories, isLoading, error };
}
