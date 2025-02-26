import { useParams } from 'react-router-dom';
import { product } from '../Data/Product';
import SearchFilters from '../components/Motor/Searchfilter';
import ProductList from '../components/ui/ProductList';
import Pagination from '../components/Motor/Pagination';
import { categories } from '../Data/Catagorie';
import NoProduct from '../components/ui/NoProduct';

function Product() {
  const { id } = useParams<{ id: string }>();

  const filterdProduct = id
    ? product.filter((item) => item.categories.includes(id))
    : [];

  const filterdCategory = categories[0]?.children.flatMap((item) => {
    const filteredChildren = item?.children?.filter(
      (child) =>
        child?._id === filterdProduct[0]?.category ||
        child.parentId === filterdProduct[0]?.category
    );
    if (
      item?._id === filterdProduct[0]?.category ||
      item.parentId === filterdProduct[0]?.category
    ) {
      return [item, ...(filteredChildren || [])];
    }

    return filteredChildren || [];
  });

  if (filterdProduct.length === 0) return <NoProduct />;

  //   const brands = [
  //     { name: 'Mercedes-Benz', count: '4644' },
  //     { name: 'BMW', count: '2017' },
  //     { name: 'Nissan', count: '1952' },
  //     { name: 'Land Rover', count: '1552' },
  //     { name: 'Porsche', count: '1172' },
  //     { name: 'Ford', count: '1144' },
  //     { name: 'Audi', count: '916' },
  //   ];

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-4">
      {/* Search Filters */}
      <SearchFilters use="motor" />

      {/* Breadcrumbs */}
      <div className="container mx-auto py-4 text-sm">
        <div className="flex items-center space-x-2 text-sm text-blue-600">
          <a href="#">Dubai</a>
          <span className="text-gray-400">&gt;</span>
          <a href="#">{filterdCategory[0]?.name?.en}</a>
          <span className="text-gray-400">&gt;</span>
          <a href="#">{filterdProduct[0]?.title.en}</a>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {filterdCategory[0]?.name?.en} sale in dubai •{' '}
            {filterdProduct.length} Ads
          </h2>
          <div className="flex items-center space-x-4">
            {/* <button className="flex items-center space-x-2 text-sm">
              <span>Sort: Default</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <button className="flex items-center space-x-2 text-sm">
              <span>Save Search</span>
            </button> */}
          </div>
        </div>

        {/* <BrandFilter brands={brands} /> */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1">
          <ProductList product={filterdProduct} />
        </div>
        <div className="p-6">
          <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />
        </div>
      </div>
    </div>
  );
}

export default Product;
