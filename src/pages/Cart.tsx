import type React from 'react';
import {
  ShoppingCart,
  Image,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Filter,
  Minus,
  Plus,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/Cart';
import { useCartItems } from '../hooks/store';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cartItems } = useCartItems();
  const navigate = useNavigate();

  const [imageIndexes, setImageIndexes] = useState<{ [key: string]: number }>(
    {}
  );

  const { cart, setCart } = useCart();
  console.log('cart', cart);

  const handleImageChange = (
    id: string,
    direction: 'next' | 'prev',
    images: string[]
  ) => {
    setImageIndexes((prevIndexes) => {
      const currentIndex = prevIndexes[id] ?? 0;
      const newIndex =
        direction === 'next'
          ? (currentIndex + 1) % images.length
          : (currentIndex - 1 + images.length) % images.length;

      return { ...prevIndexes, [id]: newIndex };
    });
  };

  function handleRemoveFromCart(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) {
    e.stopPropagation();
    if (cart?.length) {
      console.log('item to be removed', id);
      setCart(cart?.filter((item) => +item !== id));
      toast.success('Item removed sucessfully.');
    }
  }

  function updateQuantity(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: any,
    action: 'increase' | 'decrease'
  ) {
    e.stopPropagation();

    const updatedCart = cartItems?.map((cartItem) => {
      if (cartItem._id === item._id) {
        const newQuantity =
          action === 'increase'
            ? (cartItem.quantity || 1) + 1
            : Math.max((cartItem.quantity || 1) - 1, 1);

        return { ...cartItem, quantity: newQuantity };
      }
      return cartItem;
    });

    setCart(updatedCart);
  }

  const calculateTotal = () => {
    return cartItems
      ?.reduce((total, item) => {
        const quantity = item.quantity || 1;
        return total + item.price.orignal * quantity;
      }, 0)
      .toFixed(2);
  };

  return (
    <div className="mx-auto mb-5 grid max-w-7xl grid-cols-1 gap-4">
      <div className="p-10">
        <p className="text-lg font-semibold">My Cart</p>
        <p className="text-sm text-gray-500">
          Your cart items will appear here.
        </p>
      </div>
      <div className="mx-auto flex w-full max-w-md flex-row items-center justify-end gap-2 p-4">
        <input
          type="text"
          placeholder="Search in cart..."
          className="w-full flex-1 rounded-lg border border-gray-300 p-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          aria-label="Search"
        />
        <button
          className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Filter"
        >
          <Filter className="h-5 w-5" />
        </button>
      </div>

      {cartItems?.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 text-center">
          <ShoppingCart className="h-16 w-16 text-gray-300" />
          <p className="mt-4 text-lg font-medium text-gray-900">
            Your cart is empty
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Add items to your cart to see them here
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          {cartItems?.map((item) => {
            const currentImageIndex = imageIndexes[item.id] ?? 0;
            const quantity = item.quantity || 1;

            return (
              <div
                key={item._id}
                className="relative rounded-lg border-b border-b-gray-200 bg-white p-4 shadow-sm"
                onClick={() => navigate(`/detail/${item.id}`)}
              >
                <div className="flex gap-4">
                  <div className="relative h-48 w-72 flex-shrink-0 overflow-hidden rounded-lg">
                    {item.imgUrls.length > 1 && (
                      <>
                        <button
                          className="absolute left-0.5 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/80 p-1 ring-1 ring-gray-300 hover:bg-gray-300 hover:ring-2 hover:ring-gray-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageChange(item.id, 'prev', item.imgUrls);
                          }}
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          className="absolute right-0.5 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/80 p-1 ring-1 ring-gray-300 hover:bg-gray-300 hover:ring-2 hover:ring-gray-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageChange(item._id, 'next', item.imgUrls);
                          }}
                        >
                          <ChevronRight size={16} />
                        </button>
                      </>
                    )}
                    <img
                      src={
                        item.imgUrls[currentImageIndex] || '/placeholder.svg'
                      }
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-500 ease-in-out"
                    />
                    {item.imgUrls.length > 1 && (
                      <div className="absolute bottom-2 left-2 flex items-center space-x-1 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
                        <span>
                          <Image size={14} />
                        </span>
                        <span>{`${currentImageIndex + 1} / ${item.imgUrls.length}`}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-lg font-medium text-gray-900">
                          {item.name}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold">
                            {item.price.discounted === item.price.orignal ? (
                              <span>{item.price.orignal} AED</span>
                            ) : (
                              <>
                                <span>{item.price.discounted} AED </span>
                                <span>•</span>
                                <span className="text-gray-500 line-through">
                                  {item.price.orignal}
                                </span>
                                <span>AED</span>
                                <div className="text-red-500">
                                  {item.price.orignal - item.price.discounted}{' '}
                                  AED Downpayment
                                </div>
                              </>
                            )}
                          </span>
                          {item.stock > 0 && (
                            <span className="rounded bg-green-300 px-2 py-0.5 text-xs font-medium text-white">
                              IN STOCK ({item.stock})
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col items-start">
                          <span>• {item.slug}</span>
                          {/* <p className="cursor-pointer text-sm text-blue-500 hover:underline">
                            {item.variants.length > 0
                              ? item.variants.length + ' variants'
                              : ''}
                          </p> */}
                        </div>
                        <div className="mt-2 flex items-center">
                          <span className="mr-2 text-sm font-medium text-gray-700">
                            Quantity:
                          </span>
                          <div className="flex items-center rounded-lg border border-gray-300">
                            <button
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                              onClick={(e) =>
                                updateQuantity(e, item, 'decrease')
                              }
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-3 py-1">{quantity}</span>
                            <button
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                              onClick={(e) =>
                                updateQuantity(e, item, 'increase')
                              }
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <span className="ml-4 font-medium">
                            Total:{' '}
                            {(item.price.discounted * quantity).toFixed(2)} AED
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="h-7 w-7 text-red-500"
                          onClick={(e) => {
                            handleRemoveFromCart(e, item.id);
                          }}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <p className="line-clamp-2 pr-10 text-sm text-gray-600">
                      {item.description}
                    </p>
                    <div className="space-y-2 text-sm text-gray-500">
                      {'dubai'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
            <div className="flex justify-between border-b pb-4">
              <span className="text-lg font-medium">Order Summary</span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{calculateTotal()} AED</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold">
                  {calculateTotal()} AED
                </span>
              </div>
            </div>
            <button
              className="mt-6 w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/checkout');
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
