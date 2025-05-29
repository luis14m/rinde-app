"use server";
import { createClient } from "@/utils/supabase/server";
import { Expense, ExpenseCreate } from '../../types/supabase/expense';
import { uploadDocuments } from './upload.server';
import { downloadDocument } from './download.server';


interface CreateExpenseResponse {
  success: boolean;
  error?: string;
  data?: Expense;
}

export async function createExpense(expense: ExpenseCreate): Promise<CreateExpenseResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    const { data, error } = await supabase
      .from('expenses')
      .insert([{
        ...expense,
        user_id: user.id,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating expense:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error in createExpense:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function getExpenses(): Promise<Expense[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getExpenseById(id: string): Promise<Expense | null> {
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user === null || user === undefined) {
    throw new Error('User not authenticated');
  }
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching expense:', error);
    throw error;
  }
}

export async function updateExpense(id: string, expense: Partial<Expense>): Promise<void> {
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user === null || user === undefined) {
    throw new Error('User not authenticated');
  }
  
  try {
    const { error } = await supabase
      .from('expenses')
      .update(expense)
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
}

  export async function deleteExpense(id: string): Promise<void> {  
    const supabase = await createClient();
  try {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  } 
}

export { uploadDocuments, downloadDocument };