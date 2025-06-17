import { useState } from 'react';
import {
  Share2,
  Heart,
  Calendar,
  Gauge,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  User,
  Phone,
  Mail,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import SimilarProducts from '../components/SimilarProducts';
import { cleanString } from '../services/utils';
import { useFavourite } from '../Context/Favourite';
import { useCart } from '../Context/Cart';
import { useCartItems, useFavouriteItems } from '../hooks/store';
import toast from 'react-hot-toast';
import useCustomers from '../hooks/useCustomers';

export default function Detail() {
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();
  const { products } = useProducts();
  const { favourite, setFavourite } = useFavourite();
  const { cart, setCart } = useCart();
  const { refetchCart } = useCartItems();
  const { refetchFavorites } = useFavouriteItems();
  const customer = useCustomers();

  const {
    state: { pid },
  } = useLocation();

  const product = products?.find((product) => product.id == pid);

  if (!product) {
    return <div>Product not found</div>;
  }

  const {
    price,
    imgUrls,
    name,
    description,
    stock,
    sales,
    category,
    subcategory,
    createdBy,
    phoneNum,
    email,
  } = product;

  console.log(phoneNum);

  // const singleCustomer = customer.customers?.find(
  //   (customer) => customer.id === product?.createdBy
  // );
  // console.log('singleCustomer', singleCustomer);

  // Safely get prices and other properties
  const displayPrice = product ? price.discounted : 'N/A';
  const displayOriginalPrice = product ? price.orignal : 'N/A';
  const displayDiscount = product ? price.orignal - price.discounted : 0;
  const displayStock = product ? stock : 'N/A';

  // Determine which images to display
  const displayImages = product ? imgUrls : [];

  // Handle image navigation
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % displayImages.length);
  };

  const previousImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length
    );
  };

  const goToImage = (index: number) => {
    setCurrentImage(index);
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
    <div className="mx-auto max-w-7xl p-4">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
        <ChevronLeft className="h-4 w-4" />
        <span
          onClick={() => navigate(-1)}
          className="cursor-pointer text-blue-400 hover:text-blue-500"
        >
          Back To Search
        </span>
        <span className="px-2">•</span>
        <Link
          to={'/'}
          className="cursor-pointer text-blue-400 hover:text-blue-500 hover:underline"
        >
          Dubai
        </Link>
        <span>›</span>
        <Link
          to={`/${cleanString(category?.name)}`}
          className="cursor-pointer text-blue-400 hover:text-blue-500 hover:underline"
        >
          {category?.name}
        </Link>
        <span>›</span>
        <Link
          to={`/${cleanString(category?.name)}/${cleanString(subcategory?.name)}`}
          className="cursor-pointer text-blue-400 hover:text-blue-500 hover:underline"
        >
          {subcategory?.name}
        </Link>
        <span>›</span>
        <span className="text-gray-400">{name || 'N/A'}</span>
      </div>

      {/* Image Gallery */}
      <div className="relative mb-6">
        {/* Main Image */}
        <div className="relative h-[400px] overflow-hidden rounded-lg">
          <img
            src={displayImages[currentImage] || '/placeholder.svg'}
            alt={`${name || 'Product'} - Image ${currentImage + 1}`}
            className="h-full w-full object-contain"
          />

          {/* Navigation Arrows */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={previousImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
                {currentImage + 1} / {displayImages.length}
              </div>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        {displayImages.length > 1 && (
          <div className="mt-4 flex gap-2">
            {displayImages.map((img: string, index: number) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`relative aspect-video flex-1 overflow-hidden rounded-lg ${
                  currentImage === index ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <img
                  src={img || '/placeholder.svg'}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-full w-full object-contain"
                />
                <div
                  className={`absolute inset-0 bg-black/20 ${
                    currentImage === index ? 'bg-transparent' : ''
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price and Details Section */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-2 text-2xl font-bold">AED {displayPrice}</h1>
          {displayDiscount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 line-through">
                AED {displayOriginalPrice}
              </span>
              <span className="text-sm text-red-500">
                -{Number(displayDiscount).toFixed(2)} AED
              </span>
            </div>
          )}
          <h2 className="mb-4 text-xl">{name || 'N/A'}</h2>

          <div className="flex flex-wrap gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>Stock: {displayStock}</span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              <span>Sales: {sales || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex space-x-2">
            {!product?.createdBy && (
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
      </div>

      {/* Description Section */}
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-semibold">Description</h3>
        <p className="text-gray-600">
          {description || 'No description available'}
        </p>
      </div>

      {/* Slug Section */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Slug</h3>
        <p className="text-gray-600">{'N/A'}</p>
      </div>

      {/* Contact Seller Section */}
      {createdBy && (
        <div className="max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          {/* Profile Section */}
          <div className="mb-6 flex items-start gap-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl">
              <img src={'/logo.png'} alt={'honme'} className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                {createdBy}
              </h2>
              <button className="mb-3 text-sm font-medium text-blue-500 transition-colors hover:text-blue-600">
                View All Properties
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <a
              href={`mailto:${email}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-blue-600 transition-colors hover:bg-blue-100"
            >
              <Mail className="h-5 w-5" />
              <span className="font-medium">Email</span>
            </a>

            <a
              href={`tel:${phoneNum}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-red-600 transition-colors hover:bg-red-100"
            >
              <Phone className="h-5 w-5" />
              <span className="font-medium">Call</span>
            </a>

            <a
              href={`https://wa.me/${phoneNum.replace(/\D/g, '')}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-green-600 transition-colors hover:bg-green-100"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
            </a>
          </div>
        </div>
      )}
      <div className="mt-36">
        <SimilarProducts id={product?.subcategory?.id} filterBy="subcategory" />
      </div>
    </div>
  );
}
