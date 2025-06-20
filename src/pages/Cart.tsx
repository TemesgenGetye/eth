import React, { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/Cart';
import { useCartItems } from '../hooks/store';
import toast from 'react-hot-toast';
import { useAuth } from '../Context/AuthContext';
import { useOrder } from '../hooks/useOrder';
import { useGetCustomer } from '../hooks/useCustomers';
import { cleanString } from '../services/utils';
import OrderConfirmationEmail from '../components/ui/OrderConformationEmail';
import { useLanguage } from '../Context/Languge';

export default function CartPage() {
  const { t } = useLanguage();
  const { cartItems, isLoadingCart, refetchCart } = useCartItems();
  const navigate = useNavigate();
  const { cart, setCart } = useCart();
  const { user } = useAuth();
  const orderMutation = useOrder();
  const { customer } = useGetCustomer(
    user?.identities?.at(0)?.user_id as string
  );

  const [imageIndexes, setImageIndexes] = useState<{ [key: string]: number }>(
    {}
  );
  const [paymentModal, setPaymentModal] = useState<'cash' | 'credit' | null>(
    null
  );
  const [orderEmailData, setOrderEmailData] = useState<null | {
    orderId: string;
    orders: Array<{
      name: string;
      units: number;
      price: number;
      image?: string;
      description?: string;
    }>;
    cost: { shipping: number; tax: number };
    customerEmail: string;
  }>(null);

  // const { customers } = useCustomers();
  // const filterdCustomers = customers?.filter(
  //   (customer) => customer.uuid === user?.identities?.at(0)?.user_id
  // );

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
    // console.log('item to be removed', id);
    if (cart?.length) {
      // console.log(cart);
      setCart(cart?.filter((item) => +item !== id));
      refetchCart();
      toast.success(t('common.itemRemovedSuccessfully'));
    }
  }

  const [quantities, setQuantities] = useState<{ [id: number]: number }>({});

  useEffect(() => {
    if (cartItems) {
      const initialQuantities: { [id: number]: number } = {};
      cartItems?.forEach((item) => {
        initialQuantities[item?.id] = item?.quantity || 1;
      });
      setQuantities(initialQuantities);
    }
  }, [cartItems]);

  function updateQuantity(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: { id: number },
    action: 'increase' | 'decrease'
  ) {
    e.stopPropagation();
    setQuantities((prev) => {
      const current = prev[item.id] || 1;
      const newQuantity =
        action === 'increase' ? current + 1 : Math.max(current - 1, 1);
      return { ...prev, [item.id]: newQuantity };
    });
  }

  const calculateTotal = () => {
    if (!cartItems || cartItems.length === 0) return '0.00';
    const total = cartItems.reduce((sum, item) => {
      // Use discounted price if available, otherwise fallback to original, otherwise 0
      const price = Number(
        item?.price?.discounted ??
          item?.price?.original ??
          item?.price?.orignal ??
          0
      );
      const quantity = Number(quantities[item?.id] || 1);
      return sum + price * quantity;
    }, 0);
    return total.toFixed(2);
  };

  function handleCashOnDelivery() {
    setPaymentModal('cash');
    const orderProducts = cartItems?.map((item) => ({
      product: +item?.id,
      quantity: quantities[item?.id] || 1,
    }));

    if (orderProducts && orderProducts.length > 0) {
      orderMutation.mutate(
        {
          customer_order: String(customer?.id),
          detail: orderProducts as [{ product: number; quantity: number }],
        },
        {
          onSuccess: (data) => {
            // console.log('order mutation data', data);
            const orderId = data?.[0]?.id || 'N/A';
            const orders = (cartItems || []).map((item) => ({
              name: item?.name || '',
              units: quantities[item?.id] || 1,
              price: item?.price.discounted || 0,
              image: item?.imgUrls?.[0] || '',
              description: item?.description || '',
            }));
            // Example cost calculation (customize as needed)
            const cost = { shipping: 0, tax: 0 };
            setOrderEmailData({
              orderId: String(orderId),
              orders,
              cost,
              customerEmail: customer?.email || '',
            });
            toast.success(t('common.orderPlacedSuccessfullyToast'));
            localStorage.removeItem('cart');
          },
          onError: () => {
            toast.error(t('common.failedToPlaceOrder'));
          },
        }
      );
    } else {
      toast.error(t('common.noItemsInCart'));
    }
  }

  if (isLoadingCart) {
    return (
      <div className="mx-auto mb-5 grid max-w-7xl grid-cols-1 gap-4">
        <div className="p-10">
          <div className="mb-2 h-6 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="mx-auto flex w-full max-w-md flex-row items-center justify-end gap-2 p-4">
          <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
          <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="relative flex animate-pulse gap-4 rounded-lg border-b border-b-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="h-48 w-72 rounded-lg bg-gray-200" />
            <div className="flex-1 space-y-3">
              <div className="h-6 w-32 rounded bg-gray-200" />
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-4 w-40 rounded bg-gray-200" />
              <div className="h-8 w-32 rounded bg-gray-200" />
            </div>
          </div>
        ))}
        <div className="mt-6 animate-pulse rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 h-6 w-40 rounded bg-gray-200" />
          <div className="mb-2 h-4 w-32 rounded bg-gray-200" />
          <div className="mb-2 h-4 w-32 rounded bg-gray-200" />
          <div className="mb-2 h-6 w-32 rounded bg-gray-200" />
          <div className="mb-2 h-4 w-24 rounded bg-gray-200" />
          <div className="mb-2 h-8 w-32 rounded bg-gray-200" />
          <div className="mb-2 h-8 w-32 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mb-5 grid max-w-7xl grid-cols-1 gap-4">
      <div className="p-10">
        <p className="text-lg font-semibold">{t('common.myCart')}</p>
        <p className="text-sm text-gray-500">
          {t('common.cartItemsAppearHere')}
        </p>
      </div>
      <div className="mx-auto flex w-full max-w-md flex-row items-center justify-end gap-2 p-4">
        <input
          type="text"
          placeholder={t('common.searchInCart')}
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
            {t('common.yourCartIsEmpty')}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {t('common.addItemsToCart')}
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {t('common.continueShopping')}
          </button>
        </div>
      ) : (
        <>
          {cartItems?.map((item) => {
            const currentImageIndex = imageIndexes[item?.id] ?? 0;

            return (
              <div
                key={item?.id}
                className="relative cursor-pointer rounded-lg border-b border-b-gray-200 bg-white p-4 shadow-sm"
                onClick={() =>
                  navigate(
                    `/${cleanString(item?.category.name)}/${cleanString(item?.subcategory.name)}/${cleanString(item?.name)}`,
                    { state: { pid: item?.id } }
                  )
                }
                // /:cid/:pname/:pid
              >
                <div className="flex gap-4">
                  <div className="relative h-48 w-72 flex-shrink-0 overflow-hidden rounded-lg">
                    {item?.imgUrls.length > 1 && (
                      <>
                        <button
                          className="absolute left-0.5 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/80 p-1 ring-1 ring-gray-300 hover:bg-gray-300 hover:ring-2 hover:ring-gray-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageChange(item?.id, 'prev', item?.imgUrls);
                          }}
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          className="absolute right-0.5 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/80 p-1 ring-1 ring-gray-300 hover:bg-gray-300 hover:ring-2 hover:ring-gray-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageChange(item?._id, 'next', item?.imgUrls);
                          }}
                        >
                          <ChevronRight size={16} />
                        </button>
                      </>
                    )}
                    <img
                      src={
                        item?.imgUrls[currentImageIndex] || '/placeholder.svg'
                      }
                      alt={item?.name}
                      className="h-full w-full object-cover transition-transform duration-500 ease-in-out"
                    />
                    {item?.imgUrls.length > 1 && (
                      <div className="absolute bottom-2 left-2 flex items-center space-x-1 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
                        <span>
                          <Image size={14} />
                        </span>
                        <span>{`${currentImageIndex + 1} / ${item?.imgUrls.length}`}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-lg font-medium text-gray-900">
                          {item?.name}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold">
                            {item?.price.discounted === item?.price.orignal ? (
                              <span>{item?.price.orignal} AED</span>
                            ) : (
                              <>
                                <span>{item?.price.discounted} AED </span>
                                <span>•</span>
                                <span className="text-gray-500 line-through">
                                  {item?.price.orignal}
                                </span>
                                <span>AED</span>
                                <div className="text-red-500">
                                  {item?.price.orignal - item?.price.discounted}{' '}
                                  {t('common.aedDownpayment')}
                                </div>
                              </>
                            )}
                          </span>
                          {item?.stock > 0 && (
                            <span className="rounded bg-[#40b740] px-2 py-0.5 text-xs font-medium text-white">
                              {t('common.inStock')} ({item?.stock})
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col items-start">
                          <span>• {item?.slug}</span>
                          {/* <p className="cursor-pointer text-sm text-blue-500 hover:underline">
                            {item.variants.length > 0
                              ? item.variants.length + ' variants'
                              : ''}
                          </p> */}
                        </div>
                        <div className="mt-2 flex items-center">
                          <span className="mr-2 text-sm font-medium text-gray-700">
                            {t('common.quantity')}
                          </span>
                          <div className="flex items-center rounded-lg border border-gray-300">
                            <button
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                              onClick={(e) =>
                                updateQuantity(e, { id: item?.id }, 'decrease')
                              }
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-3 py-1">
                              {quantities[item?.id] || 1}
                            </span>
                            <button
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                              onClick={(e) =>
                                updateQuantity(e, { id: item?.id }, 'increase')
                              }
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <span className="ml-4 font-medium">
                            {t('common.total')}{' '}
                            {(
                              item?.price.discounted *
                              (quantities[item?.id] || 1)
                            ).toFixed(2)}{' '}
                            AED
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="h-7 w-7 text-red-500"
                          onClick={(e) => {
                            handleRemoveFromCart(e, item?.id);
                          }}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <p className="line-clamp-2 pr-10 text-sm text-gray-600">
                      {item?.description}
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
              <span className="text-lg font-medium">
                {t('common.orderSummary')}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>{t('common.subtotal')}</span>
                <span>{calculateTotal()} AED</span>
              </div>
              <div className="flex justify-between">
                <span>{t('common.shipping')}</span>
                <span>{t('common.calculatedAtCheckout')}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-lg font-bold">{t('common.total')}</span>
                <span className="text-lg font-bold">
                  {calculateTotal()} AED
                </span>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700"
                onClick={() => handleCashOnDelivery()}
              >
                {t('common.cashOnDelivery')}
              </button>
              <button
                className="w-full rounded-lg bg-gray-200 py-3 text-gray-700 hover:bg-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setPaymentModal('credit');
                }}
              >
                {t('common.creditPayment')}
              </button>
            </div>
          </div>

          {/* Modal for Cash on Delivery */}
          {paymentModal === 'cash' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="w-full max-w-lg rounded-2xl border border-green-100 bg-white p-10 text-center shadow-2xl">
                <div className="mb-6 flex flex-col items-center">
                  <svg
                    className="mb-3 h-20 w-20 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="#e6f9ed"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4"
                    />
                  </svg>
                  <h2 className="mb-2 text-3xl font-extrabold text-green-700">
                    {t('common.orderPlacedSuccessfully')}
                  </h2>
                </div>
                <p className="mb-3 text-lg text-gray-800">
                  {t('common.orderPlacedWithCash')}{' '}
                  <span className="font-bold text-green-700">
                    {t('common.cashOnDeliveryText')}
                  </span>
                  .
                </p>
                <div className="mb-5 flex items-center justify-center gap-2 text-base text-green-700">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01"
                    />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <span>{t('common.weWillContactYou')}</span>
                </div>
                <div className="mb-8 rounded-lg bg-green-50 p-4 text-base text-gray-600">
                  {t('common.thankYouForShopping')}{' '}
                  <span className="font-semibold">
                    {t('common.supportTeam')}
                  </span>{' '}
                  {t('common.isHereToHelp')}
                </div>
                <button
                  className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow transition hover:bg-blue-700"
                  onClick={() => setPaymentModal(null)}
                >
                  {t('common.close')}
                </button>
                {/* Order Confirmation Email (hidden form, auto-send) */}
                {orderEmailData && (
                  <div style={{ display: 'none' }}>
                    <OrderConfirmationEmail
                      orderId={orderEmailData.orderId}
                      orders={orderEmailData.orders}
                      cost={orderEmailData.cost}
                      customerEmail={orderEmailData.customerEmail}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Modal for Credit/Payment */}
          {paymentModal === 'credit' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="w-full max-w-lg rounded-2xl border border-yellow-100 bg-white p-10 text-center shadow-2xl">
                <div className="mb-6 flex flex-col items-center">
                  <svg
                    className="mb-3 h-20 w-20 text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="#fffbe6"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01"
                    />
                  </svg>
                  <h2 className="mb-2 text-3xl font-extrabold text-yellow-700">
                    {t('common.comingSoon')}
                  </h2>
                </div>
                <p className="mb-3 text-lg text-gray-800">
                  {t('common.creditPaymentSoon')}
                </p>
                <div className="mb-5 flex items-center justify-center gap-2 text-base text-yellow-700">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01"
                    />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <span>{t('common.workingHardForPayment')}</span>
                </div>
                <div className="mb-8 rounded-lg bg-yellow-50 p-4 text-base text-gray-600">
                  {t('common.stayTunedForUpdates')}
                </div>
                <button
                  className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow transition hover:bg-blue-700"
                  onClick={() => setPaymentModal(null)}
                >
                  {t('common.close')}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
