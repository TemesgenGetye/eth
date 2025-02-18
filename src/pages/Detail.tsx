// App.jsx
import { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Share2,
  Heart,
  Calendar,
  Gauge,
  ShipWheelIcon as SteeringWheel,
  Globe,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useParams } from 'react-router-dom';

export default function App() {
  const [currentImage, setCurrentImage] = useState(0);

  const { id } = useParams();
  const images = [
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  ];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentImage(index);
  };

  return (
    <div className="mx-auto max-w-7xl p-4">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
        <ChevronLeft className="h-4 w-4" />
        <span>
          Back To Search
          <p className="text-lg text-red-500">{id}</p>
        </span>
        <span className="px-2">•</span>
        <span>Dubai</span>
        <span>›</span>
        <span>Motors</span>
        <span>›</span>
        <span>Cars</span>
        <span>›</span>
        <span>Volkswagen</span>
        <span>›</span>
        <span>Jetta</span>
      </div>

      {/* Image Gallery */}
      <div className="relative mb-6">
        {/* Main Image */}
        <div className="relative h-[400px] overflow-hidden rounded-lg">
          <img
            src={images[currentImage] || '/placeholder.svg'}
            alt={`Volkswagen Jetta SEL 2016 - Image ${currentImage + 1}`}
            className="h-full w-full object-cover"
          />

          {/* Navigation Arrows */}
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
            {currentImage + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="mt-4 flex gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`relative aspect-video flex-1 overflow-hidden rounded-lg ${
                currentImage === index ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <img
                src={image || '/placeholder.svg'}
                alt={`Thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <div
                className={`absolute inset-0 bg-black/20 ${
                  currentImage === index ? 'bg-transparent' : ''
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Price and Details Section */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-2 text-2xl font-bold">AED 26,500</h1>
          <h2 className="mb-4 text-xl">Volkswagen Jetta SEL</h2>

          <div className="flex flex-wrap gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>2016</span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              <span>150,000 km</span>
            </div>
            <div className="flex items-center gap-2">
              <SteeringWheel className="h-5 w-5" />
              <span>Left Hand</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <span>GCC Specs</span>
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

      {/* Owner Section */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-15%20at%201.02.59%20at%20night-XE2nydGIQQF9jDujk7St8onwMLbFCG.png"
            alt="Owner"
            className="h-12 w-12 rounded-full"
          />
          <div>
            <h3 className="font-semibold">Lara Basher</h3>
            <p className="text-gray-600">Owner</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg bg-red-50 px-6 py-2 text-red-600 transition-colors hover:bg-red-100">
            <Phone className="h-5 w-5" />
            Call
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-green-50 px-6 py-2 text-green-600 transition-colors hover:bg-green-100">
            <MessageCircle className="h-5 w-5" />
            Chat
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Features</h3>
          <span className="rounded-full bg-gray-100 px-2 py-1 text-sm">6</span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-green-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Anti-Lock Brakes/ABS</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-green-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Front Airbags</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-green-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Side Airbags</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-green-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Cruise Control</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-green-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Power Steering</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-green-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Tiptronic Gears</span>
          </div>
        </div>
      </div>

      {/* Car Overview */}
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-semibold">Car Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex justify-between border-b py-2">
            <span className="text-gray-600">Body Type</span>
            <span>Sedan</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="text-gray-600">Exterior Color</span>
            <span>Silver</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="text-gray-600">Doors</span>
            <span>4 door</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="text-gray-600">Interior Color</span>
            <span>Black</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Location</h3>
        <p className="text-gray-600">Al Twar 3, Al Twar, Dubai, UAE</p>
      </div>
    </div>
  );
}
