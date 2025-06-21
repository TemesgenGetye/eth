import { useRef, useState } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useProductForm } from '../hooks/useProductForm';
import useCategories from '../hooks/useCategories';
import { Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/Select';
import { useNavigate, useLocation } from 'react-router-dom';
import { setItem } from '../services/db';
import { useLanguage } from '../Context/Languge';
import { ProductData } from '../components/type';

interface Subcategory {
  id: number;
  name: string;
}

export default function PostAdPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { categories = [] } = useCategories();
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // Check if we're in edit mode
  const editMode = location.state?.editMode || false;
  const productData = location.state?.productData || null;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
    saveAsDraft,
    onSubmit,
  } = useProductForm(
    () => {
      toast.success(
        editMode
          ? t('common.postAd.updateAdSuccess')
          : t('common.postAd.postAdSuccess')
      );
      if (editMode) {
        navigate('/my-ads');
      } else {
        reset();
      }
    },
    () => {
      toast.error(
        editMode
          ? t('common.postAd.updateAdError')
          : t('common.postAd.postAdError')
      );
    },
    editMode,
    productData
  );

  const cities = [
    'All Cities (UAE)',
    'Abu Dhabi',
    'Ajman',
    'Al Ain',
    'Dubai',
    'Fujairah',
    'Ras al Khaimah',
    'Sharjah',
    'Umm al Quwain',
  ];

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
      images.filter((_: File, i: number) => i !== index)
    );
  };

  // Category/subcategory logic
  const selectedCategoryId = watch('category_id');
  const selectedCategory = categories.find(
    (cat) => cat.id === Number(selectedCategoryId)
  );
  const subcategories = selectedCategory?.subcategories || [];

  // Handle form submission
  const handleFormSubmit = async (data: ProductData) => {
    if (editMode) {
      // In edit mode, use the form's onSubmit directly
      return onSubmit(data);
    } else {
      // For new ads, store form data in IndexedDB for the subscription page
      try {
        await setItem('productFormData', data);
        navigate('/pricing');
      } catch (error) {
        console.error('Failed to save form data to IndexedDB', error);
        toast.error(t('common.postAd.fillRequiredFields'));
      }
    }
  };

  // Handle save as draft
  const handleSaveAsDraft = async () => {
    setIsSavingDraft(true);
    try {
      const formData = watch();
      const error = await saveAsDraft(formData);
      if (!error) {
        toast.success(
          editMode
            ? 'Ad updated as draft successfully!'
            : 'Ad saved as draft successfully!'
        );
        reset();
        navigate('/my-ads'); // Navigate to my ads page
      } else {
        toast.error(t('common.postAd.fillRequiredFields'));
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
      toast.error(t('common.postAd.fillRequiredFields'));
    } finally {
      setIsSavingDraft(false);
    }
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
          <h1 className="text-2xl font-bold text-black">
            {editMode
              ? t('common.postAd.editAdTitle')
              : t('common.postAd.title')}
          </h1>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
          {/* Required Fields Note */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              <strong>{t('common.postAd.note')}:</strong>{' '}
              {t('common.postAd.requiredFieldsNote')}
            </p>
          </div>

          {/* Images Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-black">
              {t('common.postAd.productImages')}
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
                <span className="text-sm text-gray-500">
                  {t('common.postAd.addImage')}
                </span>
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
              {t('common.postAd.uploadLimit')}
            </p>
            {errors.imgUrls && (
              <p className="text-xs text-red-500">{errors?.imgUrls?.message}</p>
            )}
          </div>

          {/* Basic Information */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-black">
              {t('common.postAd.basicInfo')}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  {t('common.postAd.productTitle')} *
                </label>
                <input
                  {...register('name')}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder={t('common.postAd.productTitlePlaceholder')}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  {t('common.postAd.description')} *
                </label>
                <textarea
                  {...register('description')}
                  rows={6}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder={t('common.postAd.descriptionPlaceholder')}
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
                    {t('common.postAd.category')} *
                  </label>
                  <Controller
                    name="category_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t('common.postAd.selectCategory')}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category_id && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.category_id.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-black">
                    {t('common.postAd.subcategory')} *
                  </label>
                  <Controller
                    name="subcategory_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value?.toString()}
                        disabled={!selectedCategory}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t('common.postAd.selectSubcategory')}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {subcategories.map((sub: Subcategory) => (
                            <SelectItem key={sub.id} value={sub.id.toString()}>
                              {sub.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.subcategory_id && (
                    <p className="mt-1 text-xs text-red-500">
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
              {t('common.postAd.pricingStock')}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  {t('common.postAd.currency')}
                </label>
                <Controller
                  name="price.currency"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="AED">AED</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  {t('common.postAd.originalPrice')} *
                </label>
                <input
                  type="number"
                  {...register('price.orignal')}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />
                {errors.price?.orignal && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.price.orignal.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  {t('common.postAd.discountedPrice')}
                </label>
                <input
                  type="number"
                  {...register('price.discounted')}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  {t('common.postAd.stock')} *
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
              {t('common.postAd.locationContact')}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  {t('common.postAd.location')}
                </label>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t('common.postAd.locationPlaceholder')}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.location && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.location.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-black">
                    {t('common.postAd.contactName')} *
                  </label>
                  <input
                    {...register('contact_name')}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
                    placeholder={t('common.postAd.contactNamePlaceholder')}
                  />
                  {errors.contact_name && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.contact_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-black">
                    {t('common.postAd.phoneNumber')} *
                  </label>
                  <input
                    {...register('phone_num')}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
                    placeholder={t('common.postAd.phoneNumberPlaceholder')}
                  />
                  {errors.phone_num && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.phone_num.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-black">
                    {t('common.postAd.emailAddress')}
                  </label>
                  <input
                    {...register('email')}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
                    placeholder={t('common.postAd.emailPlaceholder')}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pb-16 pt-4 md:pb-4">
            <button
              type="button"
              disabled={isSavingDraft}
              onClick={handleSaveAsDraft}
              className="flex flex-1 items-center justify-center rounded-lg bg-gray-200 px-6 py-4 font-semibold text-black transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSavingDraft ? (
                <>
                  <div className="flex w-full items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-gray-600"></div>
                  </div>
                </>
              ) : editMode ? (
                t('common.postAd.updateAsDraft')
              ) : (
                t('common.postAd.saveAsDraft')
              )}
            </button>
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
              ) : editMode ? (
                t('common.postAd.updateAdNow')
              ) : (
                t('common.postAd.postAdNow')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
