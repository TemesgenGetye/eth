import { product } from '../../Data/Product';

function PopularSubcatagory({ id }: { id: string }) {
  const filterdProducts = product
    .filter((product) => product.categories.includes(id.split(':')[1]))
    .splice(0, 6);

  return (
    <div className="container m-auto mx-auto max-w-7xl px-4">
      <div className="grid grid-cols-1 gap-4  md:grid-cols-2 lg:grid-cols-6">
        {filterdProducts.length === 0 ? (
          <div></div>
        ) : (
          filterdProducts.map((category, i) => (
            <div
              key={i}
              className=" mt-8 rounded-lg border border-gray-200 bg-white p-4 text-center shadow-xl transition-shadow hover:shadow-md"
            >
              <h3 className="mb-2 text-nowrap text-sm font-semibold text-gray-600">
                {category?.title.en}
              </h3>
              <p className="text-xl text-gray-600">{category.stock}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PopularSubcatagory;
