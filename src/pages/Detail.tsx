import { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Share2,
  Heart,
  Calendar,
  Gauge,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { product } from '../Data/Product';
import PopularCategories from '../components/Property.tsx/PopularCategories';

export default function App() {
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const navigate = useNavigate();

  const { id } = useParams();
  const filteredProduct = product.find((item) => item._id === id);

  if (!filteredProduct) {
    return <div>Product not found</div>;
  }

  const { prices, image, variants, title, description, stock, sales, slug } =
    filteredProduct;

  // Determine which data to display (variant or main product)
  const displayData = selectedVariant || filteredProduct;

  // Safely get prices and other properties
  const displayPrice = selectedVariant
    ? selectedVariant.price
    : prices?.price || 'N/A';
  const displayOriginalPrice = selectedVariant
    ? selectedVariant.originalPrice
    : prices?.originalPrice || 'N/A';
  const displayDiscount = selectedVariant
    ? selectedVariant.discount
    : prices?.discount || 0;
  const displayStock = selectedVariant
    ? selectedVariant.quantity
    : stock || 'N/A';

  // Determine which images to display
  const displayImages = selectedVariant
    ? [selectedVariant.image] // Variant has only one image
    : image; // Main product has multiple images

  // Handle image navigation
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % displayImages.length);
  };

  const previousImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length
    );
  };

  const goToImage = (index) => {
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
        <span
          onClick={() => navigate('../')}
          className="cursor-pointer text-blue-400 hover:text-blue-500"
        >
          Products
        </span>
        <span>›</span>
        <span>{title?.en || 'N/A'}</span>
      </div>

      {/* Image Gallery */}
      <div className="relative mb-6">
        {/* Main Image */}
        <div className="relative h-[400px] overflow-hidden rounded-lg">
          <img
            src={displayImages[currentImage] || '/placeholder.svg'}
            alt={`${title?.en || 'Product'} - Image ${currentImage + 1}`}
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
            {displayImages.map((img, index) => (
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
          <h2 className="mb-4 text-xl">{title?.en || 'N/A'}</h2>

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

      {/* Variants Section */}
      {variants && variants.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold">Variants</h3>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedVariant(variant);
                  setCurrentImage(0); // Reset image index when a variant is selected
                }}
                className={`rounded-lg border p-2 ${
                  selectedVariant === variant
                    ? 'border-blue-500 bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span>Variant {index + 1}</span>
              </button>
            ))}
          </div>

          {/* Display Selected Variant Details */}
          {selectedVariant && (
            <div className="mt-4 rounded-lg border p-4">
              <h4 className="mb-2 text-lg font-semibold">
                Selected Variant Details
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between border-b py-2">
                  <span className="text-gray-600">Price</span>
                  <span>AED {selectedVariant.price || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span className="text-gray-600">Original Price</span>
                  <span>AED {selectedVariant.originalPrice || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-red-500">
                    {selectedVariant.discount
                      ? `-${selectedVariant.discount}%`
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span className="text-gray-600">Quantity</span>
                  <span>{selectedVariant.quantity || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Description Section */}
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-semibold">Description</h3>
        <p className="text-gray-600">
          {description?.en || 'No description available'}
        </p>
      </div>

      {/* Slug Section */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Slug</h3>
        <p className="text-gray-600">{slug || 'N/A'}</p>
      </div>
      <div className="mt-36">
        <PopularCategories id={'fruits-vegetable:632aca2b4d87ff2494210be8'} />
      </div>
    </div>
  );
}
