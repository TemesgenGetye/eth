import { Link, useParams } from 'react-router-dom';
import SearchFilters from '../components/Motor/Searchfilter';
import ProductList from '../components/ui/ProductList';
import Pagination from '../components/Motor/Pagination';
import NoProduct from '../components/ui/NoProduct';
import useProducts from '../hooks/useProducts';
import { ProductType } from '../components/type';
import { useState } from 'react';
import { cleanString } from '../services/utils';
import { useFilteredProducts } from '../hooks/useFilteredProducts';

function Product() {
  const { pname } = useParams<{ pname: string }>();
  const pName = pname?.split('-')?.join(' ');
  const [filtereApplied, setFilterApplied] = useState(false);

  const { products } = useProducts();
  const { filteredProducts } = useFilteredProducts();

  const _filteredProducts: ProductType[] | undefined = pname
    ? filtereApplied
      ? filteredProducts
      : products?.filter((product): product is ProductType =>
          product?.subcategory?.name.toLowerCase()?.includes(pName)
        )
    : [];

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // Calculate total pages
  const totalPages = _filteredProducts
    ? Math.ceil(_filteredProducts.length / productsPerPage)
    : 1;

  // Get products for current page
  const paginatedProducts = _filteredProducts
    ? _filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
      )
    : [];

  if (_filteredProducts?.length === 0) return <NoProduct />;

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-4">
      {/* Search Filters */}
      <SearchFilters use="motor" onFilterApplied={setFilterApplied} />

      {/* Breadcrumbs */}
      <div className="container mx-auto py-4 text-sm">
        <div className="flex items-center space-x-2 text-sm text-blue-600">
          <Link to="/" className="hover:underline">
            Dubai
          </Link>
          <span className="text-gray-400 hover:underline">&gt;</span>
          <Link
            to={`/${cleanString(_filteredProducts?.[0]?.category?.name || '')}`}
            className="hover:underline"
          >
            {_filteredProducts?.[0]?.category?.name}
          </Link>
          <span className="text-gray-400">&gt;</span>
          <span className="text-gray-400">
            {_filteredProducts?.[0]?.subcategory?.name}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {_filteredProducts?.[0]?.subcategory?.name} sale in dubai •{' '}
            {_filteredProducts?.length} Ads
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
          <ProductList products={paginatedProducts} />
        </div>
        <div className="p-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
}

export default Product;
