import {
  Heart,
  Image,
  // Share2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavourite } from '../Context/Favourite';
import { cleanString } from '../services/utils';
import { useFavouriteItems } from '../hooks/store';
import { useLanguage } from '../Context/Languge';

export default function Favourites() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [imageIndexes, setImageIndexes] = useState<{ [key: string]: number }>(
    {}
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showInitialSkeleton, setShowInitialSkeleton] = useState(true);

  const { favourite, setFavourite } = useFavourite();
  const { favoriteProducts, isLoadingFavorites } = useFavouriteItems();

  useEffect(() => {
    if (!isLoadingFavorites) {
      const timer = setTimeout(() => {
        setShowInitialSkeleton(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoadingFavorites]);

  useEffect(() => {
    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const displayedItems = useMemo(() => {
    if (showInitialSkeleton) return [];
    return (
      favoriteProducts?.filter((product) => {
        if (!product) return false;
        const nameMatch = product.name
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());
        const descMatch = product.description
          ?.toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());
        return nameMatch || !!descMatch;
      }) || []
    );
  }, [favoriteProducts, debouncedSearchTerm, showInitialSkeleton]);

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

  if (showInitialSkeleton) {
    return (
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:mb-20">
        <div className="p-4 sm:p-10">
          <div className="mb-2 h-6 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="mx-auto flex w-full max-w-md flex-row items-center justify-end gap-2 p-4">
          <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
          <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="relative flex animate-pulse flex-col gap-4 rounded-lg border-b border-b-gray-200 bg-white p-4 shadow-sm md:flex-row"
          >
            <div className="h-48 w-full rounded-lg bg-gray-200 md:w-72" />
            <div className="flex-1 space-y-3">
              <div className="h-6 w-32 rounded bg-gray-200" />
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-4 w-40 rounded bg-gray-200" />
              <div className="h-8 w-32 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const FavouritesItemsSkeleton = () => (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="relative flex animate-pulse flex-col gap-4 rounded-lg border-b border-b-gray-200 bg-white p-4 shadow-sm md:flex-row"
        >
          <div className="h-48 w-full rounded-lg bg-gray-200 md:w-72" />
          <div className="flex-1 space-y-3">
            <div className="h-6 w-32 rounded bg-gray-200" />
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="h-4 w-40 rounded bg-gray-200" />
            <div className="h-8 w-32 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="mx-auto mb-20 grid max-w-7xl grid-cols-1 gap-4 md:mb-0">
      <div className="p-4 sm:p-10">
        <p className="text-lg font-semibold">
          {' '}
          {t('common.navigation.myFavourites')}
        </p>
        <p className="text-sm text-gray-500">
          {t('common.navigation.yourFavItems')}
        </p>
      </div>
      <div className="mx-auto flex w-full max-w-md flex-row items-center justify-end gap-2 p-4">
        <input
          type="text"
          placeholder={t('common.searchPlaceholder')}
          className="w-full flex-1 rounded-lg border border-gray-300 p-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          aria-label={t('common.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={t('common.filter')}
        >
          <Filter className="h-5 w-5" />
        </button>
      </div>

      {isSearching ? (
        <FavouritesItemsSkeleton />
      ) : displayedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 text-center">
          {favoriteProducts && favoriteProducts.length > 0 ? (
            <div>
              <p className="mt-4 text-lg font-medium text-gray-900">
                No results for "{searchTerm}"
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Try checking your spelling or use more general terms
              </p>
            </div>
          ) : (
            <>
              <Heart className="h-16 w-16 text-gray-300" />
              <p className="mt-4 text-lg font-medium text-gray-900">
                {t('common.noFavouritesYet')}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {t('common.addItemsToFavourites')}
              </p>
              <button
                onClick={() => navigate('/')}
                className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                {t('common.continueShopping')}
              </button>
            </>
          )}
        </div>
      ) : (
        displayedItems.map((product) => {
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
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative h-48 w-full flex-shrink-0 overflow-hidden rounded-lg md:w-72">
                  {product.imgUrls.length > 1 && (
                    <>
                      <button
                        className="absolute left-0.5 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/80 p-1 ring-1 ring-gray-300 hover:bg-gray-300 hover:ring-2 hover:ring-gray-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageChange(
                            product.id,
                            'prev',
                            product.imgUrls
                          );
                        }}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        className="absolute right-0.5 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/80 p-1 ring-1 ring-gray-300 hover:bg-gray-300 hover:ring-2 hover:ring-gray-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageChange(
                            product.id,
                            'next',
                            product.imgUrls
                          );
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
                          {product.price.discounted ===
                          product.price.orignal ? (
                            <span>
                              {product.price.orignal} {t('common.aed')}
                            </span>
                          ) : (
                            <>
                              <span>
                                {product.price.discounted}{' '}
                                {t('common.aed')}{' '}
                              </span>
                              <span>•</span>
                              <span className="text-gray-500 line-through">
                                {product.price.orignal}
                              </span>
                              <span> {t('common.aed')}</span>
                              <div className="text-red-500">
                                {Number(
                                  product.price.orignal -
                                    product.price.discounted
                                ).toFixed(2)}{' '}
                                {t('common.aedDownpayment')}
                              </div>
                            </>
                          )}
                        </span>
                        {product.stock > 0 && (
                          <span className="rounded bg-[#40b740] px-2 py-0.5 text-xs font-medium text-white">
                            {t('common.inStock')} ({product.stock})
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-start">
                        <span>
                          • {product.slug || t('common.notAvailable')}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {/* <button
                        className="h-7 w-7 shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle share logic
                        }}
                        aria-label={t('common.share')}
                      >
                        <Share2 className="h-4 w-4" />
                      </button> */}
                      {/* // TODO: Share product logic */}
                      <button
                        className="h-7 w-7 text-red-500"
                        onClick={(e) => {
                          handleFavourite(e, product?.id);
                        }}
                      >
                        {favourite.some((fav) => fav === product.id) ? (
                          <Heart className="h-5 w-5" fill="red" />
                        ) : (
                          <Heart className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="line-clamp-2 pr-10 text-sm text-gray-600">
                    {product.description}
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    {t('common.dubai')}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
