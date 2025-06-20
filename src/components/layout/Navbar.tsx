import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';

import TopNav from './TopNav';
import useCategories from '../../hooks/useCategories';
import type { CategoryType } from '../type';
import { useLanguage } from '../../Context/Languge';
import { cleanString } from '../../services/utils';
import MobileBottomNav from './MobileBottomNav';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMyAds = location.pathname.includes('my-ads');
  const { t } = useLanguage();
  return (
    <nav>
      {/* Top Bar */}
      <div className=" bg-white md:border-b md:border-gray-200">
        <div className="m-auto max-w-6xl">
          <div className="mmd:h-12 mmd:justify-between relative mx-auto  flex h-[5rem] max-w-6xl items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className=" flex items-center space-x-2">
              <Link to="/" className="flex items-center">
                <img
                  src="/logo.png"
                  alt="888market"
                  className="mmd:h-10 h-16 w-auto"
                />
                <div className="flex items-center">
                  <button className="mmd:text-sm flex items-center text-xl font-semibold text-gray-600 hover:text-gray-900">
                    {t('common.brandName')}
                  </button>
                </div>
              </Link>
            </div>
            {isMyAds && (
              <button
                className="absolute  left-5 flex h-full items-center md:hidden"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft size={20} />
              </button>
            )}

            {/* TopNav Component */}
            <TopNav />
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      <HoverMenu />
      <MobileBottomNav />
    </nav>
  );
};

export default Navbar;

const HoverMenu = () => {
  const navigate = useNavigate();
  const { categories, isLoading } = useCategories();
  const { t, language } = useLanguage();

  const [hoveredParent, setHoveredParent] = useState<string | null>(null);
  const [activeChild, setActiveChild] = useState<string | null>(null);
  // const [showAllChildren, setShowAllChildren] = useState<boolean>(false);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  // const [numberOfCategories, setNumberOfCategories] = useState<number>(6);

  const direction = useMemo(
    () => (language === 'ar' ? 'rtl' : 'ltr'),
    [language]
  );

  // Early return if loading or no categories
  if (isLoading || !categories) {
    return (
      <div className="flex items-center justify-around bg-white md:border-b md:border-gray-200">
        <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
          <div className="flex h-12 animate-pulse items-center space-x-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-6 w-20 rounded bg-gray-200" />
            ))}
            <div className="ml-4 h-8 w-28 rounded-full bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  // Create Home category with all categories as subcategories
  const homeCategory = {
    id: 0,
    name: t('common.home'),
    subcategories: categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      img_url: cat.img_url || '',
      category_id: String(cat.id),
      subcategories: cat.subcategories || [],
    })),
  };

  // Top-level: Home + first 5 categories
  const topLevelCategories: CategoryType[] = [
    homeCategory,
    ...categories.slice(0, 5).map((cat) => ({
      id: cat.id,
      name: cat.name,
      subcategories: cat.subcategories || [],
    })),
  ];

  const handleMouseEnterParent = (category: string) => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setHoveredParent(category);

    let firstChild = hoveredParent;
    if (category === t('common.home')) {
      firstChild = homeCategory.subcategories?.[0]?.name || hoveredParent;
    } else {
      const parentCategory = categories.find((cat) => cat.name === category);
      firstChild = parentCategory?.subcategories?.[0]?.name || hoveredParent;
    }
    setActiveChild(firstChild);
  };

  const handleMouseEnterChild = (subcategory: string) => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setActiveChild(subcategory);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredParent(null);
      setActiveChild(null);
    }, 300);
    setCloseTimeout(timeout);
  };

  function handleLeaveCategoryOnClick() {
    setHoveredParent(null);
    setActiveChild(null);
  }

  const hanldleShowAllCategories = () => {
    navigate('/');
    setTimeout(() => {
      const middlePosition = window.innerHeight * 0.42;
      window.scrollTo({ top: middlePosition, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div
      className={`flex items-center justify-around bg-white md:border-b md:border-gray-200 `}
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
        <div
          className="mmd:flex mmd:h-12 llg:space-x-20 hidden h-24 items-center space-x-10 "
          dir={direction}
        >
          {/* Render the top-level categories */}
          {topLevelCategories.map((category) => (
            <div
              key={category.id}
              className="relative"
              onMouseEnter={() => handleMouseEnterParent(category.name)}
              onMouseLeave={handleMouseLeave}
              onClick={handleLeaveCategoryOnClick}
            >
              <button
                className="flex h-full items-center justify-around text-nowrap border-b-2 border-transparent  text-sm font-semibold text-gray-600 hover:text-gray-900"
                onClick={() => {
                  if (category.name === t('common.home')) {
                    navigate('/');
                  } else {
                    navigate('/' + cleanString(category.name));
                  }
                }}
              >
                {category.name}
                {category.subcategories &&
                  category.subcategories.length > 0 && (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
              </button>

              {/* Dropdown Menu for Parent Categories */}
              {hoveredParent === category.name &&
                category.subcategories &&
                category.subcategories.length > 0 && (
                  <div
                    className={`dropdown-pointer-menu absolute top-full z-[10000] mt-2 flex ${category?.name === t('common.home') ? 'w-[550px]' : 'w-[280px]'} rounded-lg bg-white p-4 text-sm shadow-lg`}
                    style={{ [direction === 'rtl' ? 'right' : 'left']: 0 }}
                    onMouseEnter={() => handleMouseEnterParent(category.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Child Categories (Left Side) */}
                    <div
                      className={`max-h-96 ${category?.name === t('common.home') ? 'w-2/5 border-x border-gray-200' : 'w-full'} overflow-y-auto pr-4`}
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                      }}
                    >
                      <style>
                        {`
                          .w-2\\/5::-webkit-scrollbar {
                            display: none;
                          }
                        `}
                      </style>
                      {category.subcategories.map((child) => (
                        <button
                          key={child.id}
                          className={`flex w-full items-center justify-between overflow-hidden text-ellipsis text-nowrap rounded-md p-2 text-sm font-semibold ${
                            activeChild === child.name
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                          onMouseEnter={() => handleMouseEnterChild(child.name)}
                          onClick={() => {
                            if (category.name === t('common.home')) {
                              navigate('/' + cleanString(child.name));
                            } else {
                              navigate(
                                `/${cleanString(category.name)}/${cleanString(child.name)}`
                              );
                            }
                          }}
                        >
                          {child.name}
                        </button>
                      ))}
                    </div>

                    {category?.name === t('common.home') && (
                      <div className="w-2/3 ">
                        <p className="border-b border-b-gray-200 p-2 text-sm font-semibold text-gray-800">
                          {activeChild}
                        </p>
                        <div className="mt-2 grid h-96 auto-rows-min grid-cols-1 gap-1 overflow-y-auto md:grid-cols-2">
                          {/* Show subcategories for Home's children */}
                          {category.name === t('common.home') ? (
                            (() => {
                              const active = category.subcategories.find(
                                (c) => c.name === activeChild
                              );
                              // print(active, 'active');
                              if (
                                active &&
                                active.subcategories &&
                                Array.isArray(active.subcategories) &&
                                active.subcategories.length > 0
                              ) {
                                return active.subcategories.map((subcat) => (
                                  <button
                                    key={subcat.id}
                                    className="flex w-full items-center rounded-md p-1 text-sm text-gray-600 hover:bg-gray-50"
                                    onClick={() =>
                                      navigate(
                                        `/${cleanString(active.name)}/${cleanString(subcat.name)}`
                                      )
                                    }
                                  >
                                    {subcat.name}
                                  </button>
                                ));
                              }
                              return (
                                <p className="col-span-2 text-gray-400 md:col-span-3">
                                  --
                                </p>
                              );
                            })()
                          ) : (
                            // No sub-subcategories for other categories
                            <p className="col-span-2 text-gray-400 md:col-span-3">
                              --
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
            </div>
          ))}

          {/* "See More" button */}
          <button
            className="flex items-center rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            onClick={() => hanldleShowAllCategories()}
          >
            {t('common.viewAllCategories')}
          </button>
        </div>
      </div>
    </div>
  );
};
