"use server";
import { createSupabaseClient } from "@/utils/supabase/server";
import { Expense, ExpenseCreate } from '../../types/supabase/expense';
import { uploadDocuments } from './storageService/uploadDocuments';
import { downloadDocument } from './storageService/downloadDocument';
import { redirect } from "next/navigation";



export async function createExpense(expense: ExpenseCreate): Promise<void> {

  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('expenses')
    .insert([{
      ...expense,
      user_id: user.id
    }]);

  if (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
}

export async function getExpenses(): Promise<Expense[]> {
  const supabase = await createSupabaseClient();
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
  
  const supabase = await createSupabaseClient();
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
  
  const supabase = await createSupabaseClient();
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
    const supabase = await createSupabaseClient();
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