import { useNavigate } from 'react-router-dom';
import useProducts from '../../hooks/useProducts';
import { cleanString } from '../../services/utils';
import useCategories from '../../hooks/useCategories';
import { ProductType } from '../type';

const LoadingSkeleton = () => {
  return (
    <div className="mb-8">
      {[1, 2].map((categoryIndex) => (
        <div key={categoryIndex} className="mb-8">
          {/* Category title skeleton */}
          <div className="mb-4 h-8 w-48 animate-pulse rounded-lg bg-gray-200" />

          {/* Products grid skeleton */}
          <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="group relative w-full">
                <div className="relative h-48 overflow-hidden rounded-lg">
                  {/* Image skeleton */}
                  <div className="h-full w-full animate-pulse bg-gray-200" />

                  {/* Title skeleton */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="h-6 w-3/4 animate-pulse rounded bg-gray-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function PopularCategories() {
  const { products, isLoading } = useProducts();
  const { categories } = useCategories();
  const navigate = useNavigate();

  // Group products by category and sort by views
  const popularProductsByCategory = categories?.reduce(
    (acc, category) => {
      const categoryProducts = products?.filter(
        (product) => product.category?.name === category.name
      );

      if (categoryProducts && categoryProducts.length > 0) {
        // Sort products by views in descending order
        const sortedProducts = [...categoryProducts].sort(
          (a, b) => b.views - a.views
        );
        // Take top 5 products
        acc[category.name] = sortedProducts.slice(0, 5);
      }

      return acc;
    },
    {} as Record<string, ProductType[]>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!categories || categories.length === 0) return null;

  return (
    <div className="mb-8">
      {categories.map((category) => {
        const categoryProducts = popularProductsByCategory?.[category.name];
        if (!categoryProducts || categoryProducts.length === 0) return null;

        return (
          <div key={category.id} className="my-8">
            <h3 className="mb-4 text-xl font-semibold text-gray-800">
              Popular in {category.name}
            </h3>
            <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {categoryProducts.map((product: ProductType, index: number) => {
                const cName = cleanString(product?.category?.name);
                const scName = cleanString(product?.subcategory?.name);
                const pName = cleanString(product?.name);
                const pid = product?.id;
                return (
                  <button
                    key={index}
                    className="group relative w-full cursor-pointer"
                    onClick={() =>
                      navigate(`/${cName}/${scName}/${pName}`, {
                        state: { pid },
                      })
                    }
                  >
                    <div className="relative h-48 overflow-hidden rounded-lg">
                      <img
                        src={product.imgUrls[0] || '/logo.png'}
                        alt={`pro_img ${index}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      {/* Blue gradient overlay */}
                      <div className="absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t from-blue-600/60 to-transparent transition-all duration-500 ease-out group-hover:h-full" />

                      {/* Animated border */}
                      <div className="absolute inset-0 p-2">
                        <div className="relative h-full w-full overflow-hidden">
                          <div className="border-1 absolute inset-0 border-white/0 transition-colors duration-500 group-hover:border-white/100">
                            <div className="absolute inset-0">
                              <div className="absolute left-0 top-0 h-0.5 w-0 bg-white transition-all duration-500 group-hover:w-full"></div>
                              <div className="absolute right-0 top-0 h-0 w-0.5 bg-white transition-all duration-500 group-hover:h-full"></div>
                              <div className="absolute bottom-0 right-0 h-0.5 w-0 bg-white transition-all duration-500 group-hover:w-full"></div>
                              <div className="absolute bottom-0 left-0 h-0 w-0.5 bg-white transition-all duration-500 group-hover:h-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <h3 className="absolute bottom-4 left-4 z-10 text-lg font-semibold text-white drop-shadow-lg">
                        {product.name}
                      </h3>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
