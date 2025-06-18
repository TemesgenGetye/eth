import { Link, useParams, useSearchParams } from 'react-router-dom';
import SearchFilters from '../components/Searchfilter';
import ProductList from '../components/ui/ProductList';
import Pagination from '../components/Motor/Pagination';
// import NoProduct from '../components/ui/NoProduct';
import useProducts from '../hooks/useProducts';
import { ProductType } from '../components/type';
import { useState } from 'react';
import { cleanString } from '../services/utils';
import NoSearchResult from '../components/TopNavElements/NoSearchResult';

function SearchResult() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword')?.split('-').join(' ') || '';
  const { products } = useProducts();
  const { cname } = useParams();

  const filteredProducts: ProductType[] | undefined = keyword
    ? products?.filter((product): product is ProductType =>
        product?.name.toLowerCase()?.includes(keyword)
      )
    : [];

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // Calculate total pages
  const totalPages = filteredProducts
    ? Math.ceil(filteredProducts.length / productsPerPage)
    : 1;

  // Get products for current page
  const paginatedProducts = filteredProducts
    ? filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
      )
    : [];

  // if (filteredProducts?.length === 0) return <NoProduct />;
  const categoryName = filteredProducts?.length
    ? filteredProducts?.[0]?.category?.name
    : cname?.split('-')?.join(' ');

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-4">
      {/* Search Filters */}
      <SearchFilters use="motor" />

      {/* Breadcrumbs */}
      <div className="container mx-auto py-4 text-sm">
        <div className="flex items-center space-x-2 text-sm text-blue-600">
          <Link to="/" className="hover:underline">
            Dubai
          </Link>
          <span className="text-gray-400 hover:underline">&gt;</span>
          <Link
            to={
              !filteredProducts?.length
                ? `/${cname}`
                : `/${cleanString(filteredProducts?.[0]?.category?.name || '')}`
            }
            className="hover:underline"
          >
            {categoryName}
          </Link>
          {filteredProducts?.length ? (
            <>
              <span className="text-gray-400">&gt;</span>
              <span className="text-gray-400">
                {filteredProducts?.[0]?.subcategory?.name}
              </span>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {filteredProducts?.length
              ? filteredProducts?.[0]?.subcategory?.name
              : categoryName}{' '}
            sale in dubai
            {filteredProducts?.length
              ? ` • ${filteredProducts?.length} Ads`
              : ''}
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
          {filteredProducts?.length ? (
            <ProductList products={paginatedProducts} />
          ) : (
            <NoSearchResult />
          )}
        </div>
        <div className="p-6">
          {filteredProducts?.length ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResult;
