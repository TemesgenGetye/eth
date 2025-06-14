import {
  Heart,
  Image,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavourite } from '../../Context/Favourite';
import { useCart } from '../../Context/Cart';
import { ProductType } from '../type';
import toast from 'react-hot-toast';
import { useCartItems, useFavouriteItems } from '../../hooks/store';

interface ProductProps {
  products: ProductType[] | undefined;
  key?: string;
}

export default function ProductList({ products }: ProductProps) {
  const navigate = useNavigate();

  const [imageIndexes, setImageIndexes] = useState<{ [key: string]: number }>(
    {}
  );

  const { favourite, setFavourite } = useFavourite();
  const { cart, setCart } = useCart();
  const { refetchCart } = useCartItems();
  const { refetchFavorites } = useFavouriteItems();

  const handleImageChange = (
    id: number,
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

    if (!favourite.some((fav) => fav === id)) {
      setFavourite([...favourite, id]);
      localStorage.setItem('favourite', JSON.stringify([...favourite, id]));
    } else {
      setFavourite(favourite.filter((fav) => fav !== id));
      localStorage.setItem(
        'favourite',
        JSON.stringify(favourite.filter((fav) => fav !== id))
      );
    }
    console.log('fav before', localStorage.getItem('favourite'));
    refetchFavorites();
  }

  async function handleCart(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) {
    e.stopPropagation();
    if (!cart.some((item) => item === id)) {
      setCart([...cart, id]);
      localStorage.setItem('cart', JSON.stringify([...cart, id]));
      await refetchCart();
      toast.success('Item added to cart succesfully.');
    }
  }

  return (
    <ul className="grid grid-cols-1 gap-4">
      {products?.map((product) => {
        const currentImageIndex = imageIndexes[product.id] ?? 0;
        const cName = product?.category?.name
          ?.toLowerCase()
          ?.split(' ')
          ?.join('-');
        const scName = product?.subcategory?.name
          ?.toLowerCase()
          ?.split(' ')
          ?.join('-');
        const pName = product?.name?.toLowerCase()?.split(' ')?.join('-');
        const pid = product?.id;

        return (
          <li
            key={product.id}
            className="relative cursor-pointer rounded-lg border-b border-b-gray-200 bg-white p-4 shadow-sm"
            onClick={() =>
              navigate(`/${cName}/${scName}/${pName}`, { state: { pid } })
            }
          >
            <div className="flex gap-4">
              <div className="relative h-48 w-72 flex-shrink-0 overflow-hidden rounded-lg">
                {product.imgUrls.length > 1 && (
                  <>
                    <button
                      className="absolute left-0.5 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/80 p-1 ring-1 ring-gray-300 hover:bg-gray-100 hover:ring-gray-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageChange(product?.id, 'prev', product.imgUrls);
                      }}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      className="absolute right-0.5 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/80 p-1 ring-1 ring-gray-300 hover:bg-gray-100 hover:ring-gray-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageChange(
                          product?.id,
                          'next',
                          product?.imgUrls
                        );
                      }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}
                <img
                  src={product.imgUrls[currentImageIndex] || '/logo.png'}
                  alt={product?.name}
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
                      {product?.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold">
                        {product.price.orignal === product.price.discounted ? (
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
                              {Number(product.price.discounted).toFixed(2)} AED
                              Downpayment
                            </div>
                          </>
                        )}
                      </span>
                      {product.stock > 0 && (
                        <span className="rounded bg-green-300 px-2 py-0.5 text-xs font-medium text-white">
                          IN STOCK ( {product.stock})
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col items-start ">
                      {/* <span>• {product.slug}</span> */}
                      <p className="cursor-pointer text-sm text-blue-500 hover:underline">
                        {products.length > 0
                          ? products.length + ' variants'
                          : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="rounded-lg bg-green-300 p-2 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCart(e, product?.id);
                      }}
                    >
                      <div className="flex w-full items-center gap-2 text-sm font-medium text-white">
                        <p>Add to Cart</p>
                        <ShoppingCart className="h-4 w-4" />
                      </div>
                    </button>
                    <button
                      className="h-7 w-7 text-red-500"
                      onClick={(e) => {
                        handleFavourite(e, product?.id);
                      }}
                    >
                      {favourite.some((fav) => fav === product.id) ? (
                        <Heart className="h-5 w-5 " fill="red" />
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
          </li>
        );
      })}
    </ul>
  );
}
