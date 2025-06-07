import type React from 'react';

import { useState, useRef } from 'react';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';

export default function PostAdPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    condition: '',
    brand: '',
    model: '',
    price: '',
    negotiable: false,
    location: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    features: [''],
    specifications: [{ key: '', value: '' }],
    tags: [''],
  });

  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    {
      name: 'Electronics',
      subcategories: [
        'Mobile Phones',
        'Laptops',
        'Cameras',
        'Gaming',
        'Audio & Video',
        'Accessories',
      ],
    },
    {
      name: 'Vehicles',
      subcategories: [
        'Cars',
        'Motorcycles',
        'Bicycles',
        'Trucks',
        'Boats',
        'Parts & Accessories',
      ],
    },
    {
      name: 'Real Estate',
      subcategories: [
        'Houses',
        'Apartments',
        'Commercial',
        'Land',
        'Vacation Rentals',
      ],
    },
    {
      name: 'Fashion',
      subcategories: [
        "Men's Clothing",
        "Women's Clothing",
        'Shoes',
        'Bags',
        'Jewelry',
        'Watches',
      ],
    },
    {
      name: 'Home & Garden',
      subcategories: [
        'Furniture',
        'Appliances',
        'Decor',
        'Garden',
        'Tools',
        'Kitchen',
      ],
    },
    {
      name: 'Sports & Recreation',
      subcategories: [
        'Fitness Equipment',
        'Outdoor Gear',
        'Sports Equipment',
        'Bicycles',
        'Water Sports',
      ],
    },
  ];

  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImages((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) =>
        i === index ? value : feature
      ),
    }));
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }],
    }));
  };

  const updateSpecification = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      ),
    }));
  };

  const removeSpecification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, ''],
    }));
  };

  const updateTag = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.map((tag, i) => (i === index ? value : tag)),
    }));
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const selectedCategory = categories.find(
    (cat) => cat.name === formData.category
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { ...formData, images });
    alert('Ad posted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl p-6">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <a href="/my-ads">
            <button className="rounded-lg p-2 transition-colors hover:bg-gray-200">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </a>
          <h1 className="text-2xl font-bold text-black">Post New Ad</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Images Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-black">
              Product Images
            </h2>
            <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              {images.map((image, index) => (
                <div key={index} className="group relative">
                  <img
                    src={image || '/placeholder.svg'}
                    alt={`Product ${index + 1}`}
                    className="h-32 w-full rounded-lg border border-gray-200 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-2 top-2 rounded-full bg-blue-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-32 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-blue-400"
              >
                <Upload className="mb-2 h-6 w-6 text-gray-400" />
                <span className="text-sm text-gray-500">Add Image</span>
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <p className="text-sm text-gray-500">
              Upload up to 10 images. First image will be the main photo.
            </p>
          </div>

          {/* Basic Information */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-black">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Product Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a descriptive title for your product"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={6}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="Provide detailed description of your product including condition, features, and any other relevant information..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-black">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                        subcategory: '',
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-black">
                    Subcategory
                  </label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        subcategory: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    disabled={!selectedCategory}
                  >
                    <option value="">Select Subcategory</option>
                    {selectedCategory?.subcategories.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-black">
                    Condition *
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        condition: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Condition</option>
                    {conditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-black">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        brand: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter brand name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-black">
                    Model
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        model: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter model number/name"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-black">Pricing</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 py-3 pl-8 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center pt-8">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.negotiable}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        negotiable: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-black">
                    Price is negotiable
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-black">Key Features</h2>
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-blue-600 transition-colors hover:bg-blue-50"
              >
                <Plus className="h-4 w-4" />
                Add Feature
              </button>
            </div>
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter a key feature"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="rounded-lg p-3 text-red-500 transition-colors hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-black">
                Specifications
              </h2>
              <button
                type="button"
                onClick={addSpecification}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-blue-600 transition-colors hover:bg-blue-50"
              >
                <Plus className="h-4 w-4" />
                Add Specification
              </button>
            </div>
            <div className="space-y-3">
              {formData.specifications.map((spec, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) =>
                      updateSpecification(index, 'key', e.target.value)
                    }
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Specification name (e.g., Color, Size, Weight)"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) =>
                      updateSpecification(index, 'value', e.target.value)
                    }
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Specification value"
                  />
                  {formData.specifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="rounded-lg p-3 text-red-500 transition-colors hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-black">Tags</h2>
              <button
                type="button"
                onClick={addTag}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-blue-600 transition-colors hover:bg-blue-50"
              >
                <Plus className="h-4 w-4" />
                Add Tag
              </button>
            </div>
            <div className="space-y-3">
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => updateTag(index, e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter a tag (e.g., vintage, wireless, gaming)"
                  />
                  {formData.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="rounded-lg p-3 text-red-500 transition-colors hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Tags help buyers find your product more easily
            </p>
          </div>

          {/* Location & Contact */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-black">
              Location & Contact Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your city, state or full address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-black">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactName: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-black">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactPhone: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Your phone number"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-black">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactEmail: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Your email address"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-600 px-6 py-4 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Post Ad Now
            </button>
            <button
              type="button"
              className="flex-1 rounded-lg bg-gray-200 px-6 py-4 font-semibold text-black transition-colors hover:bg-gray-300"
            >
              Save as Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
