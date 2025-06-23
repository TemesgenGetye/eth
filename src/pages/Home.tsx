import { Search } from 'lucide-react';
import ListForHome from '../components/Home/ListHomeIcon';
import PopularCategories from '../components/ui/PopularCategories';
import DownloadApp from '../components/ui/DownloadApp';
import ListProductHorizontal from '../components/ui/ListProductHorizontal';
import { useSearchProducts } from '../hooks/useSearchProducts';
import { useEffect, useState } from 'react';
import FloatingCart from '../components/ui/FloatingCart';
import { useBackground } from '../Context/BlurBackground';
import { useNavigate } from 'react-router-dom';
import { cleanString } from '../services/utils';
import useCategories from '../hooks/useCategories';
import useMediaQuery from '../hooks/useMediaQuery';
import AnimatedCategoryIcon from '../components/ui/AnimatedCategoryIcon';
import { CategoryType } from '../components/type';
import { useSearchModal } from '../Context/SearchModalContext';
import { useLanguage } from '../Context/Languge';
import { useVerficationModal } from '../Context/VerficationModal';
import VerificationBar from '../components/Verfication/verification';

const Home = () => {
  const { blurBackground } = useBackground();
  const [searchValue, setSearchValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [active, setActive] = useState('all');
  const { categories } = useCategories();
  const isMdUp = useMediaQuery('(max-width: 768px)');
  const { openSearchModal, isSearchModalOpen } = useSearchModal();
  const { t } = useLanguage();

  const { data: searchResults, isLoading } = useSearchProducts(
    searchValue,
    active
  );
  const navigate = useNavigate();
  const { open, setOpen } = useVerficationModal();

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
    if (isMdUp) {
      if (searchValue.length >= 1 && !isSearchModalOpen) {
        openSearchModal(searchValue);
      }
    } else {
      setShowSuggestions(searchValue.length >= 2);
    }
  }, [searchValue, isMdUp, openSearchModal, isSearchModalOpen]);

  useEffect(() => {
    if (!isSearchModalOpen) {
      setSearchValue('');
    }
  }, [isSearchModalOpen]);

  return (
    <div className="m-auto min-h-screen max-w-7xl rounded-lg">
      <FloatingCart />
      {/* Improved Overlay */}

      {isMdUp ? (
        <div className="m-auto max-w-7xl rounded-lg px-2 pt-6">
          <div className="flex w-full items-center rounded-full border border-gray-300 bg-white px-4 py-1 shadow transition-all focus-within:border-blue-500">
            <div className="mr-3 flex items-center">
              <AnimatedCategoryIcon
                categories={categories as CategoryType[]}
                size={32}
              />
            </div>
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              type="text"
              placeholder="Search for anything"
              className="flex-1 border-0 bg-transparent px-2 py-2 text-base text-gray-700 focus:outline-none focus:ring-0"
            />
            <button className="ml-3 flex items-center justify-center p-3 text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">
              <Search className="h-6 w-6" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div
            className={`overlay fixed inset-0 z-40 h-screen w-screen bg-black bg-opacity-10 transition-all duration-300 ${
              blurBackground ? 'visible opacity-100' : 'invisible opacity-0'
            }`}
          ></div>
          <div
            className="relative m-auto mx-5 mt-3 items-center rounded-xl bg-cover bg-center py-8 xl:mx-0"
            style={{
              backgroundImage: "url('/dubai1.jpg')",
            }}
          >
            <div className="absolute inset-0 z-10 rounded-xl bg-black bg-opacity-50"></div>
            <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white sm:text-4xl">
                  {t('common.findAnythingInDubai')}
                </h1>
                <p className="mt-5 text-sm font-semibold text-gray-300">
                  {t('common.largestMarketplace')}
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
                    {t('common.all')}
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
                  <div className="group flex w-full items-center rounded-lg border border-gray-300 bg-white px-6 py-1 shadow transition-all focus-within:border-blue-500">
                    <div className="mr-3 flex items-center">
                      <AnimatedCategoryIcon
                        categories={categories as CategoryType[]}
                        size={32}
                      />
                    </div>
                    <input
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      type="text"
                      placeholder={
                        active === 'all'
                          ? t('common.searchForAnything')
                          : `${t('common.searchFor')} ${active}`
                      }
                      className="flex-1 border-0 bg-transparent px-4 py-2 text-lg text-gray-700 focus:outline-none focus:ring-0"
                    />
                    <button className="ml-3 flex items-center justify-center p-3 text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">
                      <Search className="h-6 w-6" />
                    </button>
                  </div>
                  {showSuggestions && (
                    <div className="absolute left-0 top-[calc(100%+5px)] z-50 w-full rounded-md border border-gray-200 bg-white text-black shadow-lg">
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
                                        <span>{t('common.searchIn')}</span>
                                        <span className="pl-1 font-semibold">
                                          {highlightText(
                                            category?.name,
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
        </>
      )}

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
