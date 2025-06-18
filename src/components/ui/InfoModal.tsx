import React from 'react';
import { X, ShoppingBag, Users, Package, Star } from 'lucide-react';

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const InfoModal: React.FC<InfoModalProps> = ({
  open,
  onClose,
  title,
  children,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Header with Dubai skyline background */}
        <div
          className="relative h-48 overflow-hidden rounded-t-3xl bg-gradient-to-r from-blue-600 via-red-500 to-green-500"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/placeholder.svg?height=200&width=800&text=Dubai+Skyline')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* UAE Flag colors overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-green-600/20 to-black/20"></div>

          {/* Close button */}
          <button
            className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={24} />
          </button>

          {/* Title and UAE flag */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="mb-2 flex items-center gap-3">
              <div className="h-8 w-12 overflow-hidden rounded shadow-lg">
                <div className="h-2 bg-red-600"></div>
                <div className="h-2 bg-white"></div>
                <div className="h-2 bg-black"></div>
                <div className="h-2 bg-green-600"></div>
              </div>
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                {title}
              </h2>
            </div>
            <p className="text-lg text-white/90 drop-shadow">
              Dubai's Premier Online Marketplace
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Stats section */}
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 text-center">
              <ShoppingBag className="mx-auto mb-2 h-8 w-8 text-blue-600" />
              <div className="text-2xl font-bold text-blue-800">10K+</div>
              <div className="text-sm text-blue-600">Products</div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-4 text-center">
              <Users className="mx-auto mb-2 h-8 w-8 text-green-600" />
              <div className="text-2xl font-bold text-green-800">50K+</div>
              <div className="text-sm text-green-600">Happy Users</div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-4 text-center">
              <Package className="mx-auto mb-2 h-8 w-8 text-purple-600" />
              <div className="text-2xl font-bold text-purple-800">24/7</div>
              <div className="text-sm text-purple-600">Fast Delivery</div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 text-center">
              <Star className="mx-auto mb-2 h-8 w-8 text-yellow-600" />
              <div className="text-2xl font-bold text-yellow-800">4.9</div>
              <div className="text-sm text-yellow-600">Rating</div>
            </div>
          </div>

          {/* Main content */}
          <div className="leading-relaxed text-gray-700">{children}</div>

          {/* Dubai landmarks section */}
          <div className="mt-8 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800">
              <span>🏙️</span>
              Serving All of Dubai
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
              <div className="flex items-center gap-2">
                <span>🏢</span>
                <span>Dubai</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🏖️</span>
                <span>Abu Dhabi</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🏝️</span>
                <span>Ras Al Khaimah</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🛍️</span>
                <span>Sharjah</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✈️</span>
                <span>Fujairah</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🏗️</span>
                <span>Ajman</span>
              </div>

              <div className="flex items-center gap-2">
                <span>🏗️</span>
                <span>Umm Al Quwain</span>
              </div>

              <div className="flex items-center gap-2">
                <span>🏗️</span>
                <span>Al Ain </span>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="mt-8 text-center">
            <button
              className="transform rounded-full bg-blue-600  bg-gradient-to-r px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-blue-800"
              onClick={onClose}
            >
              Explore 888Market
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
