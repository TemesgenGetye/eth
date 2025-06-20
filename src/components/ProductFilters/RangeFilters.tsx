import { useState } from 'react';
import { ProductType } from '../type';
import { useLanguage } from '../../Context/Languge';

interface RangeFilterProps {
  onApplyFilters: (range: string, min: number, max: number) => void;
  onClear?: () => void;
  type: 'price' | 'year';
  defaultFrom: string;
  defaultUpto: string;
  result: ProductType[] | undefined;
  isLoading: boolean;
}

export default function RangeFilter({
  onApplyFilters,
  onClear,
  type,
  defaultFrom,
  defaultUpto,
  result,
  isLoading,
}: RangeFilterProps) {
  const { t } = useLanguage();
  const [from, setFrom] = useState(defaultFrom);
  const [upto, setUpto] = useState(defaultUpto);

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
    <div className="absolute left-0 top-[calc(100%+15px)] z-[100000] rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 grid grid-cols-2 gap-6">
        <div>
          <label
            htmlFor={`from-${type}`}
            className="mb-1 block text-sm font-medium text-gray-400"
          >
            {t('filters.from')}
          </label>
          <input
            id={`from-${type}`}
            type="number"
            value={from}
            onChange={handleFromChange}
            placeholder={
              type === 'year'
                ? t('filters.yearPlaceholderMin')
                : t('filters.pricePlaceholderMin')
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1 font-medium text-gray-900 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <label
            htmlFor={`upto-${type}`}
            className="mb-1 block text-sm font-medium text-gray-400"
          >
            {t('filters.upto')}
          </label>
          <input
            id={`upto-${type}`}
            type="number"
            value={upto}
            onChange={handleUptoChange}
            placeholder={
              type === 'year'
                ? t('filters.yearPlaceholderMax')
                : t('filters.pricePlaceholderMax')
            }
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
          {t('filters.clear')}
        </button>
        <button
          onClick={handleApplyFilters}
          disabled={isLoading}
          className="w-full rounded-lg bg-blue-700 px-6 py-4 font-semibold text-white transition-colors duration-200 hover:bg-blue-800 disabled:bg-blue-400"
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
