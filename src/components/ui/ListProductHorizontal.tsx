import { TrendingUp } from 'lucide-react';

interface Listing {
  id: number;
  image: string;
  title: string;
  price: string;
  location: string;
}

function ListProductHorizontal({
  list,
  text,
}: {
  list: Listing[];
  text: string;
}) {
  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{text}</h2>
          <div className="flex items-center text-blue-600">
            <TrendingUp className="mr-2 h-5 w-5" />
            <span>Trending Now</span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {list.map((listing) => (
            <div
              key={listing.id}
              className="overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105"
            >
              <div className="aspect-w-16 aspect-h-9 text-gray-600">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="h-36 w-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="mb-2 text-sm font-normal text-gray-700">
                  {listing.title}
                </h3>
                <p className="mb-2 text-sm font-bold text-blue-600">
                  {listing.price}
                </p>
                <p className="text-sm text-gray-500">{listing.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListProductHorizontal;
