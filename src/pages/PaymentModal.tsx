'use client';

import type React from 'react';

import { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import supabase from '../services/supabase';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  productData?: {
    name: string;
    description: string;
    price: {
      orignal: number;
      discounted?: number;
      currency: string;
    };
    stock: number;
    imgUrls: File[];
    category_id: number;
    subcategory_id: number;
    location: string;
    contact_name: string;
    phone_num: string;
    email?: string;
  };
}

interface FormErrors {
  nameOnCard?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  totalAmount,
  productData,
}: PaymentModalProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nameOnCard: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Format card number with dashes
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join('-') : cleaned;
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    if (formatted.length <= 19) {
      // 16 digits + 3 dashes
      handleInputChange('cardNumber', formatted);
    }
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleExpiryDateChange = (value: string) => {
    const formatted = formatExpiryDate(value);
    if (formatted.length <= 5) {
      // MM/YY format
      handleInputChange('expiryDate', formatted);
    }
  };

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return 'Name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    return undefined;
  };

  const validateCardNumber = (cardNumber: string): string | undefined => {
    const cleaned = cardNumber.replace(/\D/g, '');
    if (!cleaned) return 'Card number is required';
    if (cleaned.length !== 16) return 'Card number must be 16 digits';
    return undefined;
  };

  const validateExpiryDate = (expiryDate: string): string | undefined => {
    if (!expiryDate) return 'Expiry date is required';
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) return 'Invalid format (MM/YY)';

    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const expMonth = parseInt(month);
    const expYear = parseInt(year);

    if (expMonth < 1 || expMonth > 12) return 'Invalid month';
    if (
      expYear < currentYear ||
      (expYear === currentYear && expMonth < currentMonth)
    ) {
      return 'Card has expired';
    }
    return undefined;
  };

  const validateCVV = (cvv: string): string | undefined => {
    if (!cvv) return 'CVV is required';
    if (!/^\d{3,4}$/.test(cvv)) return 'CVV must be 3-4 digits';
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    newErrors.nameOnCard = validateName(formData.nameOnCard);
    newErrors.cardNumber = validateCardNumber(formData.cardNumber);
    newErrors.expiryDate = validateExpiryDate(formData.expiryDate);
    newErrors.cvv = validateCVV(formData.cvv);

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error !== undefined);
  };

  const isFormValid = () => {
    return (
      formData.nameOnCard.trim() &&
      formData.cardNumber.replace(/\D/g, '').length === 16 &&
      /^\d{2}\/\d{2}$/.test(formData.expiryDate) &&
      /^\d{3,4}$/.test(formData.cvv) &&
      !Object.values(errors).some((error) => error !== undefined)
    );
  };

  // Post product to Supabase
  const postProduct = async () => {
    if (!productData) {
      throw new Error('No product data provided');
    }

    // Upload images to Supabase bucket
    let img_urls: string[] = [];
    if (productData.imgUrls && productData.imgUrls.length > 0) {
      img_urls = await Promise.all(
        productData.imgUrls.map(async (file: File) => {
          const fileExt = file.name.split('.').pop();
          const filePath = `bucket/${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false,
            });
          if (uploadError) return '';
          // Get public URL
          const { data: publicUrlData } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);
          return publicUrlData.publicUrl;
        })
      );
      img_urls = img_urls.filter(Boolean);
    }

    // Insert product into Supabase with 'live' status
    const { error } = await supabase.from('products').insert([
      {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        img_urls,
        category_id: productData.category_id,
        subcategory_id: productData.subcategory_id,
        location: productData.location,
        contact_name: productData.contact_name,
        phone_num: productData.phone_num,
        email: productData.email,
        status: 'live', // Set status to live
      },
    ]);

    if (error) {
      throw error;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call for payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Process payment (here you would integrate with your payment gateway)
      // console.log('Processing payment:', formData);

      // Post product to Supabase after successful payment
      await postProduct();

      toast.success('Payment processed successfully! Your ad is now live.');

      // Reset form
      setFormData({
        nameOnCard: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        saveCard: false,
      });
      setErrors({});

      // Close modal and redirect to home page
      onClose();
      navigate('/');
    } catch (error) {
      console.error('Payment/Product posting error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <img src="/logo.png" alt="logo" className="size-[100px]" />
        </div>
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 transition-colors hover:text-gray-600"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name on Card */}
          <div>
            <label
              htmlFor="nameOnCard"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Name on Card
            </label>
            <input
              type="text"
              id="nameOnCard"
              placeholder="Name"
              value={formData.nameOnCard}
              onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
              className={`w-full rounded-md border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nameOnCard
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              required
            />
            {errors.nameOnCard && (
              <p className="mt-1 text-xs text-red-500">{errors.nameOnCard}</p>
            )}
          </div>

          {/* Card Number */}
          <div>
            <label
              htmlFor="cardNumber"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              placeholder="0000-0000-0000-0000"
              value={formData.cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              className={`w-full rounded-md border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.cardNumber
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              required
            />
            {errors.cardNumber && (
              <p className="mt-1 text-xs text-red-500">{errors.cardNumber}</p>
            )}
          </div>

          {/* Expiry Date and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="expiryDate"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={(e) => handleExpiryDateChange(e.target.value)}
                className={`w-full rounded-md border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.expiryDate
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                required
              />
              {errors.expiryDate && (
                <p className="mt-1 text-xs text-red-500">{errors.expiryDate}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="cvv"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                placeholder="CVV"
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                className={`w-full rounded-md border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.cvv
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                required
              />
              {errors.cvv && (
                <p className="mt-1 text-xs text-red-500">{errors.cvv}</p>
              )}
            </div>
          </div>

          {/* Save Card Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="saveCard"
              checked={formData.saveCard}
              onChange={(e) => handleInputChange('saveCard', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="saveCard" className="ml-2 text-sm text-gray-700">
              Save my card
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid() || isSubmitting}
            className={`mt-6 w-full rounded-md px-4 py-3 font-semibold transition-colors ${
              isFormValid() && !isSubmitting
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'cursor-not-allowed bg-gray-300 text-gray-500'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                <span className="ml-2">Processing...</span>
              </div>
            ) : (
              `Pay - AED ${totalAmount.toFixed(2)}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
