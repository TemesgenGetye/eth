import { TrendingUp } from 'lucide-react';
import { product } from '../../Data/Product';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ListProductHorizontal() {
  const [filterdProduct, setFilterdProduct] = useState<typeof product>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const randomNum = Math.round(Math.random() * 10);
    setFilterdProduct(product?.slice(randomNum, randomNum + 10));
  }, []);

  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Featuted listing</h2>
          <div className="flex items-center text-blue-600">
            <TrendingUp className="mr-2 h-5 w-5" />
            <span>Trending Now</span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {filterdProduct.map((listing, index) => (
            <button
              key={listing.productId + index}
              className="overflow-hidden rounded-lg bg-white pb-2 shadow-md transition-transform hover:scale-105"
              onClick={() => navigate(`/detail/${listing._id}`)}
            >
              <div className="aspect-w-16 aspect-h-9 text-gray-600">
                <img
                  src={listing.image[0] || '/logo.png'}
                  alt={listing.title.en}
                  className="h-36 w-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="mb-2 text-sm font-normal text-gray-700">
                  {listing.title.en}
                </h3>
                <p className="mb-2 text-sm font-bold text-blue-600">
                  {listing.prices.price}
                </p>
                <p className="h-10 text-ellipsis text-sm text-gray-500">
                  {listing.description.en}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListProductHorizontal;
