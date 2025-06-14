import { useQuery } from '@tanstack/react-query';
import { getProdsById, getProductsById } from '../services/products';
import { useCart } from '../Context/Cart';
import { useEffect } from 'react';

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
  const { cart } = useCart();
  console.log('cart', cart);
  // const numedCart =
  const {
    isLoading: isLoadingCart,
    data: cartItems,
    isError: isErrorCart,
    refetch: refetchCart,
  } = useQuery({
    queryKey: ['cart-items'],
    queryFn: () => getProdsById(cart),
  });

  useEffect(() => {
    refetchCart();
  }, [refetchCart]);

  return {
    isLoadingCart,
    cartItems,
    isErrorCart,
    refetchCart,
  };
};
