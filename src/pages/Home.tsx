import {
  Search,
  Car,
  Building,
  Briefcase,
  Smartphone,
  Download,
} from 'lucide-react';
import ListForHome from '../components/Home/ListHomeIcon';
import LiatProductHorizontal from '../components/ui/ListProductHorizontal';
import DownloadApp from '../components/ui/DownloadApp';

const categories = {
  Motors: {
    icon: <Car className="h-5 w-5 text-blue-600" />,
    items: [
      'Cars',
      { name: 'Rental Cars', isNew: true },
      'New Cars',
      'Export Cars',
    ],
    viewAll: 'All in Motors',
  },
  'Property for Rent': {
    icon: <Building className="h-5 w-5 text-blue-600" />,
    items: [
      'Residential',
      'Commercial',
      'Rooms For Rent',
      'Monthly Short Term',
    ],
    viewAll: 'All in Property for Rent',
  },
  'Property for Sale': {
    icon: <Building className="h-5 w-5 text-blue-600" />,
    items: ['Residential', 'Commercial', 'New Projects', 'Off-Plan'],
    viewAll: 'All in Property for Sale',
  },
  Classifieds: {
    icon: <Smartphone className="h-5 w-5 text-blue-600" />,
    items: [
      'Electronics',
      'Computers & Networking',
      'Clothing & Accessories',
      'Jewelry & Watches',
    ],
    viewAll: 'All in Classifieds',
  },
  Jobs: {
    icon: <Briefcase className="h-5 w-5 text-blue-600" />,
    items: [
      'Accounting / Finance',
      'Engineering',
      'Sales / Business Development',
      'Secretarial / Front Office',
    ],
    viewAll: 'All in Jobs',
  },
};

const FeaturedListings = [
  {
    id: 1,
    title: '2022 Mercedes-Benz G63 AMG',
    price: 'AED 989,000',
    location: 'addis ababa Marina',
    image:
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Luxury 3BR Apartment | Marina View',
    price: 'AED 12,000/month',
    location: 'Downtown addis ababa',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'iPhone 15 Pro Max - 256GB',
    price: 'AED 4,899',
    location: 'Al Barsha',
    image:
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    title: 'Brand New PS5 with Extra Controller',
    price: 'AED 2,199',
    location: 'Jumeirah',
    image:
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    title: 'Luxury 3BR Apartment | Marina View',
    price: 'AED 12,000/month',
    location: 'Downtown addis ababa',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  },
];

const Home = () => {
  return (
    <div className="mx-auto min-h-screen max-w-7xl rounded-lg bg-gray-50">
      <div
        className="relative m-auto mt-3  items-center rounded-xl bg-cover bg-center py-16"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1624314138470-5a2f24623f10?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <div className="absolute inset-0 z-10 backdrop-brightness-50"></div>
        <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary-900 opacity-80 shadow-2xl sm:text-5xl">
              Find Anything in Ethiopia
            </h1>
            <p className="mt-3 text-lg  text-gray-100 shadow-2xl shadow-black">
              The largest marketplace in the country
            </p>
          </div>
          <div className="mt-8">
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center rounded-lg bg-white p-2 shadow-lg">
                <Search className="ml-3 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="flex-1 border-0 px-4 py-2 focus:outline-none focus:ring-0"
                />
                <button className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 ">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}

      <ListForHome categories={categories} />

      {/* Featured Listings */}
      <LiatProductHorizontal list={FeaturedListings} text="Featured Listing" />

      <LiatProductHorizontal list={FeaturedListings} text="Popular Listing" />

      {/* Download App Section */}

      <DownloadApp />
    </div>
  );
};

export default Home;
