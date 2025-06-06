import supabase from './supabase';
import camelCase from './utils';

export async function getCategories() {
  try {
    const { data, error } = await supabase.from('categories').select(`
        id,
        name,
        icon_url,
        img_url,
        subcategories (
          id,
          name,
          img_url,
          category_id
        )
      `);

    if (error) {
      throw error;
    }

    const camelCasedData = data?.map((category) => camelCase(category));

    return camelCasedData || [];
  } catch (err) {
    console.error('Failed to fetch categories:', err);
    return [];
  }
}
