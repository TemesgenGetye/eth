import { ChevronDown, ChevronUp } from 'lucide-react';
import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFilteredProducts } from '../hooks/useFilteredProducts';
// import debounce from 'lodash/debounce'; // Install lodash for debouncing
import { ProductType } from './type';
import FilterCityComponent from './ProductFilters/FilterCityComponent';
import RangeFilter from './ProductFilters/RangeFilters';

function SearchFilters({
  use,
  onFilterApplied,
}: {
  use: string;
  onFilterApplied?: (state: boolean) => void;
}) {
  const [query, setQuery] = useSearchParams();
  const keyword = query.get('keyword') || '';
  const [isCitySelectOpen, setIsCitySelectOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [city, setCity] = useState(query.get('city') || '');

  // Get min/max values from URL
  const minPrice = query.get('minPrice');
  const maxPrice = query.get('maxPrice');
  const minYear = query.get('minYear');
  const maxYear = query.get('maxYear');

  // Set initial range states based on URL parameters
  const [yearRange, setYearRange] = useState(
    minYear && maxYear ? `${minYear}-${maxYear}` : 'Select'
  );
  const [priceRange, setPriceRange] = useState(
    minPrice && maxPrice ? `${minPrice}-${maxPrice}` : 'Select'
  );

  const [key, setKey] = useState(keyword);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const cityRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);

  const { isLoadingFiltered, filteredProducts, refetchFiltered } =
    useFilteredProducts();

  // Initialize filterOptions with all possible filters
  const [filterOptions, setFilterOptions] = useState<{
    term?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    minYear?: number;
    maxYear?: number;
  }>({
    term: query.get('term') || '',
    city: query.get('city') || '',
    minPrice: query.get('minPrice') ? Number(query.get('minPrice')) : undefined,
    maxPrice: query.get('maxPrice') ? Number(query.get('maxPrice')) : undefined,
    minYear: query.get('minYear') ? Number(query.get('minYear')) : undefined,
    maxYear: query.get('maxYear') ? Number(query.get('maxYear')) : undefined,
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // console.log('value', value);
    setKey(value);
    setFilterOptions((prev) => ({ ...prev, term: value.trim() }));
    // setShowSearchResults(value.length >= 2);
    // onFilterApplied?.(true);
  };

  // Handle search result selection
  const handleSearchSelect = (product: ProductType) => {
    setKey(product.name);
    setFilterOptions((prev) => ({ ...prev, term: product.name }));
    setShowSearchResults(false);
    onFilterApplied?.(true);
  };

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(
      regex,
      '<span class="underline decoration-blue-500 decoration-2 underline-offset-4">$1</span>'
    );
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle city selection
  const handleCitySelect = async (selectedCity: string) => {
    setCity(selectedCity);
    setFilterOptions((prev) => ({ ...prev, city: selectedCity }));
    setIsCitySelectOpen(false);
    onFilterApplied?.(true);
    await refetchFiltered();
  };

  // Handle price range application
  const handlePriceRangeApply = async (
    range: string,
    min: number,
    max: number
  ) => {
    setPriceRange(range);
    setFilterOptions((prev) => ({ ...prev, minPrice: min, maxPrice: max }));
    setIsPriceOpen(false);
    onFilterApplied?.(true);
    await refetchFiltered();
  };

  // Handle year range application
  const handleYearRangeApply = async (
    range: string,
    min: number,
    max: number
  ) => {
    setYearRange(range);
    setFilterOptions((prev) => ({ ...prev, minYear: min, maxYear: max }));
    setIsYearOpen(false);
    onFilterApplied?.(true);
    await refetchFiltered();
  };

  // Handle clearing specific filters
  const handleClearRange = async (type: 'price' | 'year') => {
    if (type === 'price') {
      setPriceRange('Select');
      setFilterOptions((prev) => ({
        ...prev,
        minPrice: undefined,
        maxPrice: undefined,
      }));
    } else {
      setYearRange('Select');
      setFilterOptions((prev) => ({
        ...prev,
        minYear: undefined,
        maxYear: undefined,
      }));
    }
    onFilterApplied?.(true);
    await refetchFiltered();
  };

  // Handle clearing filters
  const handleClearFilters = async () => {
    setCity('');
    setYearRange('Select');
    setPriceRange('Select');
    setKey('');
    setFilterOptions({
      term: '',
      city: '',
      minPrice: undefined,
      maxPrice: undefined,
      minYear: undefined,
      maxYear: undefined,
    });
    onFilterApplied?.(false);
    await refetchFiltered();
  };

  useEffect(() => {
    console.log('filterOptions', filterOptions);
    setQuery(
      Object.fromEntries(
        Object.entries(filterOptions || {})
          .filter(([, v]) => v !== undefined && v !== '')
          .map(([k, v]) => [k, String(v)])
      )
    );
    console.log('query', query);
    console.log('filterOptions', filterOptions);
  }, [filterOptions, setQuery, query]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close city dropdown
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setIsCitySelectOpen(false);
      }

      // Close year dropdown
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
        setIsYearOpen(false);
      }

      // Close price dropdown
      if (
        priceRef.current &&
        !priceRef.current.contains(event.target as Node)
      ) {
        setIsPriceOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`sticky top-0 z-10 bg-white p-1 ${
        use === 'property' ? 'bg-transparent' : 'bg-white'
      }`}
    >
      <div className="mx-auto mb-5 w-full max-w-6xl rounded-xl border border-gray-400 bg-white text-sm shadow-md">
        <div className="flex flex-col items-stretch md:flex-row">
          {/* City Filter */}
          <div
            className="relative w-full rounded-bl-xl rounded-tl-xl py-2 hover:bg-gray-100"
            ref={cityRef}
          >
            <button
              onClick={() => setIsCitySelectOpen((state) => !state)}
              className="w-full border-r border-r-gray-100 px-4 text-left"
            >
              <p className="mb-1 text-xs font-bold text-gray-800">City</p>
              <p className="text-xs text-gray-400">{city || 'Select City'}</p>
              {isCitySelectOpen ? (
                <ChevronUp
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transform"
                />
              ) : (
                <ChevronDown
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transform"
                />
              )}
            </button>
            {isCitySelectOpen && (
              <FilterCityComponent
                onSetCity={handleCitySelect}
                city={city}
                isLoading={isLoadingFiltered}
                result={filteredProducts}
              />
            )}
          </div>

          {/* Search Filter */}
          <div
            className="relative w-full py-2 hover:bg-gray-100"
            ref={searchRef}
          >
            <div>
              <button className="w-full border-r border-r-gray-100 px-4 text-left">
                <p className="mb-1 text-xs font-bold text-gray-800">
                  {keyword ? 'Keyword' : 'Search Make, Model'}
                </p>
                <input
                  type="text"
                  className="w-full focus:border-none focus:outline-none focus:ring-[none]"
                  style={{ background: 'none' }}
                  value={key}
                  onChange={handleSearchChange}
                  placeholder="Search..."
                />
              </button>
            </div>
            {showSearchResults &&
              filteredProducts &&
              filteredProducts.length > 0 && (
                <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                  <div className="max-h-60 overflow-y-auto">
                    {filteredProducts.map((product, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchSelect(product)}
                        className="flex w-full items-center justify-between border-b border-gray-200 px-4 py-2 text-left hover:bg-gray-50"
                      >
                        <div>
                          <div
                            className="text-sm font-medium"
                            dangerouslySetInnerHTML={{
                              __html: highlightMatch(product.name, key),
                            }}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Price Filter */}
          <div
            className="relative w-full py-2 hover:bg-gray-100"
            ref={priceRef}
          >
            <button
              onClick={() => {
                setIsYearOpen(false);
                setIsPriceOpen((state) => !state);
              }}
              className="w-full border-r border-r-gray-100 px-4 text-left"
            >
              <p className="mb-1 text-xs font-bold text-gray-800">Price</p>
              <p className="text-xs text-gray-400">{priceRange}</p>
              {isPriceOpen ? (
                <ChevronUp
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transform"
                />
              ) : (
                <ChevronDown
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transform"
                />
              )}
            </button>
            {isPriceOpen && (
              <RangeFilter
                onApplyFilters={handlePriceRangeApply}
                onClear={() => handleClearRange('price')}
                type="price"
                defaultFrom={minPrice || '0'}
                defaultUpto={maxPrice || '1000000'}
                isLoading={isLoadingFiltered}
                result={filteredProducts}
              />
            )}
          </div>

          {/* Year Filter */}
          <div
            className={`relative w-full ${
              city || yearRange !== 'Select' || priceRange !== 'Select' || key
                ? 'rounded-br-xl rounded-tr-xl py-2'
                : ''
            } hover:bg-gray-100`}
            ref={yearRef}
          >
            <button
              onClick={() => {
                setIsYearOpen((state) => !state);
                setIsPriceOpen(false);
              }}
              className="w-full border-r border-r-gray-100 px-4 text-left"
            >
              <p className="mb-1 text-xs font-bold text-gray-800">Year</p>
              <p className="text-xs text-gray-400">{yearRange}</p>
              {isYearOpen ? (
                <ChevronUp
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transform"
                />
              ) : (
                <ChevronDown
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transform"
                />
              )}
            </button>
            {isYearOpen && (
              <RangeFilter
                onApplyFilters={handleYearRangeApply}
                onClear={() => handleClearRange('year')}
                type="year"
                defaultFrom={minYear || '2020'}
                defaultUpto={maxYear || '2026'}
                isLoading={isLoadingFiltered}
                result={filteredProducts}
              />
            )}
          </div>

          {/* Clear Filters */}
          {(city ||
            yearRange !== 'Select' ||
            priceRange !== 'Select' ||
            key) && (
            <button
              onClick={handleClearFilters}
              className="ml-4 flex items-center justify-center rounded-br-lg rounded-tr-lg bg-blue-600 px-4 text-sm text-white hover:bg-blue-700"
              disabled={isLoadingFiltered}
            >
              {isLoadingFiltered ? 'Clearing...' : 'Clear Filters'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchFilters;
