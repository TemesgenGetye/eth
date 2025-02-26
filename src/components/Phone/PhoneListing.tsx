import { Heart, Share2 } from 'lucide-react';

interface PhoneListingProps {
  image: string;
  price: string;
  title: string;
  make: string;
  model: string;
  year: string;
  storage: string;
  location: string;
  isPremium?: boolean;
}

export default function PhoneListing({
  image,
  price,
  title,
  make,
  model,
  year,
  storage,
  location,
  isPremium,
}: PhoneListingProps) {
  return (
    <div className="relative rounded-lg border-b border-b-gray-200 bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <div className="relative h-48 w-40 flex-shrink-0 overflow-hidden rounded-lg">
          <img
            src={image || '/logo.png'}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">{price} Birr</span>
                {isPremium && (
                  <span className="rounded bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-600">
                    PREMIUM
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{make}</span>
                <span>•</span>
                <span>{model}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="h-7 w-7 shadow-sm">
                <Share2 className="h-4 w-4" />
              </button>
              <button className="h-7 w-7 text-red-500">
                <Heart className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600">{title}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{year}</span>
            <span>{storage}</span>
          </div>
          <div className="text-sm text-gray-500">{location}</div>
        </div>
      </div>
    </div>
  );
}
