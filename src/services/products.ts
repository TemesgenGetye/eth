import supabase from './supabase';
import { camelCase, cleanString } from './utils';

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
      .eq('featured', true);
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
      .in('id', ids); // Filter by multiple IDs

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
    console.error(`Error fetching product with id ${id}:`, err);
    throw err;
  }
};

export const getSearchedProducts = async (term: string, category?: string) => {
  if (!term || term.trim() === '') return [];

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
        category_name,
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
      .ilike('name', `%${term}%`);

    if (category && category !== 'all') {
      query = query.ilike('category_name', `%${category}%`);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    console.log(data);

    return data?.map((product) => camelCase(product)) || [];
  } catch (err) {
    console.error('Error searching products:', err);
    throw err;
  }
};

export const getFilteredProducts = async (filterOptions: {
  keyword?: string | null;
  city?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  minYear?: number | null;
  maxYear?: number | null;
  pname?: string | null;
}) => {
  const { keyword, city, minPrice, maxPrice, minYear, maxYear, pname } =
    filterOptions;

  try {
    let query = supabase.from('products').select(
      `
        id,
        name,
        price,
        year,
        city,
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
    );

    if (keyword && keyword.trim() !== '') {
      query = query.ilike('name', `%${keyword.trim()}%`);
    }

    if (city) {
      query = query.ilike('city', `%${city}%`);
    }

    if (minPrice !== undefined && minPrice !== null) {
      query = query.gte('price->>discounted', minPrice);
    }

    if (maxPrice !== undefined && maxPrice !== null) {
      query = query.lte('price->>discounted', maxPrice);
    }

    if (minYear !== undefined && minYear !== null) {
      query = query.gte('year', minYear);
    }

    if (maxYear !== undefined && maxYear !== null) {
      query = query.lte('year', maxYear);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    // Filter by subcategory if pname is provided
    let filteredData = data;
    if (pname) {
      filteredData = data?.filter(
        (item) => cleanString(item?.subcategory?.name) === pname
      );
    }

    return filteredData?.map((product) => camelCase(product)) || [];
  } catch (err) {
    console.error('Error fetching filtered products:', err);
    throw err;
  }
};
