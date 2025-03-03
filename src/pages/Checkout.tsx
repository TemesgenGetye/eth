import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/Cart';
import {
  ChevronLeft,
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart } = useCart();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'UAE',
    paymentMethod: 'card',
    saveInfo: true,
  });

  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>(
    'shipping'
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const quantity = item.quantity || 1;
      return total + item.prices.price * quantity;
    }, 0);
  };

  const calculateShipping = () => {
    // Simple shipping calculation based on subtotal
    const subtotal = calculateSubtotal();
    return subtotal > 500 ? 0 : 50;
  };

  const calculateTotal = () => {
    return (calculateSubtotal() + calculateShipping()).toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process checkout logic would go here
    alert('Order placed successfully!');
    navigate('/order-confirmation');
  };

  const goToNextStep = () => {
    if (step === 'shipping') setStep('payment');
    else if (step === 'payment') setStep('review');
  };

  const goToPreviousStep = () => {
    if (step === 'payment') setStep('shipping');
    else if (step === 'review') setStep('payment');
  };

  return (
    <div className="mx-auto mb-10 max-w-7xl">
      <div className="p-6 sm:p-10">
        <button
          onClick={() => navigate('/cart')}
          className="mb-6 flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Cart
        </button>

        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        <p className="mt-2 text-sm text-gray-500">
          Complete your purchase by providing your shipping and payment details.
        </p>
      </div>

      <div className="grid gap-8 px-4 sm:px-10 md:grid-cols-3">
        {/* Checkout Steps */}
        <div className="md:col-span-2">
          <div className="mb-6 flex border-b pb-4">
            <div
              className={`flex flex-1 flex-col items-center ${step === 'shipping' ? 'text-blue-600' : 'text-gray-500'}`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${step === 'shipping' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                1
              </div>
              <span className="mt-2 text-sm font-medium">Shipping</span>
            </div>
            <div
              className={`flex flex-1 flex-col items-center ${step === 'payment' ? 'text-blue-600' : 'text-gray-500'}`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${step === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                2
              </div>
              <span className="mt-2 text-sm font-medium">Payment</span>
            </div>
            <div
              className={`flex flex-1 flex-col items-center ${step === 'review' ? 'text-blue-600' : 'text-gray-500'}`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${step === 'review' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                3
              </div>
              <span className="mt-2 text-sm font-medium">Review</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Shipping Information */}
            {step === 'shipping' && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Shipping Information
                  </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="address"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="city"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      State/Emirate *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="zipCode"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Zip/Postal Code *
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="country"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Country *
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="UAE">United Arab Emirates</option>
                      <option value="SA">Saudi Arabia</option>
                      <option value="QA">Qatar</option>
                      <option value="KW">Kuwait</option>
                      <option value="OM">Oman</option>
                      <option value="BH">Bahrain</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex items-center">
                  <input
                    type="checkbox"
                    id="saveInfo"
                    name="saveInfo"
                    checked={formData.saveInfo}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="saveInfo"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Save this information for next time
                  </label>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Payment Method */}
            {step === 'payment' && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Payment Method
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center rounded-lg border border-gray-300 p-4">
                    <input
                      type="radio"
                      id="card"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="card"
                      className="ml-3 flex flex-1 items-center"
                    >
                      <span className="text-sm font-medium text-gray-900">
                        Credit/Debit Card
                      </span>
                      <div className="ml-auto flex space-x-2">
                        <div className="h-8 w-12 rounded bg-gray-200"></div>
                        <div className="h-8 w-12 rounded bg-gray-200"></div>
                        <div className="h-8 w-12 rounded bg-gray-200"></div>
                      </div>
                    </label>
                  </div>

                  {formData.paymentMethod === 'card' && (
                    <div className="rounded-lg border border-gray-300 p-4">
                      <div className="grid gap-4">
                        <div>
                          <label
                            htmlFor="cardNumber"
                            className="mb-1 block text-sm font-medium text-gray-700"
                          >
                            Card Number *
                          </label>
                          <input
                            type="text"
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            className="w-full rounded-lg border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="expiry"
                              className="mb-1 block text-sm font-medium text-gray-700"
                            >
                              Expiry Date *
                            </label>
                            <input
                              type="text"
                              id="expiry"
                              placeholder="MM/YY"
                              className="w-full rounded-lg border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="cvv"
                              className="mb-1 block text-sm font-medium text-gray-700"
                            >
                              CVV *
                            </label>
                            <input
                              type="text"
                              id="cvv"
                              placeholder="123"
                              className="w-full rounded-lg border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="nameOnCard"
                            className="mb-1 block text-sm font-medium text-gray-700"
                          >
                            Name on Card *
                          </label>
                          <input
                            type="text"
                            id="nameOnCard"
                            className="w-full rounded-lg border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center rounded-lg border border-gray-300 p-4">
                    <input
                      type="radio"
                      id="paypal"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleInputChange}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="paypal"
                      className="ml-3 flex flex-1 items-center"
                    >
                      <span className="text-sm font-medium text-gray-900">
                        PayPal
                      </span>
                      <div className="ml-auto h-8 w-16 rounded bg-gray-200"></div>
                    </label>
                  </div>

                  <div className="flex items-center rounded-lg border border-gray-300 p-4">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="cod"
                      className="ml-3 block text-sm font-medium text-gray-900"
                    >
                      Cash on Delivery
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Continue to Review
                  </button>
                </div>
              </div>
            )}

            {/* Order Review */}
            {step === 'review' && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Review Your Order
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-700">
                      Shipping Information
                    </h3>
                    <div className="rounded-lg bg-gray-50 p-4 text-sm">
                      <p className="font-medium">
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p>{formData.address}</p>
                      <p>
                        {formData.city}, {formData.state} {formData.zipCode}
                      </p>
                      <p>{formData.country}</p>
                      <p className="mt-2">{formData.email}</p>
                      <p>{formData.phone}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-700">
                      Payment Method
                    </h3>
                    <div className="rounded-lg bg-gray-50 p-4 text-sm">
                      {formData.paymentMethod === 'card' && (
                        <p>Credit/Debit Card</p>
                      )}
                      {formData.paymentMethod === 'paypal' && <p>PayPal</p>}
                      {formData.paymentMethod === 'cod' && (
                        <p>Cash on Delivery</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-700">
                      Order Items
                    </h3>
                    <div className="divide-y rounded-lg border">
                      {cart.map((item) => (
                        <div key={item._id} className="flex items-center p-4">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                            <img
                              src={item.image[0] || '/placeholder.svg'}
                              alt={item.title.en}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {item.title.en}
                            </h4>
                            <p className="mt-1 text-sm text-gray-500">
                              Qty: {item.quantity || 1}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.prices.price} AED
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Order Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between border-b pb-4">
                <span className="text-sm text-gray-600">
                  Items ({cart.length})
                </span>
                <span className="text-sm font-medium">
                  {calculateSubtotal().toFixed(2)} AED
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Shipping</span>
                <span className="text-sm font-medium">
                  {calculateShipping() === 0
                    ? 'Free'
                    : `${calculateShipping().toFixed(2)} AED`}
                </span>
              </div>

              <div className="flex justify-between border-t pt-4">
                <span className="text-base font-medium text-gray-900">
                  Total
                </span>
                <span className="text-base font-bold text-gray-900">
                  {calculateTotal()} AED
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-4 rounded-lg bg-gray-50 p-4">
              <div className="flex items-center text-sm text-gray-600">
                <Truck className="mr-2 h-4 w-4" />
                <span>Free shipping on orders over 500 AED</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Package className="mr-2 h-4 w-4" />
                <span>Estimated delivery: 3-5 business days</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ShieldCheck className="mr-2 h-4 w-4" />
                <span>Secure payment processing</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="mb-2 text-sm font-medium text-gray-700">
                  Have a promo code?
                </h3>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="w-full rounded-l-lg border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button className="rounded-r-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
