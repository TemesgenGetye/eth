import { ChevronDown } from 'lucide-react';
import BrandFilter from '../components/Motor/BrandFilter';
import CarListing from '../components/ui/ProductList';
import SearchFilters from '../components/Motor/Searchfilter';
import Pagination from '../components/Motor/Pagination';
import { Outlet } from 'react-router-dom';

const brands = [
  { name: 'Mercedes-Benz', count: '4644' },
  { name: 'BMW', count: '2017' },
  { name: 'Nissan', count: '1952' },
  { name: 'Land Rover', count: '1552' },
  { name: 'Porsche', count: '1172' },
  { name: 'Ford', count: '1144' },
  { name: 'Audi', count: '916' },
];

export default function CarMarketplace() {
  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-4">
      {/* Search Filters */}
      <SearchFilters use="motor" />

      {/* Breadcrumbs */}
      <div className="container mx-auto py-4 text-sm">
        <div className="flex items-center space-x-2 text-sm text-blue-600">
          <a href="#">Dubai</a>
          <span className="text-gray-400">&gt;</span>
          <a href="#">Motors</a>
          <span className="text-gray-400">&gt;</span>
          <a href="#">Cars</a>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Cars for sale in ethiopia • 32,498 Ads
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

        <BrandFilter brands={brands} />

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1">
          <CarListing
            id="1"
            image="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            price="194,999"
            title="2024 JEEP GRAND CHEROKEE LIMITED PLUS LUXURY GCC 0Km With 3 Yr..."
            make="Jeep"
            model="Grand Cherokee"
            year="2024"
            kilometers="0"
            location="Ras Al Khor, Dubai"
            isPremium
          />
          <CarListing
            id="2"
            image="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            price="539,950"
            title="AED 10,349 pm • 0% Downpayment • SL55 AMG Carbon Pack • Agency Wa..."
            make="Mercedes-Benz"
            model="SL-Class"
            year="2022"
            kilometers="24,000"
            location="Sheikh Zayed Road, Dubai"
            isPremium
          />
          <CarListing
            id="3"
            image="https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf0?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            price="105,000"
            title="2019 Mercedes Benz A35 AMG Aerodynamic Package, Warranty, Excellent..."
            make="Mercedes-Benz"
            model="A-Class"
            year="2019"
            kilometers="79,668"
            location="Al Quoz, Dubai"
            isPremium
          />

          <CarListing
            id="4"
            image="https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=3538&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            price="105,000"
            title="2019 Mercedes Benz A35 AMG Aerodynamic Package, Warranty, Excellent..."
            make="Mercedes-Benz"
            model="A-Class"
            year="2019"
            kilometers="79,668"
            location="Al Quoz, Dubai"
            isPremium
          />

          <CarListing
            id="5"
            image="https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            price="539,950"
            title="AED 10,349 pm • 0% Downpayment • SL55 AMG Carbon Pack • Agency Wa..."
            make="Mercedes-Benz"
            model="SL-Class"
            year="2022"
            kilometers="24,000"
            location="Sheikh Zayed Road, Dubai"
            isPremium
          />
        </div>
        <div className="p-6">
          <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />
        </div>
      </div>
      <Outlet />
    </div>
  );
}
