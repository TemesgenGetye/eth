import { Link, useParams } from 'react-router-dom';
import SearchFilters from '../components/Searchfilter';
import ProductList from '../components/ui/ProductList';
import Pagination from '../components/Motor/Pagination';
import NoProduct from '../components/ui/NoProduct';
import NoSearchResult from '../components/TopNavElements/NoSearchResult';
import useProducts from '../hooks/useProducts';
import { ProductType } from '../components/type';
import { useState } from 'react';
import { cleanString } from '../services/utils';
import { useFilteredProducts } from '../hooks/useFilteredProducts';

const ProductSkeleton = () => {
  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-4">
      {/* Search Filters - Keep static */}
      <SearchFilters use="motor" onFilterApplied={() => {}} />

      {/* Breadcrumbs - Keep static */}
      <div className="container mx-auto py-4 text-sm">
        <div className="flex items-center space-x-2 text-sm text-blue-600">
          <Link to="/" className="hover:underline">
            Dubai
          </Link>
          <span className="text-gray-400">&gt;</span>
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
          <span className="text-gray-400">&gt;</span>
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto">
        {/* Header - Keep static structure, skeleton for dynamic content */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
            <span className="text-gray-400">•</span>
            <div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        {/* Product List Skeleton */}
        <div className="mb-[50px] mt-6 grid grid-cols-1 gap-6 md:mb-0 lg:grid-cols-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex gap-4 rounded-lg border-b border-gray-100 p-4"
            >
              {/* Image Skeleton */}
              <div className="h-32 w-32 flex-shrink-0 animate-pulse rounded-lg bg-gray-200" />

              {/* Content Skeleton */}
              <div className="flex flex-1 flex-col gap-2">
                <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
                  <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-6 flex justify-center">
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-8 w-8 animate-pulse rounded bg-gray-200"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function Product() {
  const { pname } = useParams<{ pname: string }>();
  const pName = pname?.split('-')?.join(' ');
  const [filtereApplied, setFilterApplied] = useState(false);

  const { filteredProducts, isLoadingFiltered, hasActiveFilters } =
    useFilteredProducts();

  const { products, isLoading: isLoadingProducts } = useProducts();

  const _filteredProducts: ProductType[] | undefined = pname
    ? filtereApplied || hasActiveFilters
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

  // useEffect(() => {
  //   refetchFiltered();
  // }, [refetchFiltered]);

  // Show loading skeleton while loading
  if (isLoadingProducts || isLoadingFiltered) {
    return <ProductSkeleton />;
  }

  // Show NoProduct if no products exist for the category
  if (!filtereApplied && !hasActiveFilters && _filteredProducts?.length === 0)
    return <NoProduct />;

  // Show NoSearchResult if filters are applied but no results found
  if (
    (filtereApplied || hasActiveFilters) &&
    !isLoadingFiltered &&
    (!_filteredProducts || _filteredProducts.length === 0)
  ) {
    return (
      <div className="mx-auto min-h-screen max-w-6xl px-4 py-4">
        <SearchFilters use="motor" onFilterApplied={setFilterApplied} />
        <div className="mt-8">
          <NoSearchResult
            title="No products found matching your filters"
            message="Try adjusting your search criteria or clear some filters to see more results"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-4">
      {/* Search Filters */}
      <SearchFilters use="motor" onFilterApplied={setFilterApplied} />

      {/* Breadcrumbs */}
      <div className="container mx-auto hidden py-4 text-sm md:block">
        <div className="flex items-center space-x-2 text-sm text-blue-600">
          <Link to="/" className="hover:underline">
            Dubai
          </Link>
          <span className="text-gray-400">&gt;</span>
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
      <div className="container p-2 md:mx-auto md:p-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {_filteredProducts?.[0]?.subcategory?.name} sale in dubai •{' '}
            {_filteredProducts?.length} Ads
          </h2>
          <div className="flex items-center space-x-4"></div>
        </div>

        <div className="mb-[80px] mt-6 grid grid-cols-1 gap-6 md:mb-0">
          <ProductList products={paginatedProducts} />
        </div>
        {totalPages > 1 && (
          <div className="p-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Product;
