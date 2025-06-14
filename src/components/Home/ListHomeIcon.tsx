import useCategories from '../../hooks/useCategories';
import Category from '../Category';
import { CategoryType } from '../type';

function ListForHome() {
  const { categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-6">
          <div className="mb-8 flex items-center gap-2">
            <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
          </div>
          <div className="grid grid-cols-1 gap-x-5 gap-y-3 md:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-24 w-full animate-pulse rounded bg-gray-200"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-6">
        <div className="flex gap-2">
          <h2 className="mb-8 text-2xl font-semibold text-gray-800">
            All Categories
          </h2>
          <div>
            <img
              src="./all-product.gif"
              alt="icon icon"
              className="h-10 w-10"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-5 gap-y-3 md:grid-cols-3 lg:grid-cols-5">
          {categories?.map((category) => (
            <Category category={category as CategoryType} key={category?.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListForHome;
