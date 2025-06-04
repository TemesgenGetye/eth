import supabase from './supabase';

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

    return data;
  } catch (err) {
    console.error('Failed to fetch categories:', err);
    return [];
  }
}
