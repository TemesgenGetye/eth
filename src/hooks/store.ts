import { useQuery } from '@tanstack/react-query';
import { getProductsById } from '../services/products';
import { useCart } from '../Context/Cart';

export const useFavouriteItems = (prodIds: number[]) => {
  const {
    isLoading: isLoadingFavorites,
    data: favoriteProducts,
    isError: isErrorFavorites,
    refetch: refetchFavorites,
  } = useQuery({
    queryKey: ['favorite-items'],
    queryFn: () => getProductsById(prodIds),
  });

  return {
    isLoadingFavorites,
    favoriteProducts,
    isErrorFavorites,
    refetchFavorites,
  };
};

export const useCartItems = () => {
  const { cart } = useCart();
  const {
    isLoading: isLoadingCart,
    data: cartItems,
    isError: isErrorCart,
    refetch: refetchCart,
  } = useQuery({
    queryKey: ['cart-items'],
    queryFn: () => getProductsById(cart?.map((item) => +item)),
  });

  return {
    isLoadingCart,
    cartItems,
    isErrorCart,
    refetchCart,
  };
};
