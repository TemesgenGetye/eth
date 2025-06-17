import { ChevronDown, ChevronUp } from 'lucide-react';
import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFilteredProducts } from '../../hooks/useFilteredProducts';
// import debounce from 'lodash/debounce'; // Install lodash for debouncing
import { ProductType } from '../type';

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
  const [yearRange, setYearRange] = useState('Select');
  const [priceRange, setPriceRange] = useState('Select');
  const [key, setKey] = useState(keyword);
  const [isLoading, setIsLoading] = useState(false);

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
    term: keyword,
    city: query.get('city') || '',
    minPrice: query.get('minPrice') ? Number(query.get('minPrice')) : undefined,
    maxPrice: query.get('maxPrice') ? Number(query.get('maxPrice')) : undefined,
    minYear: query.get('minYear') ? Number(query.get('minYear')) : undefined,
    maxYear: query.get('maxYear') ? Number(query.get('maxYear')) : undefined,
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKey(value);
    setFilterOptions((prev) => ({ ...prev, term: value.trim() }));
    onFilterApplied?.(true);
  };

  // Handle city selection
  const handleCitySelect = async (selectedCity: string) => {
    setIsLoading(true);
    setCity(selectedCity);
    setFilterOptions((prev) => ({ ...prev, city: selectedCity }));
    setIsCitySelectOpen(false);
    onFilterApplied?.(true);
    await refetchFiltered();
    setIsLoading(false);
  };

  // Handle price range application
  const handlePriceRangeApply = async (
    range: string,
    min: number,
    max: number
  ) => {
    setIsLoading(true);
    setPriceRange(range);
    setFilterOptions((prev) => ({ ...prev, minPrice: min, maxPrice: max }));
    setIsPriceOpen(false);
    onFilterApplied?.(true);
    await refetchFiltered();
    setIsLoading(false);
  };

  // Handle year range application
  const handleYearRangeApply = async (
    range: string,
    min: number,
    max: number
  ) => {
    setIsLoading(true);
    setYearRange(range);
    setFilterOptions((prev) => ({ ...prev, minYear: min, maxYear: max }));
    setIsYearOpen(false);
    onFilterApplied?.(true);
    await refetchFiltered();
    setIsLoading(false);
  };

  // Handle clearing filters
  const handleClearFilters = async () => {
    setIsLoading(true);
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
    setIsLoading(false);
  };

  useEffect(() => {
    setQuery(
      Object.fromEntries(
        Object.entries(filterOptions || {})
          .filter(([, v]) => v !== undefined && v !== '')
          .map(([k, v]) => [k, String(v)])
      )
    );
  }, [filterOptions, setQuery]);

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
                isLoading={isLoading || isLoadingFiltered}
                result={filteredProducts}
              />
            )}
          </div>

          <div className="w-full py-2 hover:bg-gray-100">
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
                />
              </button>
            </div>
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
                type="price"
                defaultFrom="0"
                defaultUpto="1000000"
                isLoading={isLoading || isLoadingFiltered}
                result={filteredProducts}
              />
            )}
          </div>

          <div
            className="relative w-full rounded-br-xl rounded-tr-xl py-2 hover:bg-gray-100"
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
                type="year"
                defaultFrom="2020"
                defaultUpto="2026"
                isLoading={isLoading || isLoadingFiltered}
                result={filteredProducts}
              />
            )}
          </div>

          {(city ||
            yearRange !== 'Select' ||
            priceRange !== 'Select' ||
            key) && (
            <button
              onClick={handleClearFilters}
              className="ml-4 flex items-center justify-center px-4 text-sm text-blue-600 hover:text-blue-800"
              disabled={isLoading || isLoadingFiltered}
            >
              {isLoading || isLoadingFiltered ? 'Clearing...' : 'Clear Filters'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const cities = [
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
}: {
  onSetCity: (city: string) => void;
  city: string;
  isLoading: boolean;
  result: ProductType[] | undefined;
}) {
  const [selectedCity, setSelectedCity] = useState(city);

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
    <div className="absolute top-[calc(100%+5px)] z-[9000] min-w-[400px] rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
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
}

function RangeFilter({
  onApplyFilters,
  onClear,
  type,
  defaultFrom,
  defaultUpto,
  result,
  isLoading,
}: RangeFilterProps) {
  const [from, setFrom] = useState(defaultFrom);
  const [upto, setUpto] = useState(defaultUpto);

  const handleApplyFilters = () => {
    const min = parseInt(from) || 0;
    const max = parseInt(upto) || (type === 'year' ? 2026 : 1000000);
    onApplyFilters(`${from}-${upto}`, min, max);
  };

  const handleClear = () => {
    setFrom('');
    setUpto('');
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
    <div className="absolute right-0 top-[calc(100%+15px)] z-[100000] rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
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
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1 font-medium text-gray-900 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1 font-medium text-gray-900 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: '80px 180px' }}>
        <button
          onClick={handleClear}
          disabled={isLoading}
          className="rounded-lg border border-gray-300 bg-white px-1 py-0 font-medium text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
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
