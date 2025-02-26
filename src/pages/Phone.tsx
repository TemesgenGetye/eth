import { ChevronDown } from 'lucide-react';
import SearchFilters from '../components/Motor/Searchfilter';
import BrandFilter from '../components/Motor/BrandFilter';
import Pagination from '../components/Motor/Pagination';
import PhoneListing from '../components/Phone/PhoneListing';

const brands = [
  { name: 'Samsung', count: '4644' },
  { name: 'Apple', count: '2017' },
  { name: 'Huawei', count: '1952' },
  { name: 'LG', count: '1552' },
  { name: 'Xiaomi', count: '1172' },
  { name: 'OnePlus', count: '1144' },
  { name: 'Asus', count: '916' },
];

function Phone() {
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

        <BrandFilter brands={brands} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1">
        <PhoneListing
          image="https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=3672&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          price="999"
          title="iPhone 15 Pro Max - 256GB - Titanium Black"
          make="Apple"
          model="iPhone 15 Pro Max"
          year="2023"
          storage="256GB"
          location="Dubai Mall, Dubai"
          isPremium
        />
        <PhoneListing
          image="https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          price="799"
          title="Samsung Galaxy S23 Ultra - 512GB - Phantom Black"
          make="Samsung"
          model="Galaxy S23 Ultra"
          year="2023"
          storage="512GB"
          location="Deira, Dubai"
          isPremium
        />
        <PhoneListing
          image="https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=3672&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          price="699"
          title="Google Pixel 8 Pro - 128GB - Obsidian"
          make="Google"
          model="Pixel 8 Pro"
          year="2023"
          storage="128GB"
          location="Jumeirah, Dubai"
          isPremium
        />
        <PhoneListing
          image="https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          price="599"
          title="OnePlus 11 - 256GB - Eternal Green"
          make="OnePlus"
          model="OnePlus 11"
          year="2023"
          storage="256GB"
          location="Business Bay, Dubai"
          isPremium
        />
        <PhoneListing
          image="https://images.unsplash.com/photo-1611791484670-ce19b801d192?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          price="499"
          title="Xiaomi 13 Pro - 128GB - Ceramic White"
          make="Xiaomi"
          model="13 Pro"
          year="2023"
          storage="128GB"
          location="Al Barsha, Dubai"
          isPremium
        />
      </div>
      <div className="p-6">
        <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />
      </div>
    </div>
  );
}

export default Phone;
