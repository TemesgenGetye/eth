import { useQuery } from '@tanstack/react-query';
import { getPopularProducts, getFeaturedProducts } from '../services/products';

const useProducts = () => {
  const {
    isLoading: isLoadingProducts,
    data,
    isError,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ['popular-products'],
    queryFn: getPopularProducts,
  });
  const {
    isLoading: isLoadingFeatured,
    data: featuredProducts,
    isError: isErrorFeatured,
    refetch: refetchFeaturedProducts,
  } = useQuery({
    queryKey: ['featured-products'],
    queryFn: getFeaturedProducts,
  });
  return {
    products: data,
    isLoading: isLoadingProducts,
    isError,
    featuredProducts,
    isLoadingFeatured,
    isErrorFeatured,
    refetch: refetchProducts,
    refetchFeatured: refetchFeaturedProducts,
  };
};

export default useProducts;
