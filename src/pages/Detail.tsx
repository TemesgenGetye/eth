import { useState, useEffect } from 'react';
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
  MessageCircle,
  VerifiedIcon,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import SimilarProducts from '../components/SimilarProducts';
import { cleanString } from '../services/utils';
import { useFavourite } from '../Context/Favourite';
import { useCart } from '../Context/Cart';
import { useCartItems, useFavouriteItems } from '../hooks/store';
import toast from 'react-hot-toast';
import { useGetCustomerById } from '../hooks/useCustomers';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// NOTE: If you haven't already, install leaflet and react-leaflet:
// pnpm add leaflet react-leaflet

export default function Detail() {
  const [currentImage, setCurrentImage] = useState(0);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [geoError, setGeoError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { products, isLoading } = useProducts();
  const { favourite, setFavourite } = useFavourite();
  const { cart, setCart } = useCart();
  const { refetchCart } = useCartItems();
  const { refetchFavorites } = useFavouriteItems();

  // Always call hooks at the top level
  const location = useLocation();
  const pid = location.state?.pid;

  const product = products?.find((product) => product.id == pid);
  const { customer: seller } = useGetCustomerById(
    product?.createdBy ? String(product.createdBy) : ''
  );

  useEffect(() => {
    if (seller?.location) {
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          seller.location
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            setCoords({
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon),
            });
            setGeoError(null);
          } else {
            setCoords(null);
            setGeoError('Location not found');
          }
        })
        .catch(() => {
          setCoords(null);
          setGeoError('Failed to geocode location');
        });
    } else {
      setCoords(null);
      setGeoError(null);
    }
  }, [seller?.location]);

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
    contactName,
  } = product;

  // const { customer: singleCustomer, isLoadingCustomer } = useGetCustomerById(
  //   product?.createdBy
  // );

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

  if (isLoading && !product)
    return (
      <div className="mx-auto max-w-7xl animate-pulse p-4">
        <div className="mb-4 h-6 w-1/3 rounded bg-gray-200" />
        <div className="mb-6 h-[400px] w-full rounded-lg bg-gray-200" />
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div className="w-1/2 space-y-4">
            <div className="h-8 w-1/3 rounded bg-gray-200" />
            <div className="h-6 w-1/4 rounded bg-gray-200" />
            <div className="h-6 w-1/2 rounded bg-gray-200" />
          </div>
          <div className="h-12 w-32 rounded bg-gray-200" />
        </div>
        <div className="mb-8 h-24 w-full rounded bg-gray-200" />
        <div className="mb-8 h-8 w-1/4 rounded bg-gray-200" />
        <div className="mt-10 h-48 max-w-sm rounded-2xl border border-gray-100 bg-gray-100 p-6 shadow-sm" />
      </div>
    );

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
        <div className="mt-10 max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          {/* Profile Section */}
          <div className="mb-6 flex items-start gap-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl">
              <img
                src={seller?.img_url || '/logo.png'}
                alt={seller?.name || 'Seller'}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                {seller?.name || 'Seller'}
              </h2>
              <p>{seller?.location || 'Location'}</p>
              {seller?.verification_status === 'verified' ? (
                <div className="flex items-center gap-2">
                  <VerifiedIcon className="h-5 w-5 text-green-600" />
                  <span className="text-sm  text-green-700">verified</span>
                </div>
              ) : (
                <div className="mt-2 flex items-center gap-2">
                  <VerifiedIcon className="h-5 w-5 text-red-600" />
                  <span className="text-sm  text-red-700">unverified</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}

          <div className="flex flex-wrap gap-2">
            <a
              href={`mailto:${seller?.email}`}
              className="group flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm font-medium text-blue-700 shadow-sm transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Mail className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
              <span>Email</span>
            </a>

            <a
              href={`tel:${seller?.phoneNum}`}
              className="group flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
              <span>Call</span>
            </a>

            <a
              href={`https://wa.me/${phoneNum?.replace(/\D/g, '')}`}
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
      )}
      {/* Map Section */}
      {seller?.location && coords && (
        <div className="m-auto mt-6 max-w-7xl rounded-2xl border border-gray-100 bg-white p-4 py-1 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">Seller Location</h3>
          <MapContainer
            center={[coords.lat, coords.lng]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: '250px', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[coords.lat, coords.lng]}
              icon={L.icon({
                iconUrl:
                  'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              })}
            >
              <Popup>{seller.location}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
      {geoError && <div className="mt-2 text-xs text-red-500">{geoError}</div>}
      {/* Similar Products Section */}
      <div className="mt-36">
        <SimilarProducts id={product?.subcategory?.id} filterBy="subcategory" />
      </div>
    </div>
  );
}
