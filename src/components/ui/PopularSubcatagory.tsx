import { Link } from 'react-router-dom';
import useCategories from '../../hooks/useCategories';
import { Subcategory } from '../type';
import useProducts from '../../hooks/useProducts';
import { cleanString } from '../../services/utils';

function PopularSubcatagory({ id }: { id: string }) {
  // console.log('PopularSubcatagory', id);
  const { categories } = useCategories();
  const { products } = useProducts();
  const category = categories?.find(
    (category) => cleanString(category?.name) === id
  );
  const subcategories = category?.subcategories || [];

  return (
    <div className="container m-auto mx-auto max-w-7xl px-4">
      <div className=" flex flex-1 items-center justify-center gap-4 md:flex-nowrap">
        {subcategories?.length === 0 ? (
          <div></div>
        ) : (
          subcategories?.map((subcategory: Subcategory) => (
            <Link
              to={`/${category?.name?.toLowerCase()?.split(' ').join('-')}/${subcategory?.name?.toLowerCase()?.split(' ').join('-')}`}
              key={subcategory.id}
              className=" mt-8 w-44 rounded-lg border border-gray-200 bg-white p-4 text-center shadow-xl transition-shadow hover:shadow-md"
            >
              <h3 className="mb-2 text-nowrap text-sm font-semibold text-gray-600">
                {subcategory?.name}
              </h3>
              <p className="text-xl text-gray-600">
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
          ))
        )}
      </div>
    </div>
  );
}

export default PopularSubcatagory;
