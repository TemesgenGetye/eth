import { useQuery } from '@tanstack/react-query'; // adjust path as needed
import { getSearchedProducts } from '../services/products';

export const useSearchProducts = (searchTerm: string) => {
  console.log('search Term', searchTerm);
  return useQuery({
    queryKey: ['products', 'search', searchTerm],
    queryFn: () => getSearchedProducts(searchTerm),
    enabled: !!searchTerm.trim(), // disables query if term is empty
    staleTime: 1000 * 60 * 5, // optional: 5 min cache
    retry: 1,
  });
};
