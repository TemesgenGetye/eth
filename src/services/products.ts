import supabase from './supabase';
import { camelCase } from './utils';

export const getPopularProducts = async () => {
  // console.log('Fetching popular products...');
  try {
    const { data, error } = await supabase
      .from('products')
      .select(
        `
        id,
        name,
        price,
        stock,
        img_urls,
        views,
        contact_name,
        phone_num,
        email,
        created_by,
        status,
        city,
        description,
        category:categories (
          id,
          name
        ),
        subcategory:subcategories (
          id,
          name
        )
      `
      )
      .eq('status', 'live')
      .order('views', { ascending: false });

    if (error) throw new Error(error?.message);

    // Group products by category
    const groupedProducts = data?.reduce(
      (acc: { [key: string]: any[] }, product: any) => {
        const categoryId = product.category?.id;
        if (!categoryId) return acc;

        if (!acc[categoryId]) {
          acc[categoryId] = [];
        }
        acc[categoryId].push(camelCase(product));
        return acc;
      },
      {} as { [key: string]: any[] }
    );

    // Sort products by views within each category and take top 10
    const popularProductsByCategory = Object.values(groupedProducts || {}).map(
      (products) => products?.slice(0, 10)
    );

    // Flatten the array to get all popular products
    const popularProducts = popularProductsByCategory.flat();

    return popularProducts || [];
  } catch (err) {
    console.error('Error fetching products:', err);
    throw err;
  }
};

export const getFeaturedProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(
        `
          id,
          name,
          price,
          stock,
          img_urls,
          views,
          description,
          category:categories (
            id,
            name
          ),
          subcategory:subcategories (
            id,
            name
          )
        `
      )
      .eq('featured', true)
      .eq('status', 'live');
    if (error) throw new Error(error?.message);
    const camelCasedData = data?.map((product) => camelCase(product));

    return camelCasedData || [];
  } catch (err) {
    console.error('Error fetching products:', err);
    throw err;
  }
};

export const getProductById = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(
        `
          id,
          name,
          price,
          stock,
          img_urls,
          views,
          description,
          category:categories (
            id,
            name
          ),
          subcategory:subcategories (
            id,
            name
          )
        `
      )
      .eq('id', id)
      .eq('status', 'live')
      .maybeSingle();
    if (error) throw new Error(error?.message);
    return camelCase(data);
  } catch (err) {
    console.error(`Error fetching product with id ${id}:`, err);
    throw err;
  }
};

export const getProdsById = async (ids: number[]) => {
  if (!Array.isArray(ids) || ids.length === 0) return [];

  try {
    const results = await Promise.all(
      ids.map(async (id) => {
        const { data, error } = await supabase
          .from('products')
          .select(
            `
              id,
              name,
              price,
              stock,
              img_urls,
              views,
              description,
              category:categories (
                id,
                name
              ),
              subcategory:subcategories (
                id,
                name
              )
            `
          )
          .eq('id', id)
          .eq('status', 'live')
          .maybeSingle(); // fetch one product or null

        if (error) throw new Error(error.message);
        return data ? camelCase(data) : null;
      })
    );

    // Filter out nulls (not found)
    return results.filter(Boolean);
  } catch (err) {
    console.error('Error fetching products by ID:', err);
    throw err;
  }
};

export const getProductsById = async (ids: number[]) => {
  if (!Array.isArray(ids) || ids.length === 0) return [];

  try {
    const { data, error } = await supabase
      .from('products')
      .select(
        `
          id,
          name,
          price,
          stock,
          img_urls,
          views,
          description,
          category:categories (
            id,
            name
          ),
          subcategory:subcategories (
            id,
            name
          )
        `
      )
      .in('id', ids)
      .eq('status', 'live'); // Filter by multiple IDs

    if (error) throw new Error(error?.message);
    const camelCasedData = data?.map((product) => camelCase(product));

    return camelCasedData || [];
  } catch (err) {
    console.error('Error fetching products by ID:', err);
    throw err;
  }
};

export const getAds = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(
        `
          id,
          name,
          price,
          stock,
          img_urls,
          views,
          description,
          status,
          category:categories (
            id,
            name
          ),
          subcategory:subcategories (
            id,
            name
          )
        `
      )
      .eq('created_by', id);
    if (error) throw new Error(error?.message);
    const camelCasedData = data?.map((product) => camelCase(product));

    return camelCasedData || [];
  } catch (err) {
    console.error('Error fetching ads:', err);
    throw err;
  }
};

export const getFilteredProducts = async ({
  keyword,
  city,
  minPrice,
  maxPrice,
  minYear,
  maxYear,
  cid,
  pname,
}: {
  keyword?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  cid?: string;
  pname?: string;
}) => {
  try {
    let query = supabase
      .from('products')
      .select(
        `
          id,
          name,
          price,
          stock,
          img_urls,
          views,
          description,
          created_by,
          status,
          city,
          contact_name,
          phone_num,
          email,
          category:categories (
            id,
            name
          ),
          subcategory:subcategories (
            id,
            name
          )
        `
      )
      .eq('status', 'live'); // Only fetch live products

    // Apply filters
    if (keyword) {
      query = query.ilike('name', `%${keyword}%`);
    }

    if (city && city !== 'All Cities') {
      query = query.ilike('city', `%${city}%`);
    }

    if (minPrice !== undefined) {
      query = query.gte('price->>discounted', minPrice);
    }

    if (maxPrice !== undefined) {
      query = query.lte('price->>discounted', maxPrice);
    }

    if (minYear !== undefined) {
      query = query.gte('year', minYear);
    }

    if (maxYear !== undefined) {
      query = query.lte('year', maxYear);
    }

    const { data, error } = await query;

    if (error) throw new Error(error?.message);
    let camelCasedData = data?.map((product) => camelCase(product)) || [];

    // Apply category filter after fetching if cid is provided
    if (cid) {
      const categoryName = cid.split('-').join(' ');
      camelCasedData = camelCasedData.filter((product) =>
        product.category?.name
          .toLowerCase()
          .includes(categoryName.toLowerCase())
      );
    }

    // Apply subcategory filter after fetching if pname is provided
    if (pname) {
      const subcategoryName = pname.split('-').join(' ');
      camelCasedData = camelCasedData.filter((product) =>
        product.subcategory?.name
          .toLowerCase()
          .includes(subcategoryName.toLowerCase())
      );
    }

    return camelCasedData;
  } catch (err) {
    console.error('Error fetching filtered products:', err);
    throw err;
  }
};

export const getSearchedProducts = async (
  searchTerm: string,
  category: string = 'all'
) => {
  try {
    let query = supabase
      .from('products')
      .select(
        `
          id,
          name,
          price,
          stock,
          img_urls,
          views,
          description,
          category:categories (
            id,
            name
          ),
          subcategory:subcategories (
            id,
            name
          )
        `
      )
      .eq('status', 'live'); // Only fetch live products

    // Apply search term filter
    if (searchTerm.trim()) {
      query = query.ilike('name', `%${searchTerm.trim()}%`);
    }

    const { data, error } = await query;

    if (error) throw new Error(error?.message);
    let camelCasedData = data?.map((product) => camelCase(product)) || [];

    // Apply category filter after fetching if not 'all'
    if (category && category !== 'all') {
      camelCasedData = camelCasedData.filter(
        (product) =>
          product.category?.name?.toLowerCase() === category.toLowerCase()
      );
    }

    return camelCasedData;
  } catch (err) {
    console.error('Error fetching searched products:', err);
    throw err;
  }
};
