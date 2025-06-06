import { TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useProducts from '../../hooks/useProducts';

function ListProductHorizontal() {
  const { featuredProducts } = useProducts();
  const navigate = useNavigate();

  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Featured listing</h2>
          <div className="flex items-center text-blue-600">
            <TrendingUp className="mr-2 h-5 w-5" />
            <span>Trending Now</span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {featuredProducts?.map((featured) => (
            <button
              key={featured?.id}
              className="overflow-hidden rounded-lg bg-white pb-2 shadow-md transition-transform hover:scale-105"
              onClick={() => navigate(`/detail/${featured?.id}`)}
            >
              <div className="aspect-w-16 aspect-h-9 text-gray-600">
                <img
                  src={featured.imgUrls[0] || '/logo.png'}
                  alt={featured?.name}
                  className="h-36 w-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="mb-2 text-sm font-normal text-gray-700">
                  {featured?.name}
                </h3>
                <p className="mb-2 text-sm font-bold text-blue-600">
                  <span>{featured?.price.amount}</span>
                  <span className="ml-1 text-[10px] text-gray-500">
                    {featured?.price.currency}
                  </span>
                </p>
                <p className="h-10 text-ellipsis text-sm text-gray-500">
                  {featured?.description}
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
