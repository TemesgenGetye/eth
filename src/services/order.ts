// post order
import supabase from './supabase';

export async function postOrder(order) {
  try {
    const { data, error } = await supabase.from('orders').insert(order);

    if (error) {
      throw error;
    }
    return data;
  } catch (err) {
    console.error('Failed to fetch categories:', err);
    return [];
  }
}
