import { useNavigate } from 'react-router-dom';
import { product } from '../../Data/Product';
import { useEffect, useRef, useState } from 'react';

export default function PopularCategories({ id }: { id: string }) {
  const scrollContainerRef = useRef(null);
  const [images, setImages] = useState([]);
  const [currentCatgoryProduct, setCurrentCatgoryProduct] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const currentCatgoryProduct = product?.filter((pro) =>
      pro?.categories?.includes(id.split(':')[1])
    );
    setCurrentCatgoryProduct(currentCatgoryProduct);
  }, [id]);

  useEffect(() => {
    currentCatgoryProduct.map((pro) => {
      setImages((img) => [...img, pro?.image[0]]);
    });
  }, [id, currentCatgoryProduct]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef?.current;
    const scrollAmount = container?.offsetWidth
      ? container?.offsetWidth * 0.8
      : 0;

    if (direction === 'left') {
      container?.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container?.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (currentCatgoryProduct.length === 0) return null;
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
          {images?.slice(0, 10).map((img, index) => (
            <button
              key={index}
              className="group relative w-72 flex-none cursor-pointer"
              onClick={() =>
                navigate(`/detail/${currentCatgoryProduct[index]?._id}`)
              }
            >
              <div className="relative h-48 overflow-hidden rounded-lg">
                <img
                  src={img || '/logo.png'}
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
                  {currentCatgoryProduct[index]?.title.en}
                </h3>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {currentCatgoryProduct.map((_, index) => (
            <div
              key={index}
              className="h-2 w-2 rounded-full bg-gray-400"
              role="presentation"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
