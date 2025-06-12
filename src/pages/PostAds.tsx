import { useRef } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useProductForm } from '../hooks/useProductForm';
import useCategories from '../hooks/useCategories';
import { Controller } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function PostAdPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { categories = [] } = useCategories();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    onSubmit,
    reset,
  } = useProductForm(
    () => {
      toast.success('Product has been successfully uploaded.');
      reset();
    },
    () => {
      toast.error('Error trying to upload your product.');
    }
  );

  // Images state for preview
  const images = watch('imgUrls') || [];

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setValue('imgUrls', [...images, ...files]);
  };

  const removeImage = (index: number) => {
    setValue(
      'imgUrls',
      images.filter((_: any, i: number) => i !== index)
    );
  };

  // Category/subcategory logic
  const selectedCategoryId = watch('category_id');
  const selectedCategory = categories.find(
    (cat) => cat.id === Number(selectedCategoryId)
  );
  const subcategories = selectedCategory?.subcategories || [];

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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Images Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-black">
              Product Images
            </h2>
            <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              {images.map((image: File, index: number) => (
                <div key={index} className="group relative">
                  <img
                    src={URL.createObjectURL(image)}
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
            {errors.imgUrls && (
              <p className="text-xs text-red-500">{errors?.imgUrls?.message}</p>
            )}
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
                  {...register('name')}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a descriptive title for your product"
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Description *
                </label>
                <textarea
                  {...register('description')}
                  rows={6}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="Provide detailed description..."
                />
                {errors.description && (
                  <p className="text-xs text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-black">
                    Category *
                  </label>
                  <Controller
                    name="category_id"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.category_id && (
                    <p className="text-xs text-red-500">
                      {errors.category_id.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-black">
                    Subcategory *
                  </label>
                  <Controller
                    name="subcategory_id"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3"
                        disabled={!selectedCategory}
                      >
                        <option value="">Select Subcategory</option>
                        {subcategories.map((sub: any) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.subcategory_id && (
                    <p className="text-xs text-red-500">
                      {errors.subcategory_id.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & stock */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-black">
              Pricing & Stock
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Currency
                </label>
                <Controller
                  name="price.currency"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3"
                    >
                      <option value="USD">USD</option>
                      <option value="AED">AED</option>
                    </select>
                  )}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Original Price *
                </label>
                <input
                  type="number"
                  {...register('price.orignal')}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />
                {errors.price?.orignal && (
                  <p className="text-xs text-red-500">
                    {errors.price.orignal.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Discounted Price
                </label>
                <input
                  type="number"
                  {...register('price.discounted')}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Stock *
                </label>
                <input
                  type="number"
                  {...register('stock')}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />
                {errors.stock && (
                  <p className="text-xs text-red-500">{errors.stock.message}</p>
                )}
              </div>
            </div>
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
                  {...register('location')}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  placeholder="Enter your city, state or full address"
                />
                {errors.location && (
                  <p className="text-xs text-red-500">
                    {errors.location.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-black">
                    Contact Name *
                  </label>
                  <input
                    {...register('contact_name')}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
                    placeholder="Your name"
                  />
                  {errors.contact_name && (
                    <p className="text-xs text-red-500">
                      {errors.contact_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-black">
                    Phone Number *
                  </label>
                  <input
                    {...register('phone_num')}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
                    placeholder="Your phone number"
                  />
                  {errors.phone_num && (
                    <p className="text-xs text-red-500">
                      {errors.phone_num.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-black">
                    Email Address
                  </label>
                  <input
                    {...register('email')}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
                    placeholder="Your email address"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-6 py-4 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <div className="flex w-full items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-white"></div>
                  </div>
                </>
              ) : (
                'Post Ad Now'
              )}
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
