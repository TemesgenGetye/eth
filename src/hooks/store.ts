import { useQuery } from '@tanstack/react-query';
import { getProdsById, getProductsById } from '../services/products';
import { useCart } from '../Context/Cart';
import { useFavourite } from '../Context/Favourite';

export const useFavouriteItems = () => {
  const { favourite } = useFavourite();

  const {
    isLoading: isLoadingFavorites,
    data: favoriteProducts,
    isError: isErrorFavorites,
    refetch: refetchFavorites,
  } = useQuery({
    queryKey: ['favorite-items', favourite],
    queryFn: () => getProductsById(favourite),
    enabled: favourite.length > 0,
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
    queryKey: ['cart-items', cart],
    queryFn: () => getProdsById(cart),
    enabled: cart.length > 0,
  });

  return {
    isLoadingCart,
    cartItems: cartItems || [],
    isErrorCart,
    refetchCart,
  };
};
