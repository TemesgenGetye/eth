import { useQuery } from '@tanstack/react-query';
import { getFilteredProducts } from '../services/products';
import { useParams, useSearchParams } from 'react-router-dom';
import { ProductType } from '../components/type';

export const useFilteredProducts = () => {
  const [query] = useSearchParams();
  const { cid, pname } = useParams();
  const keyword = query.get('keyword');
  const city = query.get('city');
  const minPrice = query.get('minPrice');
  const maxPrice = query.get('maxPrice');
  const minYear = query.get('minYear');
  const maxYear = query.get('maxYear');

  // Check if any filter is active - cid and pname should always be considered as filters
  const hasActiveFilters = !!(
    keyword?.trim() ||
    city ||
    minPrice ||
    maxPrice ||
    minYear ||
    maxYear ||
    cid ||
    pname
  );

  const {
    data: filteredProducts,
    isLoading: isLoadingFiltered,
    refetch: refetchFiltered,
  } = useQuery({
    queryKey: [
      'filtered-products',
      keyword,
      city,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      cid,
      pname,
    ],
    queryFn: () =>
      getFilteredProducts({
        keyword: keyword || undefined,
        city: city || undefined,
        minPrice: minPrice !== null ? +minPrice : undefined,
        maxPrice: maxPrice !== null ? +maxPrice : undefined,
        minYear: minYear !== null ? +minYear : undefined,
        maxYear: maxYear !== null ? +maxYear : undefined,
        cid: cid || undefined,
        pname: pname || undefined,
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
