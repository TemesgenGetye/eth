import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import useProducts from '../../hooks/useProducts';

export default function PopularCategories() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { products } = useProducts();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  // Number of products to show at once (visible section)
  const visibleCount = 3;

  // Calculate number of sections (pages)
  const   productsToShow = products?.slice(0, 10) || [];
  const numSections = Math.max(
    1,
    Math.ceil(productsToShow.length / visibleCount)
  );

  // Update activeIndex on scroll (section-based)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const itemWidth = container.offsetWidth * 0.8;
      const section = Math.round(scrollLeft / (itemWidth * visibleCount));
      setActiveIndex(section);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [visibleCount]);

  // Scroll to section when clicking a dot
  const scrollToIndex = (section: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const itemWidth = container.offsetWidth * 0.8;
    container.scrollTo({
      left: section * itemWidth * visibleCount,
      behavior: 'smooth',
    });
    setActiveIndex(section);
  };

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

  if (products && products.length === 0) return null;
  return (
    <div className="mb-8">
      <h2 className="mb-6 text-2xl font-semibold">Popular Products</h2>
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
          {productsToShow.map((product, index) => (
            <button
              key={index}
              className="group relative w-72 flex-none cursor-pointer"
              onClick={() => navigate(`/detail/${products?.[index]?.id}`)}
            >
              <div className="relative h-48 overflow-hidden rounded-lg">
                <img
                  src={product.imgUrls[0] || '/logo.png'}
                  alt={`pro_img ${index}`}
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
                  {product.name}
                </h3>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: numSections }).map((_, sectionIdx) => (
            <button
              key={sectionIdx}
              className={`h-2 w-2 rounded-full transition-colors ${
                activeIndex === sectionIdx
                  ? 'scale-125 bg-blue-600'
                  : 'bg-gray-400'
              }`}
              onClick={() => scrollToIndex(sectionIdx)}
              aria-label={`Go to section ${sectionIdx + 1}`}
              style={{ outline: 'none', border: 'none', padding: 0 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
