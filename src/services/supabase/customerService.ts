"use server"
import { createSupabaseClient } from '@/utils/supabase/server';
import { Customer} from '@/types/supabase/customer';
import { CustomerCreate } from '@/types/flow';


export async function getCustomerByUserId(userId: string): Promise<Partial<Customer> | null> {
  if (!userId) {
    console.error('No userId provided');
    return null;
  }

  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('external_id', userId)
    .single();

  if (error) {
    console.error('Error fetching customer:', error);
    return null;
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    name: data.name || '',
    email: data.email || '',
    customer_id: data.customer_id,
    external_id: data.external_id,
    paymentUrl: data.payment_url || '',
    createdAt: data.created_at
  };
}

export async function createCustomerInSupabase(customer: CustomerCreate, userId: string): Promise<boolean> {
  const supabase = await createSupabaseClient();
  try {
    const { error } = await supabase
      .from('customers')
      .insert({
        name: customer.name,
        email: customer.email,
        external_id: userId
      });

    if (error) {
      console.error('Error creating customer:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in createCustomer:', error);
    return false;
  }
}

export async function updateCustomer(customer: Customer, userId: string): Promise<boolean> {
  const supabase = await createSupabaseClient();
  try {
    const { error } = await supabase
      .from('customers')
      .update({
        name: customer.name,
        email: customer.email
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating customer:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateCustomer:', error);
    return false;
  }
}

export async function deleteCustomer(userId: string): Promise<boolean> {
  const supabase = await createSupabaseClient();
  try {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting customer:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteCustomer:', error);
    return false;
  }
}

export async function getCustomers(userId: string): Promise<Partial<Customer>[]> {
  const supabase = await createSupabaseClient();
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('id, customer_id, name, email, user_id, created_at')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching customers:', error);
      return [];
    }

    return data.map(customer => ({
      id: customer.id,
      customerId: customer.customer_id,
      name: customer.name || '',
      email: customer.email || '',
      externalId: customer.user_id,
      createdAt: customer.created_at
    }));
  } catch (error) {
    console.error('Error in getCustomers:', error);
    return [];
  }
}
