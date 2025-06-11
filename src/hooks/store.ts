import { useQuery } from '@tanstack/react-query';
import { getProductsById } from '../services/products';

export const useFavouriteItems = () => {
  const favStr = localStorage.getItem('favourite');
  const favourite = JSON.parse(favStr?.length ? favStr : '[]');
  console.log('favvv', favourite);
  const {
    isLoading: isLoadingFavorites,
    data: favoriteProducts,
    isError: isErrorFavorites,
    refetch: refetchFavorites,
  } = useQuery({
    queryKey: ['favorite-items'],
    queryFn: () => getProductsById(favourite),
  });

  return {
    isLoadingFavorites,
    favoriteProducts,
    isErrorFavorites,
    refetchFavorites,
  };
};

export const useCartItems = () => {
  const cartStr = localStorage.getItem('cart');
  const cart = JSON.parse(cartStr?.length ? cartStr : '[]');
  const {
    isLoading: isLoadingCart,
    data: cartItems,
    isError: isErrorCart,
    refetch: refetchCart,
  } = useQuery({
    queryKey: ['cart-items'],
    queryFn: () => getProductsById(cart?.map((item: string) => +item)),
  });

  return {
    isLoadingCart,
    cartItems,
    isErrorCart,
    refetchCart,
  };
};
