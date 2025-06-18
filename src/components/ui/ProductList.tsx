import {
  Heart,
  Image,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Mail,
  Phone,
  MessageCircle,
  User,
  VerifiedIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavourite } from '../../Context/Favourite';
import { useCart } from '../../Context/Cart';
import { ProductType } from '../type';
import toast from 'react-hot-toast';
import { useCartItems, useFavouriteItems } from '../../hooks/store';
import { useGetCustomerById } from '../../hooks/useCustomers';

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
                            <div className="text-lg text-red-500">
                              {Number(product.price.discounted).toFixed(2)} AED
                              Downpayment
                            </div>
                          </>
                        )}
                      </span>
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
                    {!product.createdBy ? (
                      <button
                        className="rounded-lg bg-[#40b740] p-2 text-white hover:bg-[#42c242]" // YW color scheme change
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
                    ) : (
                      ''
                    )}
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
                {product.stock > 0 && (
                  <span className="rounded bg-[#40b740] px-2 py-0.5 text-xs font-medium text-white">
                    IN STOCK ( {product.stock})
                  </span>
                )}
                <p className="line-clamp-2 pr-10 text-sm text-gray-600">
                  {product.description}
                </p>
                <div className="space-y-2 text-sm text-gray-500">{'dubai'}</div>
                {!product?.createdBy && (
                  <div className="flex items-center gap-1">
                    <VerifiedIcon className="h-5 w-5 text-[#40b740]" />
                    <span className="text-sm  text-[#40b740]">
                      verified
                    </span>{' '}
                    {/* YW color scheme change */}
                  </div>
                )}
                {product?.createdBy ? (
                  <SellerContact createdBy={product?.createdBy} />
                ) : (
                  ''
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function SellerContact({ createdBy }: { createdBy: number | string }) {
  const { customer, isLoadingCustomer } = useGetCustomerById(String(createdBy));

  if (isLoadingCustomer) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
        <span className="text-sm font-medium text-gray-500">
          Loading seller information...
        </span>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4">
        <User className="h-4 w-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-500">
          Seller information unavailable
        </span>
      </div>
    );
  }

  let waNum = customer.phoneNum?.replace(/\D/g, '');
  if (waNum && waNum.length === 10 && waNum.startsWith('0'))
    waNum = '971' + waNum.slice(1);

  return (
    <div className="space-y-2">
      {customer?.verification_status === 'verified' && (
        <div className="flex items-center gap-1">
          <VerifiedIcon className="h-5 w-5 text-green-600" />
          <span className="text-sm  text-green-700">verified</span>
        </div>
      )}

      <div className="mb-3 flex items-center gap-1">
        <User className="h-4 w-4 text-blue-600" />
        <span className="text-sm  text-blue-700">Contact Seller</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href={`mailto:${customer.email}`}
          className="group flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm font-medium text-blue-700 shadow-sm transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
          onClick={(e) => e.stopPropagation()}
        >
          <Mail className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
          <span>Email</span>
        </a>

        <a
          href={`tel:${customer.phoneNum}`}
          className="group flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:shadow-md"
          onClick={(e) => e.stopPropagation()}
        >
          <Phone className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
          <span>Call</span>
        </a>

        <a
          href={`https://wa.me/${waNum}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 rounded-lg border border-green-200 bg-white px-4 py-2.5 text-sm font-medium text-green-700 shadow-sm transition-all duration-200 hover:border-green-300 hover:bg-green-50 hover:shadow-md"
          onClick={(e) => e.stopPropagation()}
        >
          <MessageCircle className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
