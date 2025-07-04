import { TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useProducts from '../../hooks/useProducts';
import { useLanguage } from '../../Context/Languge';

function ListProductHorizontal({ cid }: { cid?: number }) {
  const { featuredProducts, isLoadingFeatured } = useProducts();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const filteredFeaturedProducts = cid
    ? featuredProducts?.filter((featured) => featured?.category?.id === cid)
    : featuredProducts;

  if (isLoadingFeatured) {
    return (
      <div className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
            <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-64 w-full animate-pulse rounded-lg bg-gray-200"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (!filteredFeaturedProducts?.length) return null;

  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {t('common.featuredListings')}
          </h2>
          <div className="flex items-center text-blue-600">
            <TrendingUp className="mr-2 h-5 w-5" />
            <span>{t('common.trendingNow')}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {filteredFeaturedProducts?.map((featured) => {
            const cName = featured?.category?.name
              ?.toLowerCase()
              ?.split(' ')
              ?.join('-');
            const scName = featured?.subcategory?.name
              ?.toLowerCase()
              ?.split(' ')
              ?.join('-');
            const pName = featured?.name?.toLowerCase()?.split(' ')?.join('-');
            const pid = featured?.id;
            return (
              <button
                key={featured?.id}
                className="overflow-hidden rounded-lg bg-white pb-2 shadow-md transition-transform hover:scale-105"
                onClick={() =>
                  navigate(`/${cName}/${scName}/${pName}`, { state: { pid } })
                }
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
                    <span>{featured?.price.discounted}</span>
                    <span className="ml-1 text-[10px] text-gray-500">
                      {featured?.price.currency}
                    </span>
                  </p>
                  <p className="h-10 text-ellipsis text-sm text-gray-500">
                    {featured?.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ListProductHorizontal;
