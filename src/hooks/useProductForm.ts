import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import supabase from '../services/supabase';
import { ProductData } from '../components/type';
import { useAuth } from '../Context/AuthContext';
import { useGetCustomer } from './useCustomers';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

// Define the schema for validation - only essential fields required
const schema = yup.object().shape({
  name: yup.string().optional().default(''),
  description: yup.string().optional().default(''),
  price: yup.object({
    orignal: yup.number().required('Original price is required'),
    discounted: yup.number().nullable().default(0),
    currency: yup.string().optional().default('USD'),
  }),
  stock: yup.number().optional().default(1),
  imgUrls: yup.array().optional().default([]),
  category_id: yup.number().required('Category is required'),
  subcategory_id: yup.number().required('Subcategory is required'),
  location: yup.string().optional().default(''),
  contact_name: yup.string().optional().default(''),
  phone_num: yup.string().optional().default(''),
  email: yup.string().email('Invalid email').nullable().optional(),
});

interface ProductDataForEdit {
  id: number;
  name?: string;
  description?: string;
  price?: {
    orignal?: number;
    original?: number;
    discounted?: number;
    currency?: string;
  };
  stock?: number;
  category_id?: number;
  subcategory_id?: number;
  category?: { id: number };
  subcategory?: { id: number };
  location?: string;
  city?: string;
  contact_name?: string;
  phone_num?: string;
  email?: string;
}

export function useProductForm(
  onSuccess?: () => void,
  onError?: () => void,
  editMode?: boolean,
  productData?: ProductDataForEdit
) {
  const { user } = useAuth();
  const { customer } = useGetCustomer(user?.id || '');
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      price: { orignal: 0, discounted: 0, currency: 'USD' },
      stock: 1,
      imgUrls: [],
      category_id: undefined,
      subcategory_id: undefined,
      location: '',
      contact_name: '',
      phone_num: '',
      email: '',
    },
  });

  // Load existing product data when in edit mode
  useEffect(() => {
    if (editMode && productData) {
      form.reset({
        name: productData.name || '',
        description: productData.description || '',
        price: {
          orignal:
            productData.price?.orignal || productData.price?.original || 0,
          discounted: productData.price?.discounted || 0,
          currency: productData.price?.currency || 'USD',
        },
        stock: productData.stock || 1,
        imgUrls: [], // We'll handle images separately
        category_id: productData.category_id || productData.category?.id,
        subcategory_id:
          productData.subcategory_id || productData.subcategory?.id,
        location: productData.location || productData.city || '',
        contact_name: productData.contact_name || '',
        phone_num: productData.phone_num || '',
        email: productData.email || '',
      });
    }
  }, [editMode, productData, form]);

  const submitProduct = async (
    data: ProductData,
    status: 'live' | 'draft' = 'live'
  ) => {
    // If discounted price is not provided or is 0, set it to the original price
    if (!data.price.discounted || data.price.discounted <= 0) {
      data.price.discounted = data.price.orignal;
    }

    // Check if user is logged in
    if (!customer?.id) {
      throw new Error(
        'User not authenticated. Please log in to post products.'
      );
    }

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

    // If in edit mode, update existing product
    if (editMode && productData?.id) {
      const updateData: {
        name: string | null;
        description: string | null;
        price: ProductData['price'];
        stock: number;
        category_id: number;
        subcategory_id: number;
        city: string | null;
        contact_name: string | null;
        phone_num: string | null;
        email: string | null;
        status: 'live' | 'draft';
        img_urls?: string[];
      } = {
        name: data.name || null,
        description: data.description || null,
        price: data.price,
        stock: data.stock || 1,
        category_id: data.category_id,
        subcategory_id: data.subcategory_id,
        city: data.location || null,
        contact_name: data.contact_name || null,
        phone_num: data.phone_num || null,
        email: data.email || null,
        status: status,
      };

      // Only update images if new ones are uploaded
      if (img_urls.length > 0) {
        updateData.img_urls = img_urls;
      }

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productData.id);

      if (!error) {
        // Invalidate the my-ads query to refresh the My Ads page
        queryClient.invalidateQueries({ queryKey: ['my-ads'] });

        // Also invalidate general products queries to refresh product listings
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['popular-products'] });
        queryClient.invalidateQueries({ queryKey: ['featured-products'] });

        if (onSuccess && status === 'draft') onSuccess();
      } else {
        onError?.();
      }

      return error;
    } else {
      // Insert new product
      const { error } = await supabase.from('products').insert([
        {
          name: data.name || null,
          description: data.description || null,
          price: data.price,
          stock: data.stock || 1,
          img_urls,
          category_id: data.category_id,
          subcategory_id: data.subcategory_id,
          city: data.location || null,
          contact_name: data.contact_name || null,
          phone_num: data.phone_num || null,
          email: data.email || null,
          status: status,
          created_by: customer.id, // Set the created_by field to the current user's customer ID
        },
      ]);

      if (!error) {
        // Invalidate the my-ads query to refresh the My Ads page
        queryClient.invalidateQueries({ queryKey: ['my-ads'] });

        // Also invalidate general products queries to refresh product listings
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['popular-products'] });
        queryClient.invalidateQueries({ queryKey: ['featured-products'] });

        if (onSuccess && status === 'draft') onSuccess();
      } else {
        onError?.();
      }

      return error;
    }
  };

  const onSubmit = async (data: ProductData) => {
    return submitProduct(data, 'live');
  };

  const saveAsDraft = async (data: ProductData) => {
    return submitProduct(data, 'draft');
  };

  return { ...form, onSubmit, saveAsDraft };
}
