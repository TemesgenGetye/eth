import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import useCustomers, { useUpdateCustomer } from '../hooks/useCustomers';
import { useAuth } from '../Context/AuthContext';
import { updateCustomer } from '../services/customers';
import { t } from 'i18next';

export default function Component() {
  const { customers, isLoading, error } = useCustomers();
  const { user } = useAuth();

  const { updateCustomerMutate, isPendingCustomer } = useUpdateCustomer();

  const filterdCustomers = customers?.filter(
    (customer) => customer.uuid === user?.identities?.at(0)?.user_id
  );

  console.log(customers);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    location: '',
    img_url: '',
  });
  const [formData, setFormData] = useState(profileData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (filterdCustomers && filterdCustomers.length > 0) {
      const customer = filterdCustomers[0];
      const newProfile = {
        name: customer.name || '',
        email: customer.email || '',
        location: customer.location || '',
        img_url: customer.img_url || '',
      };

      if (
        newProfile.name !== profileData.name ||
        newProfile.email !== profileData.email ||
        newProfile.location !== profileData.location ||
        newProfile.img_url !== profileData.img_url
      ) {
        setProfileData(newProfile);
        setFormData(newProfile);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterdCustomers]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData((prev) => ({ ...prev, img_url: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setProfileData(formData);
    console.log({ id: filterdCustomers?.[0]?.id, ...formData });
    updateCustomerMutate({ id: filterdCustomers?.[0]?.id, ...formData });
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData(profileData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br ">
      <div className="flex-1 p-8 pt-6">
        <div className="mx-auto max-w-6xl">
          {/* Main Profile Card */}
          <div className="overflow-hidden rounded-2xl">
            {/* Header with wide image banner */}
            <div
              className="group relative h-64 cursor-pointer"
              onClick={handleImageClick}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                {formData.img_url &&
                formData.img_url !== '/placeholder.svg?height=300&width=800' ? (
                  <img
                    src={formData.img_url || '/placeholder.svg'}
                    alt="Profile Banner"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-r from-blue-300 to-blue-400"></div>
                )}
              </div>

              {/* Blur overlay with name */}
              <div className="absolute inset-0 bg-black bg-opacity-30">
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-sm">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                      {formData.name}
                    </h1>
                    <p className="mt-2 text-lg text-blue-100 drop-shadow">
                      Member since today
                    </p>
                  </div>
                </div>
              </div>

              {/* Camera icon overlay on hover */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="text-center">
                  <svg
                    className="mx-auto mb-2 h-12 w-12 text-white"
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
                  <p className="text-sm text-white">Click to change banner</p>
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

            {/* Form Section */}
            <div className="p-10">
              {/* Form Grid - Two columns on larger screens */}
              <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-3 text-lg font-semibold text-black">
                    <svg
                      className="h-5 w-5 text-blue-600"
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
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full rounded-xl bg-gray-50 px-4 py-3 text-lg text-black placeholder-gray-500 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-3 text-lg font-semibold text-black">
                    <svg
                      className="h-5 w-5 text-blue-600"
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
                    type="email"
                    value={formData.email}
                    disabled={true}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl bg-gray-50 px-4 py-3 text-lg text-black placeholder-gray-500 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Location Field - Full width */}
              <div className="mb-10 space-y-2">
                <label className="flex items-center gap-3 text-lg font-semibold text-black">
                  <svg
                    className="h-5 w-5 text-blue-600"
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
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl bg-gray-50 px-4 py-3 text-lg text-black placeholder-gray-500 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter your location"
                />
              </div>

              {/* Action Buttons */}
              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <button
                  onClick={handleSave}
                  className="flex  items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white  hover:bg-blue-500 hover:shadow-lg"
                >
                  <svg
                    className="h-5 w-5"
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
                </button>
                <button
                  onClick={handleCancel}
                  className="flex transform items-center justify-center gap-3 rounded-xl border-2 border-blue-600 bg-white px-6 py-4 text-lg font-semibold text-black transition-all hover:scale-105 hover:bg-gray-50 hover:shadow-lg"
                >
                  <svg
                    className="h-5 w-5"
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
              <button className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 bg-gradient-to-r px-6 py-4 text-lg font-semibold text-white  hover:from-blue-500 hover:to-blue-600 hover:shadow-lg">
                <svg
                  className="h-5 w-5"
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
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
