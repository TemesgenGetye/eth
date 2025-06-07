import SearchFilters from '../components/Motor/Searchfilter';
import Banners from '../components/Property.tsx/Banner';
import PopularCategories from '../components/Property.tsx/PopularCategories';
import PopularAreas from '../components/Property.tsx/PopularAreas';
import LiatProductHorizontal from '../components/ui/ListProductHorizontal';
import PopularSubcatagory from '../components/ui/PopularSubcatagory';

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

function Property() {
  return (
    <div className="min-h-screen rounded-lg  ">
      <div
        className="relative m-auto mt-3 w-[80%] items-center rounded-xl bg-cover bg-center py-16"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1512654458600-cf5387bd9428?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <div className="absolute inset-0 z-10 rounded-xl bg-black bg-opacity-50"></div>
        <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white shadow-2xl sm:text-5xl">
              Every one is in ETH
            </h1>
            <p className="mb-3 mt-3  text-lg text-gray-300 shadow-2xl shadow-black">
              The largest marketplace in the country
            </p>
          </div>
          <SearchFilters use="property" />
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <PopularSubcatagory />
        <Banners />
        <PopularCategories />
        <LiatProductHorizontal
          // list={FeaturedListings}
          // text="Featured Listings"
        />
        <PopularAreas />
      </div>
    </div>
  );
}

export default Property;
