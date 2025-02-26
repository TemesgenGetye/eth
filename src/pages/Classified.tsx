import { List, Search } from 'lucide-react';
import ListProductHorizontal from '../components/ui/ListProductHorizontal';
import DownloadApp from '../components/ui/DownloadApp';

const classifiedCategories = [
  {
    title: 'Electronics',
    amount: '11,000+',
  },
  {
    title: 'Computers & Networking',
    amount: '8,000+',
  },
  {
    title: 'Clothing & Accessories',
    amount: '5,000+',
  },
  {
    title: 'Jewelry & Watches',
    amount: '3,000+',
  },
  {
    title: 'Furniture',
    amount: '2,000+',
  },
  {
    title: 'Sports & Outdoors',
    amount: '1,000+',
  },
];

const featuredList = [
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

function Classified() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative m-auto mt-3 w-[80%] items-center rounded-xl bg-cover bg-center py-16 "
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1484502249930-e1da807099a5?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <div className="absolute inset-0 z-10 backdrop-brightness-50 "></div>
        <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="shadow-4xl text-2xl font-bold text-primary-900 opacity-80 sm:text-5xl">
              Your favorite place
            </h1>
            <p className="shadow-4xl mt-3  text-xl font-semibold text-gray-100 shadow-black">
              for great deals on secondhand items
            </p>
          </div>
          <div className="mt-8">
            <div className="mx-auto max-w-2xl">
              <div className="flex items-center rounded-lg bg-white p-1 shadow-lg">
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

      <div className="container m-auto mx-auto max-w-7xl px-4  py-8">
        <h2 className="mb-6 text-2xl font-semibold">Popular Categories</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
          {classifiedCategories.map((category, i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-200 bg-white p-2 p-4 text-center shadow-xl transition-shadow hover:shadow-md"
            >
              <h3 className="mb-2 text-nowrap text-sm font-semibold text-gray-600">
                {category.title}
              </h3>
              <p className="text-xl text-gray-600">{category.amount}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Listings */}
      <ListProductHorizontal list={featuredList} text="Featured Listing" />
      <DownloadApp />
    </div>
  );
}

export default Classified;
