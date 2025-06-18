import { Search } from 'lucide-react';
import Banners from '../components/Property.tsx/Banner';
import ListProductHorizontal from '../components/ui/ListProductHorizontal';
import PopularSubcatagory from '../components/ui/PopularSubcatagory';
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from 'react-router-dom';
import SolidBento from '../components/ui/BentoGridProduct';
import useCategories from '../hooks/useCategories';
import { cleanString } from '../services/utils';
import { useState, useEffect } from 'react';
import { useSearchProducts } from '../hooks/useSearchProducts';
import { useFilteredProducts } from '../hooks/useFilteredProducts';
export default function CatagoryInfo() {
  const { cname } = useParams<{ cname: string }>();
  const { categories } = useCategories();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeCategory, setActiveCategory] = useState(cname || '');
  const { refetchFiltered } = useFilteredProducts();
  const [_, setQuery] = useSearchParams();
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
    <div className="min-h-screen rounded-lg  ">
      <div
        className="relative m-auto mt-3 w-[80%] items-center rounded-xl bg-cover bg-center py-16"
        style={{
          backgroundImage: `url(${image})`,
        }}
      >
        <div className="absolute inset-0 z-10 rounded-xl bg-black bg-opacity-50"></div>
        <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white shadow-2xl sm:text-5xl">
              Every one is on ETH
            </h1>
            <p className="mb-3 mt-3  text-lg text-gray-300 shadow-2xl shadow-black">
              The largest marketplace in the country
            </p>
          </div>
          {/* search from the catagory */}
          <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mt-8">
              <div className="mx-auto max-w-2xl">
                <div className="relative">
                  <div className="flex items-center rounded-lg bg-white p-1 shadow-lg">
                    <Search className="ml-3 h-6 w-6 text-gray-400" />
                    <input
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder={`Search in ${category?.name || 'category'}`}
                      className="flex-1 border-0 px-4 py-2 focus:outline-none focus:ring-0"
                    />
                    <button className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
                      Search
                    </button>
                  </div>
                  {showSuggestions && (
                    <div className="absolute left-0 top-[calc(100%+5px)] z-50 w-full rounded-md border border-gray-200 bg-white text-black shadow-lg">
                      {isLoading ? (
                        <div className="p-4 text-sm text-gray-500">
                          Loading...
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
                                      console.log('searchValue', searchValue);
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
                                      console.log('searchValue', searchValue);
                                      // refetchFiltered();
                                      navigate(
                                        `/${cleanString(cat.name)}/search?keyword=${cleanString(searchValue)}`
                                      );
                                    }}
                                  >
                                    <div>
                                      <div className="text-sm">
                                        <span>Search in</span>
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
