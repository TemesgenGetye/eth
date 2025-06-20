import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/Cart';
import {
  CheckCircle,
  ChevronRight,
  Package,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { useLanguage } from '../Context/Languge';

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const { cart, setCart } = useCart();
  const { t } = useLanguage();
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    // Generate a random order number
    const randomOrderNumber =
      'ORD-' + Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(randomOrderNumber);

    // Clear the cart after successful order
    setCart([]);
  }, [setCart]);

  const calculateTotal = () => {
    const subtotal = cart.reduce((total, item) => {
      const quantity = item.quantity || 1;
      return total + item.prices.price * quantity;
    }, 0);

    const shipping = subtotal > 500 ? 0 : 50;
    return (subtotal + shipping).toFixed(2);
  };

  return (
    <div className="mx-auto mb-10 max-w-3xl px-4 py-10">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('common.orderConfirmation.thankYou')}
        </h1>
        <p className="mt-2 text-gray-600">
          {t('common.orderConfirmation.orderReceived')}
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-6 border-b pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">
                {t('common.orderConfirmation.orderNumber')}
              </p>
              <p className="text-lg font-medium text-gray-900">{orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {t('common.orderConfirmation.date')}
              </p>
              <p className="text-lg font-medium text-gray-900">
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {t('common.orderConfirmation.totalAmount')}
              </p>
              <p className="text-lg font-medium text-gray-900">
                {calculateTotal()} {t('common.aed')}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {t('common.orderConfirmation.orderStatus')}
          </h2>
          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
            <div className="relative space-y-8 pl-10">
              <div className="relative">
                <div className="absolute -left-6 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                  <CheckCircle className="h-3 w-3" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {t('common.orderConfirmation.orderConfirmed')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t('common.orderConfirmation.orderConfirmedDesc')}
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-6 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                  <Package className="h-3 w-3" />
                </div>
                <div>
                  <p className="font-medium text-gray-500">
                    {t('common.orderConfirmation.processing')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t('common.orderConfirmation.processingDesc')}
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-6 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                  <Truck className="h-3 w-3" />
                </div>
                <div>
                  <p className="font-medium text-gray-500">
                    {t('common.orderConfirmation.shipped')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t('common.orderConfirmation.shippedDesc')}
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-6 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                  <ShoppingBag className="h-3 w-3" />
                </div>
                <div>
                  <p className="font-medium text-gray-500">
                    {t('common.orderConfirmation.delivered')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t('common.orderConfirmation.deliveredDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {t('common.orderConfirmation.shippingInfo')}
          </h2>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="font-medium">John Doe</p>
            <p>123 Main Street</p>
            <p>Dubai, Dubai 12345</p>
            <p>United Arab Emirates</p>
            <p className="mt-2">+971 50 123 4567</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {t('common.orderConfirmation.paymentInfo')}
          </h2>
          <div className="rounded-lg bg-gray-50 p-4">
            <p>{t('common.orderConfirmation.paymentMethod')}: Credit Card</p>
            <p>{t('common.orderConfirmation.cardEnding')}: ****4567</p>
            <p>
              {t('common.orderConfirmation.billingAddress')}:{' '}
              {t('common.orderConfirmation.sameAsShipping')}
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => navigate('/')}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            {t('common.orderConfirmation.continueShopping')}
          </button>
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {t('common.orderConfirmation.viewAllOrders')}
            <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
