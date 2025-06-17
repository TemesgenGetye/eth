import { Search } from 'lucide-react';
import ListForHome from '../components/Home/ListHomeIcon';
import PopularCategories from '../components/Property.tsx/PopularCategories';
import DownloadApp from '../components/ui/DownloadApp';
import ListProductHorizontal from '../components/ui/ListProductHorizontal';
import { useSearchProducts } from '../hooks/useSearchProducts';
import { useEffect, useState } from 'react';
import FloatingCart from '../components/ui/FloatingCart';
import { useBackground } from '../Context/BlurBackground';
import { useNavigate } from 'react-router-dom';
import { cleanString } from '../services/utils';
import useCategories from '../hooks/useCategories';

const Home = () => {
  const { blurBackground } = useBackground();
  const [searchValue, setSearchValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [active, setActive] = useState('all');
  const { categories } = useCategories();

  const { data: searchResults, isLoading } = useSearchProducts(
    searchValue,
    active
  );
  const navigate = useNavigate();

  useEffect(() => {
    setShowSuggestions(searchValue.length >= 2);
  }, [searchValue]);

  return (
    <div className="m-auto min-h-screen max-w-7xl rounded-lg">
      <FloatingCart />
      {/* Improved Overlay */}
      <div
        className={`overlay fixed inset-0 z-40 h-screen w-screen bg-black bg-opacity-10 transition-all duration-300 ${
          blurBackground ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      ></div>
      <div
        className="relative m-auto mt-3 items-center rounded-xl bg-cover bg-center py-8"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1624314138470-5a2f24623f10?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <div className="absolute inset-0 z-10 rounded-xl bg-black bg-opacity-50"></div>
        <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white sm:text-4xl">
              Find Anything in Dubai
            </h1>
            <p className="mt-5 text-sm font-semibold text-gray-300">
              The largest market place in the country
            </p>
          </div>
        </div>
        <div className="relative z-50 mt-3">
          <div className="mx-auto max-w-4xl rounded-md bg-black/40 p-10">
            <ul className="m-2 flex gap-3">
              <li
                className={` flex cursor-pointer items-center justify-center  px-5  text-sm ${active === 'all' ? 'bg-blue-700 text-white hover:bg-blue-800' : 'text-white hover:bg-blue-700 hover:text-white'} rounded-full`}
                onClick={() => setActive('all')}
              >
                All
              </li>
              {categories?.map((category) => (
                <li
                  key={category?.id}
                  className={`flex cursor-pointer items-center justify-center px-5  text-sm ${active === category?.name?.toLowerCase() ? 'bg-blue-700 text-white hover:bg-blue-800' : 'text-white  hover:bg-blue-700 hover:text-white'} rounded-full`}
                  onClick={() => setActive(category?.name.toLowerCase())}
                >
                  {category?.name}
                </li>
              ))}
            </ul>
            <div className="relative">
              <div className="group flex w-full items-center rounded-lg border-2 border-gray-50 bg-white p-2 shadow-lg focus-within:border-blue-500">
                <Search className="ml-3 h-6 w-6 text-gray-400 group-focus-within:text-blue-700" />
                <input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  type="text"
                  placeholder={`Search for ${active === 'all' ? 'anything' : active}`}
                  className="flex-1 border-0 px-4 py-2 focus:outline-none focus:ring-0"
                />
                <button className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
                  Search
                </button>
              </div>
              {showSuggestions && (
                <div className="absolute left-0 top-[calc(100%+5px)] z-50 w-full rounded-md border border-gray-200 bg-white text-black shadow-lg">
                  {isLoading ? (
                    <div className="p-4 text-sm text-gray-500">Loading...</div>
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
                                  navigate(
                                    `/${cleanString(item.category.name)}/search?keyword=${cleanString(item.name)}`
                                  );
                                }}
                              >
                                <div>
                                  <div className="text-sm font-semibold">
                                    {item.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {item.subcategory?.name}
                                  </div>
                                </div>
                              </li>
                            ))
                          : (categories ?? []).map((category, idx) => (
                              <li
                                key={idx}
                                className="flex w-full cursor-pointer items-center justify-between border-b border-gray-200 px-4 py-2 hover:bg-[rgba(0,_0,_0,_0.04)]"
                                onClick={() => {
                                  setSearchValue(category.name);
                                  setShowSuggestions(false);
                                  navigate(
                                    `/${cleanString(category.name)}/search?keyword=${cleanString(searchValue)}`
                                  );
                                }}
                              >
                                <div>
                                  <div className="text-sm">
                                    <span>Search in</span>
                                    <span className="pl-1 font-semibold">
                                      {category?.name}
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
      {/* Categories Section */}
      <ListForHome />
      {/* Popular Categories */}

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <PopularCategories />
      </div>
      {/* Featured Listings */}
      <ListProductHorizontal />
      {/* Download App Section */}
      <DownloadApp />
    </div>
  );
};

export default Home;
