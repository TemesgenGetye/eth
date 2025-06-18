import { useState } from 'react';
import { ProductType } from '../type';

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

export default function FilterCityComponent({
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
