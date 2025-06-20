import {
  Heart,
  Image,
  Share2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavourite } from '../Context/Favourite';
import { cleanString } from '../services/utils';
import { useFavouriteItems } from '../hooks/store';

export default function Favourites() {
  const navigate = useNavigate();

  const [imageIndexes, setImageIndexes] = useState<{ [key: string]: number }>(
    {}
  );

  const { favourite, setFavourite } = useFavourite();
  // console.log('favorite', favourite);
  const { favoriteProducts } = useFavouriteItems();

  const handleImageChange = (
    id: string,
    direction: 'next' | 'prev',
    images: string[]
  ) => {
    setImageIndexes((prevIndexes) => {
      const currentIndex = prevIndexes[id] ?? 0;
      const newIndex =
        direction === 'next'
          ? (currentIndex + 1) % images.length
          : (currentIndex - 1 + images.length) % images.length;

      return { ...prevIndexes, [id]: newIndex };
    });
  };

  function handleFavourite(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) {
    e.stopPropagation();

    if (!favourite.some((fav) => fav == id)) {
      setFavourite([...favourite, id]);
    } else {
      setFavourite(favourite.filter((fav) => fav != id));
    }
  }

  return (
    <div className="mx-auto mb-5 grid max-w-7xl grid-cols-1 gap-4">
      <div className="p-10">
        <p className="text-lg font-semibold ">My Favourites</p>
        <p className="text-sm text-gray-500">
          Your favourite items will appear here.
        </p>
      </div>
      <div className="mx-auto flex w-full max-w-md flex-row items-center justify-end gap-2 p-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full flex-1 rounded-lg border border-gray-300 p-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          aria-label="Search"
        />
        <button
          className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Filter"
        >
          <Filter className="h-5 w-5" />
        </button>
      </div>

      {favoriteProducts?.map((product) => {
        const currentImageIndex = imageIndexes[product.id] ?? 0;

        return (
          <div
            key={product.id}
            className="relative cursor-pointer rounded-lg border-b border-b-gray-200 bg-white p-4 shadow-sm"
            onClick={() =>
              navigate(
                `/${cleanString(product.category?.name)}/${cleanString(product.subcategory?.name)}/${cleanString(product?.name)}`,
                { state: { pid: product?.id } }
              )
            }
          >
            <div className="flex gap-4">
              <div className="relative h-48 w-72 flex-shrink-0 overflow-hidden rounded-lg">
                {product.imgUrls.length > 1 && (
                  <>
                    <button
                      className="absolute left-0.5 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/80 p-1 ring-1 ring-gray-300 hover:bg-gray-300 hover:ring-2 hover:ring-gray-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageChange(product.id, 'prev', product.imgUrls);
                      }}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      className="absolute right-0.5 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/80 p-1 ring-1 ring-gray-300 hover:bg-gray-300 hover:ring-2 hover:ring-gray-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageChange(product.id, 'next', product.imgUrls);
                      }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}
                <img
                  src={product.imgUrls[currentImageIndex]}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 ease-in-out"
                />
                {product.imgUrls.length > 1 && (
                  <div className="absolute bottom-2 left-2 flex items-center space-x-1 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
                    <span>
                      <Image size={14} />
                    </span>
                    <span>{`${currentImageIndex + 1} / ${product.imgUrls.length}`}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {product.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold">
                        {product.price.discounted === product.price.orignal ? (
                          <span>{product.price.orignal} AED</span>
                        ) : (
                          <>
                            <span>{product.price.discounted} AED </span>
                            <span>•</span>
                            <span className="text-gray-500 line-through">
                              {product.price.orignal}
                            </span>
                            <span>AED</span>
                            <div className="text-red-500">
                              {Number(
                                product.price.orignal - product.price.discounted
                              ).toFixed(2)}{' '}
                              AED Downpayment
                            </div>
                          </>
                        )}
                      </span>
                      {product.stock > 0 && (
                        <span className="rounded bg-[#40b740] px-2 py-0.5 text-xs font-medium text-white">
                          IN STOCK ( {product.stock})
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col items-start ">
                      <span>• {product.slug || 'N/A'}</span>
                      {/* <p className="cursor-pointer text-sm text-blue-500 hover:underline">
                        {item.variants.length > 0
                          ? item.variants.length + ' variants'
                          : ''}
                      </p> */}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="h-7 w-7 shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle share logic
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button
                      className="h-7 w-7 text-red-500"
                      onClick={(e) => {
                        handleFavourite(e, product?.id);
                      }}
                    >
                      {favourite.some((fav) => fav === product.id) ? (
                        <Heart className="h-5 w-5  " fill="red" />
                      ) : (
                        <Heart className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="line-clamp-2 pr-10 text-sm text-gray-600">
                  {product.description}
                </p>
                <div className="space-y-2 text-sm text-gray-500">{'dubai'}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
