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

export async function getCustomer(uuid: string) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('uuid', uuid)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Failed to fetch customer:', err);
    return null;
  }
}

export async function getCustomerById(id: string) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Failed to fetch customer:', err);
    return null;
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
