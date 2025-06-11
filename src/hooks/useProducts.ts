import { useQuery } from '@tanstack/react-query';
import {
  getPopularProducts,
  getFeaturedProducts,
  getProductsById,
} from '../services/products';

const useProducts = (productIds: number[] = []) => {
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
  const {
    isLoading: isLoadingFavorites,
    data: favoriteProducts,
    isError: isErrorFavorites,
    refetch: refetchFavProducts,
  } = useQuery({
    queryKey: ['favorite-products'],
    queryFn: () => getProductsById(productIds),
  });
  return {
    products: data,
    featuredProducts,
    favoriteProducts,
    isLoading: isLoadingProducts,
    isLoadingFeatured,
    isLoadingFavorites,
    isError,
    isErrorFeatured,
    isErrorFavorites,
    refetch: refetchProducts,
    refetchFeatured: refetchFeaturedProducts,
    refetchFavProducts,
  };
};

export default useProducts;
