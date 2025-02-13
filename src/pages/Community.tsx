import { List, Search } from 'lucide-react';
import ListProductHorizontal from '../components/ui/ListProductHorizontal';
import DownloadApp from '../components/ui/DownloadApp';

const communityCategories = [
  {
    title: 'Local Events',
    amount: '500+',
  },
  {
    title: 'Volunteer Opportunities',
    amount: '300+',
  },
  {
    title: 'Community Services',
    amount: '1,000+',
  },
  {
    title: 'Skill Sharing',
    amount: '800+',
  },
  {
    title: 'Neighborhood Groups',
    amount: '2,000+',
  },
  {
    title: 'Recycling & Sustainability',
    amount: '400+',
  },
];

const featuredList = [
  {
    id: 1,
    title: 'Community Clean-Up Day',
    price: 'Free',
    location: 'Bole, Addis Ababa',
    image:
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Free Yoga in the Park',
    price: 'Free',
    location: 'Piassa, Addis Ababa',
    image:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2720&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Local Farmers Market',
    price: 'Free Entry',
    location: 'Megenagna, Addis Ababa',
    image:
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Community Art Workshop',
    price: 'AED 50',
    location: 'Sarbet, Addis Ababa',
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2832&auto=format&fit=crop',
  },
  {
    id: 5,
    title: 'Neighborhood Book Swap',
    price: 'Free',
    location: 'CMC, Addis Ababa',
    image:
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=2670&auto=format&fit=crop',
  },
];

function Community() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative m-auto mt-3 w-[80%] items-center rounded-xl bg-cover bg-center py-16 "
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2832&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 z-10 backdrop-brightness-50"></div>
        <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="shadow-4xl text-2xl font-bold text-primary-900 opacity-80 sm:text-5xl">
              Join Your Community
            </h1>
            <p className="shadow-4xl mt-3  text-xl font-semibold text-gray-100 shadow-black">
              Discover events, services, and opportunities near you
            </p>
          </div>
          <div className="mt-8">
            <div className="mx-auto max-w-2xl">
              <div className="flex items-center rounded-lg bg-white p-1 shadow-lg">
                <Search className="ml-3 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Find events, services, or groups"
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
          {communityCategories.map((category, i) => (
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
      <ListProductHorizontal
        list={featuredList}
        text="Featured Community Events"
      />
      <DownloadApp />
    </div>
  );
}

export default Community;
