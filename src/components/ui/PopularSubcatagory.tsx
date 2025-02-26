import { Link } from 'react-router-dom';
import { categories } from '../../Data/Catagorie';
import { product } from '../../Data/Product';

function PopularSubcatagory({ id }: { id: string }) {
  const filterdCategory = categories[0].children.filter(
    (item) => item._id === id.split(':')[1]
  )[0]?.children;

  return (
    <div className="container m-auto mx-auto max-w-7xl px-4">
      <div className=" flex flex-1 items-center justify-center gap-4 md:flex-nowrap">
        {filterdCategory?.length === 0 ? (
          <div></div>
        ) : (
          filterdCategory?.map((category, i) => (
            <Link
              to={`/product/${category._id}`}
              key={category._id}
              className=" mt-8 w-44 rounded-lg border border-gray-200 bg-white p-4 text-center shadow-xl transition-shadow hover:shadow-md"
            >
              <h3 className="mb-2 text-nowrap text-sm font-semibold text-gray-600">
                {category?.name.en}
              </h3>
              <p className="text-xl text-gray-600">
                {
                  product.filter((item) =>
                    item.categories.includes(category._id)
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
