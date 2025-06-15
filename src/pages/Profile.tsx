'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useGetCustomer, useUpdateCustomer } from '../hooks/useCustomers';
import { useAuth } from '../Context/AuthContext';
import supabase from '../services/supabase';
import { useNavigate } from 'react-router-dom';

export default function CustomerProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { updateCustomerMutate, isPendingCustomer } = useUpdateCustomer();
  const { customer, isLoadingCustomer } = useGetCustomer(
    user?.identities?.at(0)?.user_id as string
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    location: '',
    img_url: '',
  });
  const [formData, setFormData] = useState(profileData);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (customer) {
      const newProfile = {
        name: customer.name || '',
        email: customer.email || '',
        location: customer.location || '',
        img_url: customer.img_url || '',
      };
      setProfileData(newProfile);
      setFormData(newProfile);
    }
  }, [customer]);

  useEffect(() => {
    if (!isLoadingCustomer && !user) {
      navigate('/');
    }
  }, [isLoadingCustomer, customer, navigate]);

  useEffect(() => {
    const hasFormChanges =
      JSON.stringify(formData) !== JSON.stringify(profileData);
    setHasChanges(hasFormChanges);
  }, [formData, profileData]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsImageUploading(true);

      try {
        // You can implement actual file upload to Supabase storage here
        // const { data, error } = await supabase.storage
        //   .from('avatars')
        //   .upload(`${user.id}/${file.name}`, file)

        // For now, using FileReader for preview
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setFormData((prev) => ({ ...prev, img_url: result }));
          setIsImageUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error uploading image:', error);
        setIsImageUploading(false);
      }
    }
  };

  const handleSave = async () => {
    setProfileData(formData);
    if (customer?.id) {
      updateCustomerMutate({ id: customer.id, ...formData });
    }
  };

  const handleCancel = () => {
    setFormData(profileData);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (isLoadingCustomer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-4xl overflow-hidden rounded-2xl border-0 bg-white/80 shadow-2xl backdrop-blur-sm">
          <div className="p-8">
            <div className="animate-pulse space-y-6">
              {/* Header skeleton */}
              <div className="flex flex-col items-center space-y-4">
                <div className="h-32 w-32 rounded-full bg-slate-200"></div>
                <div className="h-8 w-48 rounded bg-slate-200"></div>
                <div className="h-4 w-32 rounded bg-slate-200"></div>
              </div>

              {/* Form skeleton */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="h-4 w-20 rounded bg-slate-200"></div>
                  <div className="h-12 w-full rounded-lg bg-slate-200"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 rounded bg-slate-200"></div>
                  <div className="h-12 w-full rounded-lg bg-slate-200"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-4 w-16 rounded bg-slate-200"></div>
                <div className="h-12 w-full rounded-lg bg-slate-200"></div>
              </div>

              <div className="flex gap-4">
                <div className="h-12 flex-1 rounded-lg bg-slate-200"></div>
                <div className="h-12 flex-1 rounded-lg bg-slate-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-2xl border-0 bg-white/80 shadow-2xl backdrop-blur-sm">
          {/* Header Section */}
          <div className="relative">
            {/* Background Pattern */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-r from-blue-600  to-blue-700">
              <div className="absolute inset-0 bg-black/20"></div>
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  backgroundImage: `${
                    customer?.img_url
                      ? `url("${customer?.img_url}")`
                      : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }`,
                }}
              >
                <img
                  src={customer?.img_url || '/placeholder.svg'}
                  alt="Profile Banner"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Profile Image */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 transform">
              <div className="group relative">
                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl">
                  {formData.img_url ? (
                    <img
                      src={formData.img_url || '/placeholder.svg'}
                      alt={formData.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
                      {formData.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase() || 'U'}
                    </div>
                  )}
                </div>

                {/* Upload overlay */}
                <button
                  onClick={handleImageClick}
                  disabled={isImageUploading}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-all duration-200 hover:bg-black/60 disabled:cursor-not-allowed group-hover:opacity-100"
                >
                  {isImageUploading ? (
                    <svg
                      className="h-6 w-6 animate-spin text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>

                {isImageUploading && (
                  <div className="absolute -bottom-2 -right-2 rounded-full bg-blue-600 p-1">
                    <svg
                      className="h-4 w-4 animate-bounce text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="px-8 pb-8 pt-20">
            {/* User Info Header */}
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                {formData.name || 'Your Profile'}
              </h1>
              <p className="flex items-center justify-center gap-2 text-gray-600">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {formData.email}
              </p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Name and Email Row */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                  >
                    <svg
                      className="h-4 w-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="h-12 w-full rounded-lg border border-gray-200 px-4 text-base transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                  >
                    <svg
                      className="h-4 w-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="h-12 w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-4 text-base text-gray-500"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label
                  htmlFor="location"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <svg
                    className="h-4 w-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="h-12 w-full rounded-lg border border-gray-200 px-4 text-base transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter your location"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 pt-6 sm:flex-row">
                <button
                  onClick={handleSave}
                  disabled={!hasChanges || isPendingCustomer}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-blue-500  font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700  hover:shadow-xl disabled:cursor-not-allowed "
                >
                  {isPendingCustomer ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                        />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>

                <button
                  onClick={handleCancel}
                  disabled={!hasChanges || isPendingCustomer}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border-2 border-gray-300 font-semibold text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel
                </button>
              </div>

              {/* Logout Button */}
              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={handleLogout}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border-2 border-red-200 font-semibold text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-50"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
