import { Search } from 'lucide-react';
import Banners from '../components/Property.tsx/Banner';
import ListProductHorizontal from '../components/ui/ListProductHorizontal';
import PopularSubcatagory from '../components/ui/PopularSubcatagory';
import { useParams, useNavigate } from 'react-router-dom';
import SolidBento from '../components/ui/BentoGridProduct';
import useCategories from '../hooks/useCategories';
import { cleanString } from '../services/utils';
import { useState, useEffect } from 'react';
import { useSearchProducts } from '../hooks/useSearchProducts';
import { useLanguage } from '../Context/Languge';

export default function CatagoryInfo() {
  const { t } = useLanguage();
  const { cname } = useParams<{ cname: string }>();
  const { categories } = useCategories();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeCategory, setActiveCategory] = useState(cname || '');
  const category = categories?.find(
    (category) => cleanString(category.name) === activeCategory
  );
  const image = category?.imgUrl;

  const { data: searchResults, isLoading } = useSearchProducts(
    searchValue,
    category?.name.toLowerCase() || ''
  );

  useEffect(() => {
    if (cname) {
      setActiveCategory(cname);
    }
  }, [cname]);

  // useEffect(() => {
  //   const params = new URLSearchParams(location.search);
  //   const keyword = params.get('keyword') || '';
  //   if (keyword) {
  //     setSearchValue(keyword);
  //     setShowSuggestions(true);
  //   }
  // }, [location.search]);

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight})`, 'gi');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span
          key={i}
          className="underline decoration-blue-500 decoration-2 underline-offset-4"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  useEffect(() => {
    setShowSuggestions(searchValue.length >= 2);
  }, [searchValue]);

  return (
    <div className="min-h-screen overflow-x-hidden rounded-lg">
      <div
        className="relative m-auto mt-2 w-full max-w-[1600px] px-3 sm:mt-3 sm:w-[92%] sm:px-0 md:w-[85%] lg:w-[80%]"
        style={{
          backgroundImage: image ? `url(${image})` : undefined,
          backgroundColor: image ? undefined : '#1e293b',
        }}
      >
        <div
          className="relative min-h-[280px] rounded-xl bg-cover bg-center py-8 sm:min-h-[320px] sm:py-12 md:py-16"
          style={
            image
              ? { backgroundImage: `url(${image})` }
              : { backgroundImage: 'none' }
          }
        >
          <div className="absolute inset-0 z-10 rounded-xl bg-black/50" />
          <div className="relative z-20 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-balance text-xl font-bold leading-tight text-white drop-shadow-md xs:text-2xl sm:text-4xl md:text-5xl">
                {t('common.everyoneIsOnEth')}
              </h1>
              <p className="mx-auto mb-2 mt-2 max-w-2xl text-pretty px-1 text-sm text-gray-200 sm:mb-3 sm:mt-3 sm:text-base md:text-lg">
                {t('common.largestMarketplace')}
              </p>
            </div>
            <div className="relative z-20 mx-auto mt-6 max-w-2xl sm:mt-8">
              <div className="relative">
                <div className="flex flex-col gap-2 rounded-lg border-2 border-white/20 bg-white p-1.5 shadow-lg focus-within:border-blue-500 sm:flex-row sm:items-stretch sm:gap-0 sm:p-1">
                  <div className="flex min-w-0 flex-1 items-center">
                    <Search className="ms-2 h-5 w-5 shrink-0 text-gray-400 sm:ms-3 sm:h-6 sm:w-6" />
                    <input
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder={`${t('common.search')} ${t('common.searchInCategory')} ${category?.name || 'category'}`}
                      className="min-w-0 flex-1 border-0 bg-transparent px-2 py-2.5 text-sm focus:outline-none focus:ring-0 sm:px-4 sm:py-2 sm:text-base"
                    />
                  </div>
                  <button
                    type="button"
                    className="shrink-0 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 sm:rounded-lg sm:px-6 sm:py-2"
                  >
                    {t('common.search')}
                  </button>
                </div>
                  {showSuggestions && (
                    <div className="absolute left-0 top-[calc(100%+6px)] z-50 max-h-[min(60vh,320px)] w-full overflow-y-auto rounded-md border border-gray-200 bg-white text-black shadow-lg">
                      {isLoading ? (
                        <div className="p-4 text-sm text-gray-500">
                          {t('common.loading')}
                        </div>
                      ) : (
                        <>
                          <ul className="py-2">
                            {(searchResults?.length ?? 0) > 0
                              ? (searchResults ?? []).map((item, idx) => (
                                  <li
                                    key={idx}
                                    className="flex w-full cursor-pointer items-center justify-between border-b border-gray-200 px-4 py-2 hover:bg-[rgba(0,_0,_0,_0.04)]"
                                    onClick={() => {
                                      setSearchValue(item.name);
                                      setShowSuggestions(false);
                                      // setQuery({ term: searchValue });
                                      // console.log('searchValue', searchValue);
                                      // refetchFiltered();
                                      navigate(
                                        `/${cleanString(item.category.name)}/search?keyword=${cleanString(item.name)}`
                                      );
                                    }}
                                  >
                                    <div>
                                      <div className="mb-1 text-sm font-semibold">
                                        {highlightText(item.name, searchValue)}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {item.subcategory?.name &&
                                          highlightText(
                                            item.subcategory.name,
                                            searchValue
                                          )}
                                      </div>
                                    </div>
                                  </li>
                                ))
                              : (categories ?? []).map((cat, idx) => (
                                  <li
                                    key={idx}
                                    className="flex w-full cursor-pointer items-center justify-between border-b border-gray-200 px-4 py-2 hover:bg-[rgba(0,_0,_0,_0.04)]"
                                    onClick={() => {
                                      setSearchValue(cat.name);
                                      setShowSuggestions(false);
                                      setActiveCategory(cleanString(cat.name));

                                      // setQuery({ term: searchValue });
                                      // console.log('searchValue', searchValue);
                                      // refetchFiltered();
                                      navigate(
                                        `/${cleanString(cat.name)}/search?keyword=${cleanString(searchValue)}`
                                      );
                                    }}
                                  >
                                    <div>
                                      <div className="text-sm">
                                        <span>
                                          {t('common.searchInCategory')}
                                        </span>
                                        <span className="pl-1 font-semibold">
                                          {highlightText(
                                            cat?.name,
                                            searchValue
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                          </ul>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <PopularSubcatagory id={activeCategory || ''} />
        <Banners id={activeCategory ?? ''} />
        {/* <PopularCategories /> */}
        <ListProductHorizontal cid={category?.id} />
        <SolidBento />
      </div>
    </div>
  );
}
