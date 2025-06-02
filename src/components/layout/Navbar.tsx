import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import TopNav from './TopNav';
import { categories } from '../../Data/Catagorie';
import { useBackground } from '../../Context/BlurBackground';

const Navbar = () => {
  return (
    <nav>
      {/* Top Bar */}
      <div className="border-b border-b-gray-200 bg-white">
        <div className="m-auto max-w-6xl">
          <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center">
                <img src="./logo.png" alt="888market" className="h-10 w-auto" />
              </Link>
              <div className="flex items-center">
                <button className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900">
                  888Market
                </button>
              </div>
            </div>

            {/* TopNav Component */}
            <TopNav />
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      <HoverMenu />
    </nav>
  );
};

export default Navbar;

const HoverMenu = () => {
  const navigate = useNavigate();

  // const { blurBackground, setBlurBackground } = useBackground();

  const [hoveredParent, setHoveredParent] = useState<string | null>(null);
  const [activeChild, setActiveChild] = useState<string | null>(null);
  const [showAllChildren, setShowAllChildren] = useState<boolean>(false); // State for "Show More"
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const [numberOfCategories, setNumberOfCategories] = useState<number>(10);

  const homeCategory = categories[0];
  const topLevelCategories = [
    homeCategory,
    ...homeCategory.children.slice(0, 4), // First 5 children of Home
  ];

  const handleMouseEnterParent = (category: string) => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setHoveredParent(category);

    // Find the first child of the hovered parent category
    const parentCategory = categories.find(
      (cat) =>
        cat.name.en === category ||
        cat.children.find((child) => child.name.en === category)
    );
    const firstChild = parentCategory?.children?.[0]?.name.en || hoveredParent;
    setActiveChild(firstChild);
    setShowAllChildren(false);
  };

  const handleMouseEnterChild = (category: string) => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }

    setActiveChild(category);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredParent(null);
      setActiveChild(null);
    }, 300); // Delay to allow smooth transition

    setCloseTimeout(timeout);
  };

  // const handleShowMore = () => {
  //   setShowAllChildren(true);
  // };

  function handleLeaveCategoryOnClick() {
    setHoveredParent(null);
    setActiveChild(null);
  }
  const handleShowMoreForDropdown = () => {
    setNumberOfCategories((number) => number + 2);
  };

  const hanldleShowAllCategories = () => {
    navigate('/');
    setTimeout(() => {
      const middlePosition = window.innerHeight * 0.5;
      window.scrollTo({ top: middlePosition, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div
      className={`flex items-center justify-around border-b border-gray-200 bg-white `}
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
        <div className="flex h-12 items-center space-x-20">
          {/* Render the top-level categories */}
          {topLevelCategories.map((category) => (
            <div
              key={category._id}
              className="relative"
              onMouseEnter={() => handleMouseEnterParent(category.name.en)}
              onMouseLeave={handleMouseLeave}
              onClick={handleLeaveCategoryOnClick}
            >
              <button
                className="flex h-full items-center justify-around text-nowrap border-b-2 border-transparent  text-sm font-semibold text-gray-600 hover:text-gray-900"
                onClick={() => {
                  if (category.name.en !== 'Home') {
                    navigate(
                      '/category/' +
                        category.name.en
                          .toLowerCase()
                          .replace(/\s+/g, '-')
                          .replace(/[^a-z0-9-]/g, '')
                          .replace(/-+/g, '-')
                          .replace(/^-|-$/g, '') +
                        `:${category._id}`
                    );
                  } else {
                    navigate('/');
                  }
                }}
              >
                {category.name.en}
                {category.children && category.children.length > 0 && (
                  <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </button>

              {/* Dropdown Menu for Parent Categories */}
              {hoveredParent === category.name.en &&
                category.children &&
                category.children.length > 0 && (
                  <div
                    className="dropdown-pointer-menu absolute left-0 top-full z-50 mt-2 flex w-[550px] rounded-lg bg-white p-4 text-sm shadow-lg"
                    onMouseEnter={() =>
                      handleMouseEnterParent(category.name.en)
                    }
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Child Categories (Left Side) */}
                    <div className="w-2/5 space-y-2 border-r border-gray-200 pr-4">
                      {(showAllChildren
                        ? category.children
                        : category.children.slice(0, numberOfCategories)
                      ).map((child) => (
                        <button
                          key={child._id}
                          className={`flex w-full items-center justify-between overflow-hidden text-ellipsis text-nowrap rounded-md p-2 text-sm font-semibold ${
                            activeChild === child.name.en
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                          onMouseEnter={() =>
                            handleMouseEnterChild(child.name.en)
                          }
                          onClick={() => {
                            navigate(`/product/${child._id}`);
                          }}
                        >
                          {child.name.en}
                          {child.children && child.children.length > 0 && (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </button>
                      ))}
                      {!showAllChildren && category.children.length > 10 && (
                        <button
                          className="w-full rounded-md p-2 text-left text-sm font-semibold text-blue-600 hover:bg-gray-50"
                          onClick={handleShowMoreForDropdown}
                        >
                          Show More
                        </button>
                      )}
                    </div>

                    <div className="w-2/3 ">
                      <p className="border-b border-b-gray-200 p-2 text-sm font-semibold text-gray-800">
                        {activeChild === 'Electronics'
                          ? hoveredParent
                          : activeChild}
                      </p>
                      <div className="mt-2 grid h-96 auto-rows-min grid-cols-1 gap-1 overflow-y-auto md:grid-cols-2">
                        {category.children.find(
                          (child) => child.name.en === activeChild
                        )?.children?.length ? (
                          category.children
                            .find((child) => child.name.en === activeChild)
                            ?.children?.map((subchild) => (
                              <>
                                <button
                                  key={subchild._id}
                                  className="flex w-full items-center rounded-md p-1 text-sm text-gray-600 hover:bg-gray-50"
                                  onClick={() =>
                                    navigate(`/product/${subchild._id}`)
                                  }
                                >
                                  {subchild.name.en}
                                </button>
                              </>
                            ))
                        ) : (
                          <p className="col-span-2 text-gray-400 md:col-span-3">
                            --
                          </p> // Placeholder for no subcategories
                        )}
                      </div>
                    </div>
                  </div>
                )}
            </div>
          ))}

          {/* "See More" button (does nothing) */}
          <button
            className="flex items-center rounded-full bg-blue-600 p-2 text-sm font-semibold text-white hover:bg-blue-700"
            onClick={() => hanldleShowAllCategories()}
          >
            All categories
          </button>
        </div>
      </div>
    </div>
  );
};
