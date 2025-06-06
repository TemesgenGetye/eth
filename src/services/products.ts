import supabase from './supabase';
import camelCase from './utils';

export const getPopularProducts = async () => {
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
      .order('views', { ascending: false });
    if (error) throw new Error(error?.message);
    const camelCasedData = data?.map((product) => camelCase(product));

    return camelCasedData || [];
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
