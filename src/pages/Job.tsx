import { useState } from 'react';
import {
  Search,
  Briefcase,
  MapPin,
  Clock,
  ChevronDown,
  BookA,
} from 'lucide-react';

const companies = [
  {
    name: 'E A I Decoration Design & Fit out LLC',
    logo: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'RTC 1 Employment Solutions',
    logo: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'almine',
    logo: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'MILESTONE HOMES REAL ESTATE BROKER',
    logo: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
  },
];

// Job categories with images
const jobCategories = [
  {
    title: 'Sales / Business Development',
    count: '299+ Jobs',
    image:
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=500&fit=crop',
  },
  {
    title: 'Driver / Delivery',
    count: '144+ Jobs',
    image:
      'https://images.unsplash.com/photo-1601752943749-7dd8d89f407a?w=800&h=500&fit=crop',
  },
  {
    title: 'Accounting / Finance',
    count: '143+ Jobs',
    image:
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=500&fit=crop',
  },
  {
    title: 'Secretarial / Front Office',
    count: '113+ Jobs',
    image:
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=500&fit=crop',
  },
];
export default function Job() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="m-auto min-h-screen max-w-6xl">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="container mx-auto mt-3 rounded-lg bg-blue-50 px-4 py-8">
          <div className="mb-4 flex justify-end ">
            <button className="rounded-lg border border-blue-400 p-2 font-medium text-blue-600 shadow-lg hover:text-blue-700">
              I am a Recruiter
            </button>
          </div>
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold">
              Job hunting <span className="text-blue-600">made easy</span>
              <br />
              with ETH
            </h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for jobs"
                className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Popular Jobs */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="mb-6 text-2xl font-semibold">Popular Jobs</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-2 flex items-center gap-2 text-blue-600">
                <Briefcase className="h-10 w-10" />
              </div>
              <p className="mb-4 text-lg font-semibold">
                {
                  [
                    'Salesman and Sales Lady',
                    'Mart Cashier',
                    'Waiter or Waitress',
                    'Receptionist Male\\Female',
                  ][i]
                }
              </p>
              <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-5 w-5" />
                <span>Full Time</span>
              </div>
              <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                <span className="text-md my-2 font-medium">Birr</span>
                <span className="my-2">
                  {
                    [
                      '2,000 - 3,999',
                      '4,000 - 5,999',
                      '2,000 - 3,999',
                      '4,000 - 5,999',
                    ][i]
                  }
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>Addis Ababa</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Companies */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="mb-6 text-2xl font-semibold">Featured Companies</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
          {companies.map((company, i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <img
                src={company.logo || '/placeholder.svg'}
                alt={company.name}
                className="mb-2 aspect-square w-full object-contain"
              />
              <p className="line-clamp-2 text-center text-sm text-gray-800">
                {company.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Job by Qualifications */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="mb-6 text-2xl font-semibold">Jobs By Qualification</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-2 flex items-center gap-2 text-blue-600">
                <BookA className="h-10 w-10" />
              </div>
              <p className="my-2 text-lg font-semibold">
                {
                  [
                    'High School',
                    "Bachelor's Degree",
                    "Master's Degree",
                    'Doctorate',
                  ][i]
                }
              </p>

              <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                <span className=" text-lg ">
                  {['(355+ jobs)', '(25+ jobs)', '(10+ jobs)', '(5+ jobs)'][i]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs By Category */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="mb-6 text-2xl font-semibold">Jobs By Category</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {jobCategories.map((category, i) => (
            <div key={i} className="group relative overflow-hidden rounded-lg">
              <img
                src={category.image || '/placeholder.svg'}
                alt={category.title}
                className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-black/50 p-4">
                <h3 className="mb-1 font-semibold text-white">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-200">{category.count}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <button className="inline-flex items-center font-medium text-blue-600 hover:text-blue-700">
            View More Categories
            <ChevronDown className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>

      {/* CV Upload Section */}
      <div className="boreder-gray-200 container mx-auto my-5 rounded-lg border bg-white px-4 py-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="max-w-xl">
            <h2 className="mb-4 text-2xl font-semibold">
              80% of the recruiters hire candidates with CV
            </h2>
            <p className="mb-6 text-gray-600">
              Here are some reasons why you should upload a CV to your profile:-
            </p>
            <ul className="mb-6 space-y-2">
              <li>
                1) Boost your chances of getting ahead of other candidates
              </li>
              <li>2) Enable recruiters to easily view your contact details</li>
              <li>3) Showcase your professional accomplishments</li>
            </ul>

            <button className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700">
              <label htmlFor="upload-cv" className="cursor-pointer">
                Upload CV
              </label>
              <input
                type="file"
                id="upload-cv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Handle file upload logic here
                    // console.log('File selected:', file.name);
                  }
                }}
              />
            </button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=400&fit=crop"
            alt="CV illustration"
            className="hidden h-72 w-72 rounded-lg object-cover lg:block"
          />
        </div>
      </div>
    </div>
  );
}
