import { Heart, X } from 'lucide-react';
import { useFavourite } from '../../Context/Favourite';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useFavouriteItems } from '../../hooks/store';

export default function Favourite({
  activeModal,
  handleLinkClick,
  closeModal,
}: {
  activeModal: string;
  handleLinkClick: (modalName: string) => void;
  closeModal: () => void;
}) {
  const { favourite } = useFavourite();
  const { favoriteProducts, refetchFavorites } = useFavouriteItems(
    favourite?.map((fav) => +fav)
  );
  const navigate = useNavigate();

  useEffect(
    function () {
      if (favourite.length && !favoriteProducts?.length) refetchFavorites();
    },
    [favoriteProducts?.length, favourite?.length, refetchFavorites]
  );
  return (
    <div>
      <div className="relative">
        <div
          className="flex cursor-pointer flex-col items-center justify-center text-sm text-gray-400 hover:text-gray-900"
          onClick={() => handleLinkClick('favorites')}
        >
          <Heart className="mr-1 h-4 w-4" />
          <p className="text-s text-gray-500">Favorites</p>
        </div>
        {activeModal === 'favorites' && (
          <div className="dropdown-pointer shadow-3xl absolute right-0 top-11 z-50 w-[400px] rounded-lg bg-white p-0 shadow-lg">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Favorites ({favourite.length})
              </h3>
              <X
                className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={closeModal}
              />
            </div>

            <div className="max-h-[500px] overflow-y-auto">
              {favoriteProducts?.map((product) => (
                <Link to={`/detail/${product?.id}`} key={product.id}>
                  <div className="border-b p-4">
                    <div className="flex gap-3">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={product.imgUrls[0] || '/logo.png'}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {product.name}
                        </p>
                        <div>
                          <p className="text-xs font-medium text-gray-900">
                            {product?.price?.orignal}
                            <span className="font-semibold">{'AED'}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="p-4 text-center">
              <button
                className="text-sm font-medium text-blue-500 hover:text-blue-700"
                onClick={() => navigate('/favourites')}
              >
                VIEW ALL FAVORITES
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
