import { ChevronDown } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

interface FilterSelectProps {
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  placeholder,
  options,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="w-full  border-r border-r-gray-300 bg-white px-4  text-left "
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="text-sm font-medium text-gray-800">{placeholder}</p>
        <p className="text-sm text-gray-400"> {value}</p>
        <ChevronDown
          size={16}
          className="absolute right-4 top-1/2 -translate-y-1/2 transform"
        />
      </button>
      {isOpen && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border-r border-r-gray-300 bg-white ">
          {options.map((option) => (
            <li
              key={option}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

function SearchFilters({ use }: { use: string }) {
  const [city, setCity] = useState('addis ababa');
  const [makeModel, setMakeModel] = useState('');
  const [priceRange, setPriceRange] = useState('0-50,000');
  const [year, setYear] = useState('2024');
  const [kilometers, setKilometers] = useState('33');
  const [filters, setFilters] = useState('Regional Specs');

  const cities = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'];
  const priceRanges = [
    '0-50,000',
    '50,000-100,000',
    '100,000-150,000',
    '150,000+',
  ];
  const years = Array.from({ length: 30 }, (_, i) => (2024 - i).toString());
  const kilometerRanges = [
    '0-50,000',
    '50,000-100,000',
    '100,000-150,000',
    '150,000+',
  ];
  const filterOptions = ['Regional Specs', 'Keywords', 'GCC Specs', 'Warranty'];

  return (
    <div
      className={`sticky top-0 z-10 bg-white p-1 ${use === 'property' ? 'bg-transparent' : 'bg-white'}`}
    >
      <div className=" mx-auto mb-5 mt-5 w-full max-w-6xl rounded-xl border border-gray-400 bg-white p-2 text-sm shadow-md">
        <div className="flex flex-col items-stretch gap-3 md:flex-row">
          <div className="w-full md:w-[200px]">
            <FilterSelect
              placeholder="City"
              options={cities}
              value={city}
              onChange={setCity}
            />
          </div>

          <div className="flex-1">
            <input
              type="text"
              placeholder="Search Make, Model"
              value={makeModel}
              onChange={(e) => setMakeModel(e.target.value)}
              className="w-44  border-r border-r-gray-300 px-4 py-2 "
            />
          </div>

          <div className="w-full md:w-[200px]">
            <FilterSelect
              placeholder="Price Range"
              options={priceRanges}
              value={priceRange}
              onChange={setPriceRange}
            />
          </div>

          <div className="w-full md:w-[150px]">
            <FilterSelect
              placeholder="Year"
              options={years}
              value={year}
              onChange={setYear}
            />
          </div>

          <div className="w-full md:w-[200px]">
            <FilterSelect
              placeholder="Kilometers"
              options={kilometerRanges}
              value={kilometers}
              onChange={setKilometers}
            />
          </div>

          <div className="w-full md:w-[250px]">
            <FilterSelect
              placeholder="Filters"
              options={filterOptions}
              value={filters}
              onChange={setFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchFilters;
