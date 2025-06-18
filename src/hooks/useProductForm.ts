import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import supabase from '../services/supabase';

// Define the schema for validation
const schema = yup.object().shape({
  name: yup.string().required('Product name is required'),
  description: yup.string().required('Description is required'),
  price: yup.object({
    orignal: yup.number().required('Original price is required'),
    discounted: yup.number().nullable(),
    currency: yup.string().required('Currency is required'),
  }),
  stock: yup.number().required('Stock is required'),
  imgUrls: yup
    .array()
    .min(1, 'At least one image is required')
    .required('Product Image is required'),
  category_id: yup.number().required('Category is required'),
  subcategory_id: yup.number().required('Subcategory is required'),
  location: yup.string().required('Location is required'),
  contact_name: yup.string().required('Contact name is required'),
  phone_num: yup.string().required('Phone number is required'),
  email: yup.string().email('Invalid email').nullable(),
});

export function useProductForm(onSuccess?: () => void, onError?: () => void) {
  const onSubmit = async (data: any) => {
    console.log('data', data);
    //Insert images to supabase bucket
    let img_urls: string[] = [];
    if (data.imgUrls && data.imgUrls.length > 0) {
      img_urls = await Promise.all(
        data.imgUrls.map(async (file: File) => {
          const fileExt = file.name.split('.').pop();
          const filePath = `bucket/${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false,
            });
          if (uploadError) return '';
          // Get public URL
          const { data: publicUrlData } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);
          return publicUrlData.publicUrl;
        })
      );
      img_urls = img_urls.filter(Boolean);
    }

    // Insert into supabase
    const { error } = await supabase.from('products').insert([
      {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        img_urls,
        category_id: data.category_id,
        subcategory_id: data.subcategory_id,
        location: data.location,
        contact_name: data.contact_name,
        phone_num: data.phone_num,
        email: data.email,
      },
    ]);
    if (!error && onSuccess) onSuccess();
    if (error) onError?.();
    return error;
  };
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      price: { orignal: 0, discounted: 0, currency: 'USD' },
      stock: 1,
      img_urls: [],
      category_id: undefined,
      subcategory_id: undefined,
      location: '',
      contact_name: '',
      phone_num: '',
      email: '',
    },
  });

  return { ...form, onSubmit };
}
