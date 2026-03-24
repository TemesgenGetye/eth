import { useEffect, useState } from 'react';
import { ProductType } from '../type';
import { useLanguage } from '../../Context/Languge';
import {
  CITY_FILTER_ALL,
  getRegionEntriesForCountry,
  type CountryCode,
} from '../../data/ethiopiaCities';
import useMediaQuery from '../../hooks/useMediaQuery';

export default function FilterCityComponent({
  onSetCity,
  city,
  isLoading,
  result,
  onClear,
  country = 'Ethiopia',
}: {
  onSetCity: (city: string) => void;
  city: string;
  isLoading: boolean;
  result: ProductType[] | undefined;
  onClear?: () => void;
  country?: CountryCode;
}) {
  const { t } = useLanguage();
  const [selectedCity, setSelectedCity] = useState(
    city || CITY_FILTER_ALL,
  );
  const isMobile = useMediaQuery('(max-width: 600px)');

  const regionEntries = getRegionEntriesForCountry(country);

  useEffect(() => {
    setSelectedCity(city || CITY_FILTER_ALL);
  }, [city]);

  const handleCitySelect = (name: string) => {
    setSelectedCity(name);
  };

  const handleApplyFilters = () => {
    onSetCity(selectedCity);
  };

  const chipClass = (active: boolean) =>
    `
      rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200
      ${
        active
          ? 'border-blue-400 bg-blue-50 text-blue-700'
          : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'
      }
    `;

  return (
    <div
      className={
        isMobile
          ? 'max-h-[55vh] overflow-y-auto pr-1'
          : 'absolute top-[calc(100%+5px)] z-[9000] max-h-[min(70vh,520px)] min-w-[min(100vw-2rem,480px)] overflow-y-auto rounded-lg border border-gray-200 bg-white p-6 shadow-sm'
      }
    >
      <div className="mb-4">
        <button
          type="button"
          onClick={() => handleCitySelect(CITY_FILTER_ALL)}
          className={chipClass(selectedCity === CITY_FILTER_ALL)}
        >
          {t('filters.allCities')}
        </button>
      </div>

      <div className="mb-6 space-y-5">
        {regionEntries.map(([region, cities]) => (
          <div key={region}>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
              {region}
            </p>
            <div className="flex flex-wrap gap-2">
              {cities.map((cityName) => (
                <button
                  key={`${region}:${cityName}`}
                  type="button"
                  onClick={() => handleCitySelect(cityName)}
                  className={chipClass(selectedCity === cityName)}
                >
                  {cityName}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        className={`grid gap-4 border-t border-gray-200 pt-4 ${onClear ? 'grid-cols-2' : ''}`}
        style={{ gridTemplateColumns: onClear ? '1fr 2fr' : undefined }}
      >
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            disabled={isLoading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-4 font-medium text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
          >
            {t('filters.clear')}
          </button>
        )}
        <button
          type="button"
          onClick={handleApplyFilters}
          disabled={isLoading}
          className={`rounded-lg bg-blue-700 px-6 py-4 font-semibold text-white transition-colors duration-200 hover:bg-blue-800 disabled:bg-blue-400 ${onClear ? '' : 'w-full'}`}
        >
          {isLoading
            ? t('common.loading')
            : result?.length
              ? `${t('filters.show')} ${result.length} ${t('filters.results')}`
              : t('filters.applyFilters')}
        </button>
      </div>
    </div>
  );
}
