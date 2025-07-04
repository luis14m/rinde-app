"use server";
import { createClient } from "@/utils/supabase/server";
import type { Expense } from "@/types/expenses";


export async function getAllExpenses(): Promise<Expense[]> {

  const supabase = await createClient();


  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("archivado", false)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAllStoreExpenses(): Promise<Expense[]> {
  const supabase = await createClient();


  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("archivado", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

