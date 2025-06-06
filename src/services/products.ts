import supabase from './supabase';

export const getProducts = async () => {
  try {
    const { data, error } = await supabase.from('products').select(`
        id,
        name,
        price,
        stock,
        img_urls,
        category:categories (
          id,
          name
        ),
        subcategory:subcategories (
          id,
          name
        )
      `);
    if (error) throw new Error(error?.message);

    return data;
  } catch (err) {
    console.error('Error fetching products:', err);
    throw err;
  }
};
