import { ArrowLeft, X } from 'lucide-react';
import { useMemo, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchProducts } from '../../hooks/useSearchProducts';
import useCategories from '../../hooks/useCategories';
import { cleanString } from '../../services/utils';
import { CategoryType } from '../type';
import { useLanguage } from '../../Context/Languge';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
}

const SearchModal = ({
  isOpen,
  onClose,
  searchValue,
  setSearchValue,
}: SearchModalProps) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const { categories } = useCategories();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: searchResults, isLoading } = useSearchProducts(
    searchValue,
    activeCategory
  );

  const { t } = useLanguage();

  const processedResults = useMemo(() => {
    if (!searchResults) return [];

    const grouped = searchResults.reduce(
      (acc, product) => {
        const key = `${product.name}|${product.subcategory?.id}`;
        if (!acc[key]) {
          acc[key] = {
            name: product.name,
            subcategory: product.subcategory,
            category: product.category,
            count: 0,
          };
        }
        acc[key].count++;
        return acc;
      },
      {} as Record<
        string,
        {
          name: string;
          subcategory: CategoryType | undefined;
          category: CategoryType | undefined;
          count: number;
        }
      >
    );

    return Object.values(grouped);
  }, [searchResults]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100); // Small delay to ensure the element is focusable
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center border-b border-gray-200 p-4">
          <button onClick={onClose} className="mr-2 p-2">
            <ArrowLeft size={24} />
          </button>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={`${t('common.searchh')} ${activeCategory === 'all' ? t('common.anything') : activeCategory}`}
              className="w-full rounded-lg bg-gray-100 px-4 py-2 focus:outline-none"
            />
            {searchValue && (
              <button
                onClick={() => setSearchValue('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
              >
                <X size={18} className="text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="border-b border-gray-200 p-4">
          <div className="hide-scrollbar flex space-x-3 overflow-x-auto">
            <button
              onClick={() => setActiveCategory('all')}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                activeCategory === 'all'
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
              }`}
            >
              All
            </button>
            {categories?.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.name.toLowerCase())}
                className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                  activeCategory === category.name.toLowerCase()
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : processedResults.length > 0 ? (
            <ul>
              {processedResults.map((item, index) => (
                <li
                  key={index}
                  onClick={() => {
                    navigate(
                      `/${cleanString(
                        item.category?.name ?? ''
                      )}/search?keyword=${cleanString(item.name)}`
                    );
                    onClose();
                  }}
                  className="flex cursor-pointer items-center justify-between border-b border-gray-100 p-4"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.category?.name}
                    </p>
                  </div>
                  <span className="text-sm text-blue-600">
                    {item.count} Ads
                  </span>
                </li>
              ))}
            </ul>
          ) : searchValue.length > 0 ? (
            <ul>
              {categories?.map((category) => (
                <li
                  key={category.id}
                  onClick={() => {
                    navigate(
                      `/${cleanString(
                        category.name
                      )}/search?keyword=${cleanString(searchValue)}`
                    );
                    onClose();
                  }}
                  className="cursor-pointer border-b border-gray-100 p-4"
                >
                  <p>
                    Search in{' '}
                    <span className="font-semibold">{category.name}</span>
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
