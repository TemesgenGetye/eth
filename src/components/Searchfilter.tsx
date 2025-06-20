import { ChevronDown, ChevronUp, X, Search } from 'lucide-react';
import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFilteredProducts } from '../hooks/useFilteredProducts';
// import debounce from 'lodash/debounce'; // Install lodash for debouncing
import { ProductType } from './type';
import useMediaQuery from '../hooks/useMediaQuery';
import { cn } from '../services/utils';

function SearchFilters({
  use,
  onFilterApplied,
}: {
  use: string;
  onFilterApplied?: (state: boolean) => void;
}) {
  const [query, setQuery] = useSearchParams();
  const keyword = query.get('keyword') || '';
  // console.log('keyword', keyword);
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

  // Initialize filterOptions with all possible filters (excluding search term)
  const [filterOptions, setFilterOptions] = useState<{
    keyword?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    minYear?: number;
    maxYear?: number;
  }>({
    keyword: query.get('keyword') || '',
    city: query.get('city') || '',
    minPrice: query.get('minPrice') ? Number(query.get('minPrice')) : undefined,
    maxPrice: query.get('maxPrice') ? Number(query.get('maxPrice')) : undefined,
    minYear: query.get('minYear') ? Number(query.get('minYear')) : undefined,
    maxYear: query.get('maxYear') ? Number(query.get('maxYear')) : undefined,
  });

  // Handle search input change - only update local state and show dropdown
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKey(value);
    setShowSearchResults(value.length >= 2);
    // Don't update filterOptions or query for search term
  };

  // Handle search result selection - update URL query when product is selected
  const handleSearchSelect = async (product: ProductType) => {
    setKey(product.name);
    setShowSearchResults(false);
    // Update URL query directly when product is selected
    // setQuery((prev) => {
    //   const newParams = new URLSearchParams(prev);
    //   newParams.set('keyword', product.name);
    //   return newParams;
    // });
    onFilterApplied?.(true);
    // Trigger refetch to get filtered results with the selected product and current filters
    setFilterOptions((prev) => ({ ...prev, keyword: product.name }));
  };

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="underline">$1</span>');
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
      setIsPriceOpen(false);
    } else {
      setYearRange('Select');
      setFilterOptions((prev) => ({
        ...prev,
        minYear: undefined,
        maxYear: undefined,
      }));
      setIsYearOpen(false);
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
      city: '',
      minPrice: undefined,
      maxPrice: undefined,
      minYear: undefined,
      maxYear: undefined,
    });
    // Clear search term from URL
    setQuery((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete('keyword');
      return newParams;
    });
    onFilterApplied?.(false);
    await refetchFiltered();
  };

  // Update URL query only for non-search filters
  useEffect(() => {
    // console.log('filterOptions', filterOptions);
    setQuery((prev) => {
      const newParams = new URLSearchParams(prev);
      // Only update non-search filters
      if (filterOptions.city) {
        newParams.set('city', filterOptions.city);
      } else {
        newParams.delete('city');
      }
      if (filterOptions.minPrice !== undefined) {
        newParams.set('minPrice', filterOptions.minPrice.toString());
      } else {
        newParams.delete('minPrice');
      }
      if (filterOptions.maxPrice !== undefined) {
        newParams.set('maxPrice', filterOptions.maxPrice.toString());
      } else {
        newParams.delete('maxPrice');
      }
      if (filterOptions.minYear !== undefined) {
        newParams.set('minYear', filterOptions.minYear.toString());
      } else {
        newParams.delete('minYear');
      }
      if (filterOptions.maxYear !== undefined) {
        newParams.set('maxYear', filterOptions.maxYear.toString());
      } else {
        newParams.delete('maxYear');
      }
      if (filterOptions.keyword) {
        newParams.set('keyword', filterOptions.keyword);
      } else {
        newParams.delete('keyword');
      }
      return newParams;
    });
  }, [filterOptions, setQuery]);

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

  const isMobile = useMediaQuery('(max-width: 780px)');

  if (isMobile) {
    return (
      <div className="sticky top-0 z-10 bg-white p-1 ">
        <div className="mx-auto mb-3 mt-2 w-full max-w-6xl">
          <div className="relative flex w-full items-center rounded-xl border border-gray-300 bg-white px-4 py-3 shadow transition-all focus-within:border-blue-500">
            <input
              type="text"
              className="flex-1 border-0 bg-transparent px-2 py-2 text-base text-gray-700 focus:outline-none focus:ring-0"
              value={key}
              onChange={handleSearchChange}
              placeholder="Search anything in classifieds..."
            />
            <Search className="h-5 w-5 text-gray-400" />
            {showSearchResults &&
              filteredProducts &&
              filteredProducts.filter((product) =>
                product.name.toLowerCase().includes(key.toLowerCase())
              ).length > 0 && (
                <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                  <div className="max-h-60 overflow-y-auto">
                    {filteredProducts
                      .filter((product) =>
                        product.name.toLowerCase().includes(key.toLowerCase())
                      )
                      .map((product, index) => (
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
        </div>
        <div className="hide-scrollbar flex w-full gap-3 overflow-x-auto px-1 pb-2">
          <button
            onClick={() => setIsCitySelectOpen((state) => !state)}
            className={`flex-shrink-0 rounded-full border px-6 py-3 text-base font-semibold transition-all duration-200 ${
              isCitySelectOpen || city
                ? 'border-blue-400 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            {city || 'City'}{' '}
            <ChevronDown className="ml-2 inline-block h-4 w-4" />
          </button>
          <button
            onClick={() => setIsPriceOpen((state) => !state)}
            className={`flex-shrink-0 rounded-full border px-6 py-3 text-base font-semibold transition-all duration-200 ${
              isPriceOpen || priceRange !== 'Select'
                ? 'border-blue-400 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            Price (AED) <ChevronDown className="ml-2 inline-block h-4 w-4" />
          </button>
          <button
            onClick={() => setIsYearOpen((state) => !state)}
            className={`flex-shrink-0 rounded-full border px-6 py-3 text-base font-semibold transition-all duration-200 ${
              isYearOpen || yearRange !== 'Select'
                ? 'border-blue-400 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            Year <ChevronDown className="ml-2 inline-block h-4 w-4" />
          </button>
        </div>
        {/* Dropdowns for city, price, year (reuse existing logic) */}
        {isCitySelectOpen && (
          <div className="fixed inset-x-0 bottom-0 z-[9999] transform transition-transform duration-300 ease-out">
            <div className="h-screen bg-black bg-opacity-50">
              <div className="animate-slide-up absolute bottom-0 w-full translate-y-0 transform bg-white p-6 pb-24 shadow-xl transition-transform duration-300 ease-out">
                <div className="-mt-1 mb-3 flex items-center justify-between border-b border-gray-200 pb-3">
                  <p className="text-sm font-semibold">City</p>
                  <button
                    className="rounded-full bg-black p-1 text-white"
                    onClick={() => setIsCitySelectOpen(false)}
                  >
                    <X size={16} />
                  </button>
                </div>
                <FilterCityComponent
                  onSetCity={handleCitySelect}
                  city={city}
                  isLoading={isLoadingFiltered}
                  result={filteredProducts}
                  onClear={() => {
                    setCity('');
                    setFilterOptions((prev) => ({ ...prev, city: '' }));
                    setIsCitySelectOpen(false);
                    onFilterApplied?.(true);
                    refetchFiltered();
                  }}
                />
              </div>
            </div>
          </div>
        )}
        {isPriceOpen && (
          <div className="fixed inset-x-0 bottom-0 z-[9999] transform transition-transform duration-300 ease-out">
            <div className="h-screen bg-black bg-opacity-50">
              <div className="animate-slide-up absolute bottom-0 w-full translate-y-0 transform bg-white p-6 pb-24 shadow-xl transition-transform duration-300 ease-out">
                <div className="-mt-1 mb-3 flex items-center justify-between border-b border-gray-200 pb-3">
                  <p className="text-sm font-semibold">Price (AED)</p>
                  <button
                    className="rounded-full bg-black p-1 text-white"
                    onClick={() => setIsPriceOpen(false)}
                  >
                    <X size={16} />
                  </button>
                </div>
                <RangeFilter
                  onApplyFilters={handlePriceRangeApply}
                  onClear={() => handleClearRange('price')}
                  type="price"
                  defaultFrom={minPrice || '0'}
                  defaultUpto={maxPrice || '1000000'}
                  isLoading={isLoadingFiltered}
                  result={filteredProducts}
                  className="left-0"
                />
              </div>
            </div>
          </div>
        )}
        {isYearOpen && (
          <div className="fixed inset-x-0 bottom-0 z-[9999] transform transition-transform duration-300 ease-out">
            <div className="h-screen bg-black bg-opacity-50">
              <div className="animate-slide-up absolute bottom-0 w-full translate-y-0 transform bg-white p-6 pb-24 shadow-xl transition-transform duration-300 ease-out">
                <div className="-mt-1 mb-3 flex items-center justify-between border-b border-gray-200 pb-3">
                  <p className="text-sm font-semibold">Year</p>
                  <button
                    className="rounded-full bg-black p-1 text-white"
                    onClick={() => setIsYearOpen(false)}
                  >
                    <X size={16} />
                  </button>
                </div>
                <RangeFilter
                  onApplyFilters={handleYearRangeApply}
                  onClear={() => handleClearRange('year')}
                  type="year"
                  defaultFrom={minYear || '2020'}
                  defaultUpto={maxYear || '2026'}
                  isLoading={isLoadingFiltered}
                  result={filteredProducts}
                  className="right-0"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`sticky top-0 z-10 bg-white p-1 ${
        use === 'property' ? 'bg-transparent' : 'bg-white'
      }`}
    >
      <div className="mx-auto mb-5 w-full max-w-6xl rounded-xl border border-gray-400 bg-white text-sm shadow-md">
        <div className="flex flex-col items-stretch md:flex-row">
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
                onClear={() => {
                  setCity('');
                  setFilterOptions((prev) => ({ ...prev, city: '' }));
                  setIsCitySelectOpen(false);
                  onFilterApplied?.(true);
                  refetchFiltered();
                }}
              />
            )}
          </div>

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
              filteredProducts.filter((product) =>
                product.name.toLowerCase().includes(key.toLowerCase())
              ).length > 0 && (
                <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                  <div className="max-h-60 overflow-y-auto">
                    {filteredProducts
                      .filter((product) =>
                        product.name.toLowerCase().includes(key.toLowerCase())
                      )
                      .map((product, index) => (
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
                className="left-0"
              />
            )}
          </div>

          <div
            className={`relative w-full rounded-br-xl rounded-tr-xl py-2 hover:bg-gray-100`}
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
                className="right-0"
              />
            )}
          </div>

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

const cities = [
  'All Cities',
  'Dubai',
  'Abu Dhabi',
  'Ras Al Khaimah',
  'Sharjah',
  'Fujairah',
  'Ajman',
  'Umm Al Quwain',
  'Al Ain',
];

function FilterCityComponent({
  onSetCity,
  city,
  isLoading,
  result,
  onClear,
}: {
  onSetCity: (city: string) => void;
  city: string;
  isLoading: boolean;
  result: ProductType[] | undefined;
  onClear?: () => void;
}) {
  const [selectedCity, setSelectedCity] = useState(city);
  const isMobile = useMediaQuery('(max-width: 600px)');

  // Reorder cities to put the selected city first
  const orderedCities = selectedCity
    ? [selectedCity, ...cities.filter((c) => c !== selectedCity)]
    : cities;

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
  };

  const handleApplyFilters = () => {
    onSetCity(selectedCity);
  };

  return (
    <div
      className={
        isMobile
          ? ''
          : 'absolute top-[calc(100%+5px)] z-[9000] min-w-[400px] rounded-lg border border-gray-200 bg-white p-6 shadow-sm'
      }
    >
      <div className="mb-6 flex flex-wrap gap-3">
        {orderedCities.map((city) => (
          <button
            key={city}
            onClick={() => handleCitySelect(city)}
            className={`
              rounded-full border px-6 py-3 text-sm font-medium transition-all duration-200
              ${
                selectedCity === city
                  ? 'border-blue-400 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'
              }
            `}
          >
            {city}
          </button>
        ))}
      </div>
      <div
        className={`grid gap-4 border-t border-gray-200 pt-4 ${onClear ? 'grid-cols-2' : ''}`}
        style={{ gridTemplateColumns: '1fr 2fr' }}
      >
        {onClear && (
          <button
            onClick={onClear}
            disabled={isLoading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-4 font-medium text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
          >
            Clear
          </button>
        )}
        <button
          onClick={handleApplyFilters}
          disabled={isLoading}
          className={`rounded-lg bg-blue-700 px-6 py-4 font-semibold text-white transition-colors duration-200 hover:bg-blue-800 disabled:bg-blue-400 ${onClear ? '' : 'w-full'}`}
        >
          {isLoading
            ? 'Loading...'
            : result?.length
              ? `Show ${result.length} Results`
              : 'Apply Filters'}
        </button>
      </div>
    </div>
  );
}

interface RangeFilterProps {
  onApplyFilters: (range: string, min: number, max: number) => void;
  onClear?: () => void;
  type: 'price' | 'year';
  defaultFrom: string;
  defaultUpto: string;
  result: ProductType[] | undefined;
  isLoading: boolean;
  className?: string;
}

function RangeFilter({
  onApplyFilters,
  onClear,
  type,
  defaultFrom,
  defaultUpto,
  result,
  isLoading,
  className,
}: RangeFilterProps) {
  const [from, setFrom] = useState(defaultFrom);
  const [upto, setUpto] = useState(defaultUpto);
  const isMobile = useMediaQuery('(max-width: 600px)');

  const handleApplyFilters = () => {
    const min = parseInt(from) || 0;
    const max = parseInt(upto) || (type === 'year' ? 2026 : 1000000);
    onApplyFilters(`${from}-${upto}`, min, max);
  };

  const handleClear = () => {
    setFrom(defaultFrom);
    setUpto(defaultUpto);
    onClear?.();
  };

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setFrom(value);
    }
  };

  const handleUptoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setUpto(value);
    }
  };

  return (
    <div
      className={
        isMobile
          ? ''
          : cn(
              'absolute top-[calc(100%+5px)] z-[100000] min-w-[320px] rounded-lg border border-gray-200 bg-white p-6 shadow-sm',
              className
            )
      }
    >
      <div className="mb-6 grid grid-cols-2 gap-6">
        <div>
          <label
            htmlFor={`from-${type}`}
            className="mb-1 block text-sm font-medium text-gray-400"
          >
            From
          </label>
          <input
            id={`from-${type}`}
            type="number"
            value={from}
            onChange={handleFromChange}
            placeholder={type === 'year' ? '2000' : '0'}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 font-medium text-gray-900 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <label
            htmlFor={`upto-${type}`}
            className="mb-1 block text-sm font-medium text-gray-400"
          >
            Upto
          </label>
          <input
            id={`upto-${type}`}
            type="number"
            value={upto}
            onChange={handleUptoChange}
            placeholder={type === 'year' ? '2026' : '1000000'}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 font-medium text-gray-900 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>
      <div
        className={`grid grid-cols-[1fr_2fr] gap-4 border-t border-gray-200 pt-4 `}
      >
        <button
          onClick={handleClear}
          disabled={isLoading}
          className="rounded-lg border border-gray-300 bg-white px-4 py-4 font-medium text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
        >
          Clear
        </button>
        <button
          onClick={handleApplyFilters}
          disabled={isLoading}
          className="w-full rounded-lg bg-blue-700 px-6 py-4 font-semibold text-white transition-colors duration-200 hover:bg-blue-800 disabled:bg-blue-400"
        >
          {isLoading
            ? 'Loading...'
            : result?.length
              ? `Show ${result.length} Results`
              : 'Apply Filters'}
        </button>
      </div>
    </div>
  );
}

export default SearchFilters;
