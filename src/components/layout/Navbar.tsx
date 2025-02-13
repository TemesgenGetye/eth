import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, ChevronDown } from 'lucide-react';
import TopNav from './TopNav';

const categoryMenus = {
  Motor: [
    ['Cars by Brand', [['high', 'Toyota'], 'BMW', 'Mercedes', 'Nissan']],
    ['Cars by Type', ['Sedan', 'SUV', 'Sports Car', 'Luxury']],
    [
      'Price Range',
      ['Under 50,000', '50,000-100,000', '100,000-200,000', 'Above 200,000'],
    ],
    [
      'Car Services',
      ['Car Insurance', 'Car Loans', 'Car Inspection', 'Car Rental'],
    ],
  ],

  Property: [
    ['Residential', ['Apartments', 'Villas', 'Townhouses', 'Rooms']],
    ['Commercial', ['Offices', 'Shops', 'Warehouses', 'Land']],
    [
      'Popular Areas',
      ['Dubai Marina', 'Downtown Dubai', 'Palm Jumeirah', 'JBR'],
    ],
    [
      'Price Range',
      ['Up to 50,000', '50,000-100,000', '100,000-150,000', '150,000+'],
    ],
  ],
  Job: [
    [
      'Popular Categories',
      ['IT & Software', 'Sales', 'Marketing', 'Engineering'],
    ],
    ['Job Type', ['Full Time', 'Part Time', 'Remote', 'Internship']],
    [
      'Experience Level',
      ['Entry Level', 'Mid Level', 'Senior Level', 'Manager'],
    ],
    ['Salary Range', ['0-5,000', '5,000-10,000', '10,000-20,000', '20,000+']],
  ],
  Classified: [
    [
      'Popular Categories',
      ['IT & Software', 'Sales', 'Marketing', 'Engineering'],
    ],
    ['Job Type', ['Full Time', 'Part Time', 'Remote', 'Internship']],
    [
      'Experience Level',
      ['Entry Level', 'Mid Level', 'Senior Level', 'Manager'],
    ],
    ['Salary Range', ['0-5,000', '5,000-10,000', '10,000-20,000', '20,000+']],
  ],
  'Mobile Phone': [
    ['Brands', ['Apple', 'Samsung', 'Huawei', 'Google']],
    ['Price Range', ['Under 1,000', '1,000-2,000', '2,000-4,000', '4,000+']],
    ['Condition', ['New', 'Used - Like New', 'Used - Good', 'Used - Fair']],
    ['Accessories', ['Cases', 'Chargers', 'Screen Protectors', 'Power Banks']],
  ],

  'garden & Furniture ': [
    ['Furniture', ['Sofas', 'Chairs', 'Tables', 'Lamps']],
    ['Garden', ['Plants', 'Flowers', 'Trees', 'Shrubs']],
    ['Price Range', ['Under 1,000', '1,000-2,000', '2,000-4,000', '4,000+']],
    ['Condition', ['New', 'Used - Like New', 'Used - Good', 'Used - Fair']],
    ['Accessories', ['Cases', 'Chargers', 'Screen Protectors', 'Power Banks']],
  ],
  Community: [
    ['Activities', ['Classes', 'Workshops', 'Events', 'Meet-ups']],
    ['Services', ['Cleaning', 'Moving', 'Maintenance', 'Pet Care']],
    ['Items', ['Books', 'Sports', 'Musical Instruments', 'Art']],
  ],
};

const Navbar = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <nav>
      {/* Top Bar */}
      <div className="border-b border-b-gray-200 bg-white">
        <div className="m-auto max-w-7xl ">
          <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center">
                <img
                  src="./logo.png"
                  alt="Dubizzle Logo"
                  className="h-10 w-auto"
                />
              </Link>
              <div className="flex items-center">
                <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                  Ethiopia
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>

            <TopNav />
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      <HavorMenu
        catagory={categoryMenus}
        setHoveredCategory={setHoveredCategory}
        hoveredCategory={hoveredCategory}
      />
    </nav>
  );
};

export default Navbar;

function HavorMenu({
  catagory,
  setHoveredCategory,
  hoveredCategory,
}: {
  catagory: { [key: string]: any };
  setHoveredCategory: (category: string | null) => void;
  hoveredCategory: string | null;
}) {
  const navigate = useNavigate();
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const [hoveredSubCategory, setHoveredSubCategory] = useState<string | null>(
    null
  );

  const handleMouseEnter = (category: string) => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setHoveredCategory(category);
    setHoveredSubCategory(null);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredCategory(null);
      setHoveredSubCategory(null);
    }, 400);
    setCloseTimeout(timeout);
  };

  const handleSubCategoryMouseEnter = (subCategory: string) => {
    setHoveredSubCategory(subCategory);
  };

  return (
    <div className="flex items-center justify-center border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center space-x-20">
          {Object.keys(catagory).map((category) => (
            <div
              key={category}
              className="relative"
              onMouseEnter={() => handleMouseEnter(category)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="flex items-center justify-around text-nowrap border-b-2 border-transparent text-sm font-semibold text-gray-600 hover:text-gray-900"
                onClick={() =>
                  navigate(`${category.trim().split(' ').pop()?.toLowerCase()}`)
                }
              >
                {category === 'All Categories' && (
                  <Menu className="mr-2 h-3 w-3" />
                )}
                {category}
              </button>

              {/* Dropdown Menu */}
              {hoveredCategory === category && catagory[category] && (
                <div
                  className="dropdown-pointer-menu absolute left-[-20px] top-full z-50 mt-[15px] rounded-lg bg-white p-6 text-sm shadow-xl ring-1 ring-black ring-opacity-5"
                  onMouseEnter={() => handleMouseEnter(category)}
                  onMouseLeave={handleMouseLeave}
                >
                  <p className="mb-3 text-sm text-gray-500">{`Explore ${category.toLowerCase()} options`}</p>
                  <div className="grid w-52 grid-cols-[repeat(auto-fit,minmax(1fr,1fr))]">
                    {catagory[category].map(
                      ([section, items]: [string, string[]], idx: number) => (
                        <div
                          key={idx}
                          className="relative"
                          onMouseEnter={() =>
                            handleSubCategoryMouseEnter(section)
                          }
                          onMouseLeave={() => setHoveredSubCategory(null)}
                        >
                          <p
                            className={`cursor-pointer text-nowrap border-b-gray-300 py-2 pl-3 text-sm font-semibold  text-gray-700 hover:border-b hover:text-blue-600 ${hoveredSubCategory === section ? 'border-b-gray-400 text-blue-600' : ''}`}
                          >
                            {section}
                          </p>

                          <p className="text-sm text-gray-400">{` ${section.toLowerCase()} options`}</p>

                          {hoveredSubCategory === section && (
                            <>
                              <div
                                className="absolute left-full  top-0 rounded-lg bg-white text-sm shadow-xl ring-1 ring-black ring-opacity-5"
                                onMouseEnter={() =>
                                  handleSubCategoryMouseEnter(section)
                                }
                                onMouseLeave={() => setHoveredSubCategory(null)}
                              >
                                <p className="p-4 text-sm text-gray-400">
                                  {`Explore ${section.toLowerCase()} options`}
                                </p>
                                <div className="grid w-96 grid-cols-[repeat(auto-fit,minmax(1fr,1fr))]">
                                  {Array.isArray(items) &&
                                    items.map(
                                      (item: string, itemIdx: number) => (
                                        <>
                                          {item !== '' && (
                                            <p
                                              className="cursor-pointer text-nowrap border-b-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:border-b  hover:text-blue-600 "
                                              key={itemIdx}
                                            >
                                              <Link
                                                to="#"
                                                className="text-sm text-gray-600 hover:text-blue-600"
                                              >
                                                <p className="">{item}</p>
                                              </Link>
                                            </p>
                                          )}
                                        </>
                                      )
                                    )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
