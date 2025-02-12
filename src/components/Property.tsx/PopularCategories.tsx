// src/components/PopularCategories.jsx
import { useRef } from 'react';

const categories = [
  {
    title: 'Apartment for Rent',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop',
  },
  {
    title: 'Villa for Rent',
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop',
  },
  {
    title: 'Rooms for Rent',
    image:
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop',
  },
  {
    title: 'Monthly Short Term for Rent',
    image:
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop',
  },
  {
    title: 'Commercial for Rent',
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop',
  },
];

export default function PopularCategories() {
  const scrollContainerRef = useRef(null);

  interface Category {
    title: string;
    image: string;
  }

  interface ScrollContainerRef {
    current: HTMLDivElement | null;
  }

  const categories: Category[] = [
    {
      title: 'Apartment for Rent',
      image:
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop',
    },
    {
      title: 'Villa for Rent',
      image:
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop',
    },
    {
      title: 'Rooms for Rent',
      image:
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop',
    },
    {
      title: 'Monthly Short Term for Rent',
      image:
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop',
    },
    {
      title: 'Commercial for Rent',
      image:
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop',
    },
  ];

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    const scrollAmount = container?.offsetWidth
      ? container.offsetWidth * 0.8
      : 0;

    if (direction === 'left') {
      container?.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container?.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-8">
      <h2 className="mb-6 text-2xl font-semibold">Popular Categories</h2>
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 z-10 -ml-4 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-transform hover:scale-110 hover:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <svg
            className="h-6 w-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 z-10 -mr-4 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-transform hover:scale-110 hover:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <svg
            className="h-6 w-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-hidden scroll-smooth px-4"
        >
          {categories.map((category, index) => (
            <div
              key={index}
              className="group relative w-72 flex-none cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden rounded-lg">
                <img
                  src={category.image || '/placeholder.svg'}
                  alt={category.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Blue gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t from-blue-600/60 to-transparent transition-all duration-500 ease-out group-hover:h-full" />

                {/* Animated border */}
                <div className="absolute inset-0 p-2">
                  <div className="relative h-full w-full overflow-hidden">
                    <div className="border-1 absolute inset-0 border-white/0 transition-colors duration-500 group-hover:border-white/100">
                      <div className="absolute inset-0">
                        <div className="absolute left-0 top-0 h-0.5 w-0 bg-white transition-all duration-500 group-hover:w-full"></div>
                        <div className="absolute right-0 top-0 h-0 w-0.5 bg-white transition-all duration-500 group-hover:h-full"></div>
                        <div className="absolute bottom-0 right-0 h-0.5 w-0 bg-white transition-all duration-500 group-hover:w-full"></div>
                        <div className="absolute bottom-0 left-0 h-0 w-0.5 bg-white transition-all duration-500 group-hover:h-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="absolute bottom-4 left-4 z-10 text-lg font-semibold text-white drop-shadow-lg">
                  {category.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {categories.map((_, index) => (
            <div
              key={index}
              className="h-2 w-2 rounded-full bg-gray-300"
              role="presentation"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
