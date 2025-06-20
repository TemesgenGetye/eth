import { Heart, X } from 'lucide-react';
import { useFavourite } from '../../Context/Favourite';
import { useNavigate } from 'react-router-dom';
import { useFavouriteItems } from '../../hooks/store';
import { cleanString } from '../../services/utils';

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
  const { favoriteProducts } = useFavouriteItems();
  const navigate = useNavigate();

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
          <div className="dropdown-pointer shadow-3xl absolute right-0 top-11 z-[1000] max-h-[600px] w-[400px] rounded-lg bg-white p-0 shadow-lg">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Favorites ({favourite.length})
              </h3>
              <X
                className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={closeModal}
              />
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {favoriteProducts?.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Heart className="h-12 w-12 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">No favorites yet</p>
                </div>
              ) : (
                <ul>
                  {favoriteProducts?.map((product) => (
                    <li
                      onClick={() => {
                        navigate(
                          `/${cleanString(product?.category?.name)}/${cleanString(product?.subcategory?.name)}`,
                          {
                            state: {
                              pid: product.id,
                            },
                          }
                        );
                        closeModal();
                      }}
                      key={product.id}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <div className="border-b p-4 hover:bg-gray-100">
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
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t p-2 text-center">
              <button
                className="w-full p-4 text-xs font-medium text-blue-500 hover:bg-gray-100/70 hover:text-blue-700"
                onClick={() => {
                  navigate('/favourites');
                  closeModal();
                }}
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
