import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/products';

const useProducts = () => {
  const {
    isLoading: isLoadingProducts,
    data,
    isError,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });
  return {
    products: data,
    isLoading: isLoadingProducts,
    isError,
    refetch: refetchProducts,
  };
};

export default useProducts;
