import supabase from './supabase';

export async function getCustomers() {
  try {
    const { data, error } = await supabase.from('customers').select(`*`);

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Failed to fetch categories:', err);
    return [];
  }
}

export async function updateCustomer(customer) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .update(customer)
      .eq('id', customer?.id)
      .select();

    if (error) {
      throw error;
    }
    return data;
  } catch (err) {
    console.error('Failed to fetch categories:', err);
    return [];
  }
}
