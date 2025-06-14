import { useQuery } from '@tanstack/react-query';
import { getFilteredProducts } from '../services/products';

type FilterOptions = {
  term?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
};

export const useFilteredProducts = (filters: FilterOptions) => {
  const {
    data: filteredProducts,
    isLoading: isLoadingFiltered,
    error,
    refetch: refetchFiltered,
  } = useQuery({
    queryKey: ['filtered-products', filters],
    queryFn: () => getFilteredProducts(filters),
    enabled:
      !!filters.term?.trim() ||
      !!filters.city ||
      !!filters.minPrice ||
      !!filters.maxPrice ||
      !!filters.minYear ||
      !!filters.maxYear,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  console.log('error stack', error?.stack);
  console.log('error', error?.message);
  return { filteredProducts, isLoadingFiltered, refetchFiltered };
};
