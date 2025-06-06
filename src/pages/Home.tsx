import { Search } from 'lucide-react';
import ListForHome from '../components/Home/ListHomeIcon';
import LiatProductHorizontal from '../components/ui/ListProductHorizontal';
import DownloadApp from '../components/ui/DownloadApp';
import { useBackground } from '../Context/BlurBackground';
import PopularCategories from '../components/Property.tsx/PopularCategories';
import FloatingCart from '../components/ui/FloatingCart';

const Home = () => {
  const { blurBackground } = useBackground();

  return (
    <div className={`m-auto min-h-screen max-w-7xl rounded-lg `}>
      <FloatingCart />
      {/* Improved Overlay */}
      <div
        className={`overlay fixed inset-0 z-40 h-screen w-screen bg-black bg-opacity-10 transition-all duration-300 ${
          blurBackground ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      ></div>

      <div
        className="relative m-auto mt-3 items-center overflow-hidden rounded-xl bg-cover bg-center py-16"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1624314138470-5a2f24623f10?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <div className="absolute inset-0 z-10 rounded-xl bg-black bg-opacity-50"></div>
        <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white shadow-2xl sm:text-5xl">
              Find Anything in Dubai
            </h1>
            <p className="mt-3 text-lg text-gray-300 shadow-2xl shadow-black">
              The largest market place in the country
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
                <button className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <ListForHome />

      {/* Popular Categories */}

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        {/* <PopularCategories id={'fruits-vegetable:632aca2b4d87ff2494210be8'} /> */}
        <PopularCategories id={'beauty-healths:632ab2864d87ff2494210a8a'} />
      </div>

      {/* Featured Listings */}
      <LiatProductHorizontal />

      {/* Download App Section */}
      <DownloadApp />
    </div>
  );
};

export default Home;
