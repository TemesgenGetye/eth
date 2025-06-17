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
  const {
    data: filteredProducts,
    isLoading: isLoadingFiltered,
    refetch: refetchFiltered,
  } = useQuery({
    queryKey: ['filtered-products'],
    queryFn: () =>
      getFilteredProducts({
        term,
        city,
        minPrice: minPrice !== null ? +minPrice : undefined,
        maxPrice: maxPrice !== null ? +maxPrice : undefined,
        minYear: minYear !== null ? +minYear : undefined,
        maxYear: maxPrice !== null ? +maxPrice : undefined,
        pname,
      }),
    enabled:
      !!term?.trim() ||
      !!city ||
      !!minPrice ||
      !!maxPrice ||
      !!minYear ||
      !!maxYear,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  // console.log('error stack', error?.stack);
  // console.log('error', error?.message);
  return {
    filteredProducts: filteredProducts as ProductType[] | undefined,
    isLoadingFiltered,
    refetchFiltered,
  };
};
