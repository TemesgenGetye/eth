import { Link } from 'react-router-dom';
import useCategories from '../../hooks/useCategories';
import { Subcategory } from '../type';
import useProducts from '../../hooks/useProducts';
import { cleanString } from '../../services/utils';

function PopularSubcatagory({ id }: { id: string }) {
  const { categories } = useCategories();
  const { products } = useProducts();
  const category = categories?.find(
    (category) => cleanString(category?.name) === id
  );
  const subcategories = category?.subcategories || [];

  return (
    <div className="container mx-auto max-w-7xl px-3 sm:px-4">
      {subcategories?.length === 0 ? null : (
        <div className="mt-6 flex flex-wrap items-stretch justify-center gap-3 sm:mt-8 sm:gap-4">
          {subcategories?.map((subcategory: Subcategory) => (
            <Link
              to={`/${category?.name?.toLowerCase()?.split(' ').join('-')}/${subcategory?.name?.toLowerCase()?.split(' ').join('-')}`}
              key={subcategory.id}
              className="min-w-[150px] shrink-0 rounded-lg border border-gray-200 bg-white p-3 text-center shadow-xl transition-shadow hover:shadow-md sm:p-4"
            >
              <h3 className="mb-1 line-clamp-2 min-h-[2.5rem] break-words text-xs font-semibold leading-snug text-gray-600 sm:mb-2 sm:min-h-[2.75rem] sm:text-sm">
                {subcategory?.name}
              </h3>
              <p className="text-lg font-medium tabular-nums text-gray-600 sm:text-xl">
                {
                  products?.filter(
                    (p) =>
                      cleanString(p.category?.name) ===
                        cleanString(category?.name) &&
                      cleanString(p?.subcategory?.name) ===
                        cleanString(subcategory?.name)
                  ).length
                }
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default PopularSubcatagory;
