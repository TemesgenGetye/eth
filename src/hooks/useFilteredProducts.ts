import { useQuery } from '@tanstack/react-query';
import { getFilteredProducts } from '../services/products';
import { useParams, useSearchParams } from 'react-router-dom';
import { ProductType } from '../components/type';

export const useFilteredProducts = () => {
  const [query] = useSearchParams();
  const { pname } = useParams();
  const term = query.get('term');
  const city = query.get('city');
  const minPrice = query.get('minPrice');
  const maxPrice = query.get('maxPrice');
  const minYear = query.get('minYear');
  const maxYear = query.get('maxYear');

  // Check if any filter is active
  const hasActiveFilters = !!(
    term?.trim() ||
    city ||
    minPrice ||
    maxPrice ||
    minYear ||
    maxYear ||
    pname
  );
  // console.log('hasActiveFilters', hasActiveFilters);

  const {
    data: filteredProducts,
    isLoading: isLoadingFiltered,
    refetch: refetchFiltered,
  } = useQuery({
    queryKey: [
      'filtered-products',
      term,
      city,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      pname,
    ],
    queryFn: () =>
      getFilteredProducts({
        term,
        city,
        minPrice: minPrice !== null ? +minPrice : undefined,
        maxPrice: maxPrice !== null ? +maxPrice : undefined,
        minYear: minYear !== null ? +minYear : undefined,
        maxYear: maxYear !== null ? +maxYear : undefined,
        pname,
      }),
    enabled: hasActiveFilters,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    filteredProducts: filteredProducts as ProductType[] | undefined,
    isLoadingFiltered,
    refetchFiltered,
    hasActiveFilters,
  };
};
