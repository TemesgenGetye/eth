'use client';

import { useState } from 'react';
import { BadgeCheck, X, ChevronLeft } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { Link } from 'react-router-dom';
import { useGetCustomer } from '../hooks/useCustomers';

const Chat = () => {
  const [showBanner, setShowBanner] = useState(true);
  const { user } = useAuth();
  // Assuming user.id is the uuid of the customer
  const { customer, isLoadingCustomer } = useGetCustomer(user?.id || '');

  const isVerified = customer?.verification_status === 'verified';

  const handleDismissBanner = () => {
    setShowBanner(false);
  };

  return (
    <div className="flex h-screen flex-col bg-white">
      <header className="flex items-center justify-between border-b p-4">
        <Link to="/" className="flex items-center">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-semibold">Chats</h1>
        <div className="w-6"></div>
      </header>

      <div className="flex-grow p-4">
        {showBanner && !isLoadingCustomer && !isVerified && (
          <div className="mb-4 flex items-start rounded-lg bg-blue-50 p-4">
            <div className="mr-4 flex-shrink-0">
              <div className="relative">
                <BadgeCheck className="h-10 w-10 text-blue-500" />
              </div>
            </div>
            <div className="flex-grow">
              <h2 className="font-semibold text-gray-800">
                Got a verified badge yet?
              </h2>
              <p className="text-sm text-gray-600">Get more visibility</p>
              <p className="text-sm text-gray-600">Enhance your credibility</p>
              <button className="mt-2 text-sm font-semibold text-blue-600">
                Learn More
              </button>
            </div>
            <button onClick={handleDismissBanner} className="ml-2">
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        )}

        {showBanner && !isLoadingCustomer && isVerified && (
          <div className="mb-4 flex items-center rounded-lg bg-green-50 p-4">
            <BadgeCheck className="mr-3 h-6 w-6 text-green-500" />
            <p className="font-semibold text-green-800">
              You have a verified badge!
            </p>
          </div>
        )}

        <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
          <p>Hey, looks like you don't have any chat messages yet.</p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
