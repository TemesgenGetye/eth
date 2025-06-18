import { ChevronDown } from 'lucide-react';
import SearchFilters from '../components/Searchfilter';
import BrandFilter from '../components/Motor/BrandFilter';
import { FurnitureListing } from '../components/Furniture/FurnitureList';
import Pagination from '../components/Motor/Pagination';

function Furniture() {
  const furnitureBrands = [
    { name: 'IKEA', count: 15 },
    { name: 'Ashley Furniture', count: 12 },
    { name: 'Wayfair', count: 10 },
    { name: 'Ethan Allen', count: 8 },
    { name: 'West Elm', count: 6 },
    { name: 'Herman Miller', count: 4 },
    { name: 'Steelcase', count: 2 },
  ];

  const gardenBrands = [
    { name: 'Husqvarna', count: 14 },
    { name: 'Stihl', count: 12 },
    { name: 'John Deere', count: 10 },
    { name: 'Toro', count: 8 },
    { name: 'Black+Decker', count: 6 },
    { name: 'Greenworks', count: 4 },
    { name: 'Ryobi', count: 2 },
  ];

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-4">
      {/* Search Filters */}
      <SearchFilters use="motor" />

      {/* Breadcrumbs */}
      <div className="container mx-auto py-4 text-sm">
        <div className="flex items-center space-x-2 text-sm text-blue-600">
          <a href="#">Addis Ababa</a>
          <span className="text-gray-400">&gt;</span>
          <a href="#">Classifie</a>
          <span className="text-gray-400">&gt;</span>
          <a href="#" className="text-gray-500">
            Furniures and Guarden
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Furniture for sale in ethiopia • 32,498 Ads
          </h2>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-sm">
              <span>Sort: Default</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <button className="flex items-center space-x-2 text-sm">
              <span>Save Search</span>
            </button>
          </div>
        </div>
      </div>

      <BrandFilter brands={furnitureBrands} />
      <BrandFilter brands={gardenBrands} />

      {/* Featured Listings */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1">
        <FurnitureListing
          image="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=2670&auto=format&fit=crop"
          price="12,000"
          title="Modern Wooden Dining Table - 6 Seater"
          material="Wood"
          condition="New"
          location="Bole, Addis Ababa"
          isPremium
        />
        <FurnitureListing
          image="https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=2670&auto=format&fit=crop"
          price="7,500"
          title="Elegant Velvet Sofa - 3 Seater"
          material="Velvet"
          condition="Like New"
          location="Sarbet, Addis Ababa"
          isPremium
        />
        <FurnitureListing
          image="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=2670&auto=format&fit=crop"
          price="9,000"
          title="Minimalist Bookshelf - White Oak"
          material="Wood"
          condition="Brand New"
          location="Piassa, Addis Ababa"
          isPremium
        />
        <FurnitureListing
          image="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2670&auto=format&fit=crop"
          price="4,500"
          title="Scandinavian Bed Frame - King Size"
          material="Solid Wood"
          condition="Used - Good"
          location="Megenagna, Addis Ababa"
          isPremium
        />
        <FurnitureListing
          image="https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=2670&auto=format&fit=crop"
          price="3,200"
          title="Ergonomic Office Chair - Black Mesh"
          material="Mesh & Metal"
          condition="Used - Excellent"
          location="CMC, Addis Ababa"
          isPremium
        />
      </div>
      <div className="p-6">
        <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />
      </div>
    </div>
  );
}

export default Furniture;
