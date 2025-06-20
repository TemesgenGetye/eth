'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PaymentModal from './PaymentModal';
import { getItem } from '../services/db';
import { ProductData } from '../components/type';

export default function Subscription() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [basePrice, setBasePrice] = useState(289);
  const [planName, setPlanName] = useState('Basic');
  const [productData, setProductData] = useState<ProductData | undefined>();
  const [isLoadingProductData, setIsLoadingProductData] = useState(true);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const plan = searchParams.get('plan');
    const price = searchParams.get('basePrice');

    // Get product data from IndexedDB (stored by PostAd form)
    const retrieveProductData = async () => {
      setIsLoadingProductData(true);
      try {
        const storedProductData = await getItem('productFormData');
        if (storedProductData) {
          setProductData(storedProductData);
        } else {
          console.warn('No product data found in IndexedDB');
        }
      } catch (error) {
        console.error('Error retrieving stored product data:', error);
      } finally {
        setIsLoadingProductData(false);
      }
    };

    if (plan) setPlanName(plan);
    if (price) setBasePrice(Number(price));

    // Retrieve product data from IndexedDB
    retrieveProductData();
  }, [searchParams]);

  const badges = [
    { id: 'service-history', label: 'Service History', price: 30 },
    { id: 'no-accidents', label: 'No Accidents', price: 30 },
    { id: 'first-owner', label: 'First Owner', price: 30 },
    { id: 'in-warranty', label: 'In Warranty', price: 30 },
  ];

  const toggleBadge = (badgeId: string) => {
    setSelectedBadges((prev) =>
      prev.includes(badgeId)
        ? prev.filter((id) => id !== badgeId)
        : [...prev, badgeId]
    );
  };

  const badgeTotal = selectedBadges.length * 30;
  const subtotal = basePrice + badgeTotal;
  const vat = subtotal * 0.05;
  const total = subtotal + vat;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200 py-2">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-center justify-center">
              <img src="/logo.png" alt="logo" className="h-20 w-20" />
            </div>
          </div>
        </div>

        <div className="mx-auto mt-20 max-w-6xl px-4 py-8">
          <h1 className="mb-4 text-center text-lg font-bold text-gray-900">
            Secure Checkout
          </h1>

          {isLoadingProductData ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">
                Loading product details...
              </span>
            </div>
          ) : !productData ? (
            <div className="py-12 text-center">
              <p className="mb-4 text-gray-600">
                No product data found. Please go back and complete your ad
                submission.
              </p>
              <button
                onClick={() => window.history.back()}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Go Back
              </button>
            </div>
          ) : (
            <div className="grid gap-12 lg:grid-cols-3">
              {/* Left Column - Car Details & Badges */}
              <div className="space-y-8 border-t border-gray-200 pt-4 lg:col-span-2">
                {/* Car Listing */}
                <div>
                  <h3 className="mb-4 text-sm font-semibold text-gray-900">
                    Make your ad stand out with unique badges
                  </h3>

                  <div className="rounded-lg border border-l-4 border-gray-200 border-l-blue-500 bg-white p-6">
                    <div className="flex items-start gap-4">
                      {/* Car Image Placeholder */}
                      <div className="relative flex h-24 w-32 items-center justify-center rounded-lg bg-blue-100">
                        <span className="absolute left-2 top-2 rounded bg-blue-600 px-2 py-1 text-xs text-white">
                          Featured
                        </span>
                        <div className="h-12 w-16 rounded bg-blue-200"></div>
                      </div>

                      {/* Car Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {productData?.name || 'Untitled Product'}
                            </h4>
                            <div className="mt-1 space-y-1 text-sm text-gray-600">
                              <div>
                                Location:{' '}
                                <span className="font-medium">
                                  {productData?.location ||
                                    'Location not specified'}
                                </span>
                              </div>
                              <div>
                                Price:{' '}
                                <span className="font-medium text-green-600">
                                  AED {productData?.price?.orignal || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              AED {productData?.price?.orignal || 0}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-gray-600">
                    You can select multiple badges (Optional)
                  </p>
                </div>

                {/* Badge Selection */}
                <div className="grid grid-cols-2 gap-4">
                  {badges.map((badge) => (
                    <button
                      key={badge.id}
                      onClick={() => toggleBadge(badge.id)}
                      className={`rounded-lg border-2 p-4 text-left transition-all ${
                        selectedBadges.includes(badge.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {badge.label}
                        </span>
                        <span className="font-semibold text-blue-600">
                          + AED {badge.price}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="pt-4 lg:col-span-1">
                <div className="sticky top-4 rounded-lg border border-gray-200 bg-white p-6">
                  <h3 className="mb-6 text-lg font-semibold text-gray-900">
                    Order Summary
                  </h3>

                  <div className="space-y-4">
                    {/* Basic Ad */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-900">{planName} Ad </span>
                        <button className="text-sm text-blue-600 hover:underline">
                          Edit
                        </button>
                      </div>
                      <span className="font-medium">
                        AED {basePrice.toFixed(2)}
                      </span>
                    </div>

                    {/* Selected Badges */}
                    {selectedBadges.map((badgeId) => {
                      const badge = badges.find((b) => b.id === badgeId);
                      return (
                        <div
                          key={badgeId}
                          className="flex items-center justify-between"
                        >
                          <span className="text-gray-900">{badge?.label}</span>
                          <span className="font-medium">
                            AED {badge?.price}.00
                          </span>
                        </div>
                      );
                    })}

                    {/* VAT */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900">VAT 5%</span>
                      <span className="font-medium">AED {vat.toFixed(2)}</span>
                    </div>

                    {/* Discount Code */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Discount Code"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
                          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200">
                          Apply
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between text-lg font-semibold">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900">
                          AED {total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Pay Button */}
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                      Pay AED {total.toFixed(2)}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        totalAmount={total}
        productData={productData}
      />
    </>
  );
}
