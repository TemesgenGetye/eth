import { useState } from 'react';
import {
  Share2,
  Heart,
  Calendar,
  Gauge,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import SimilarProducts from '../components/SimilarProducts';
import { cleanString } from '../services/utils';

export default function Detail() {
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();
  const { products } = useProducts();

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
  } = product;

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
          <button className="rounded-lg border p-2 hover:bg-gray-50">
            <Heart className="h-5 w-5" />
          </button>
          <button className="rounded-lg border p-2 hover:bg-gray-50">
            <Share2 className="h-5 w-5" />
          </button>
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
      <div className="mt-36">
        <SimilarProducts id={product?.subcategory?.id} filterBy="subcategory" />
      </div>
    </div>
  );
}
