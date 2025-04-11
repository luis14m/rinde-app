"use server";
import { createSupabaseClient } from "@/utils/supabase/server";
import { Expense, ExpenseCreate } from '../../types/supabase/expense';
import { uploadDocuments } from './storageService/uploadDocuments';
import { downloadDocument } from './storageService/downloadDocument';
import { redirect } from "next/navigation";



export async function createExpense(expense: ExpenseCreate): Promise<{ success: boolean; error?: string }> {

  const supabase = await createSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) redirect("/error");
  
  try {
    const { data, error } = await supabase
      .from("expenses")
      .insert([expense])
     // .select(); // Devuelve el registro insertado

    if (error) {
      console.error("Error guardando expense:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error inesperado al crear el Gasto:", error);
    return { success: false, error: "Error inesperado" };
  }
}

export async function getExpenses(userId?: string): Promise<Expense[]> {

  const supabase = await createSupabaseClient();

  const {data: { user },} = await supabase.auth.getUser();
 
  
  //console.log('user', user);
  
  if (!user) {
    throw new Error('User no autenticado');
  }
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user.id)
    

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