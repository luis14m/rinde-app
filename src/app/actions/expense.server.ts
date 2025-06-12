"use server";
import { createClient } from "@/utils/supabase/server";
import { Expense, ExpenseCreate } from '../../types/supabase/expense';
import { uploadDocuments } from './upload.server';
import { downloadDocument } from './download.server';
import * as XLSX from 'xlsx';
import { exec } from "child_process";


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

/**
 * Exporta los gastos del usuario autenticado a un archivo Excel y lo abre automáticamente en Windows.
 * @param outputDir Directorio donde guardar el Excel (por ejemplo, 'C:/Users/usuario/Downloads')
 * @param obra Nombre de la obra (para el nombre del archivo)
 * @param userNombre Nombre del usuario (para el nombre del archivo)
 * @param columnasSuma? (opcional) Columnas a sumar en el Excel
 */
export async function exportExpensesToExcel() {


  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // 1. Consultar los gastos del usuario
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error('No se encontraron gastos para exportar.');
  }

  // 2. Crear DataFrame y archivo Excel
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
/* 
  // 3. Ajustar columnas y sumar si corresponde (simple ejemplo)
  if (columnasSuma.length > 0) {
    const lastRow = data.length + 2;
    columnasSuma.forEach((col) => {
      const colIdx = Object.keys(data[0]).indexOf(col);
      if (colIdx !== -1) {
        const colLetter = XLSX.utils.encode_col(colIdx);
        worksheet[`${colLetter}${lastRow}`] = { t: 'n', f: `SUM(${colLetter}2:${colLetter}${data.length + 1})` };
      }
    });
  } */

  // 4. Construir nombre de archivo
  const now = new Date();
  const fecha = now.toISOString().slice(0,10).replace(/-/g, '');
  const hora = now.toTimeString().slice(0,8).replace(/:/g, '');
  const fileName = `rendiciones_${fecha}_${hora}.xlsx`;
  const filePath = `./${fileName}`;

  // 5. Guardar y abrir el archivo
  XLSX.writeFile(workbook, filePath);
  exec(`start "" "${filePath}"`); // Abre el archivo en Windows

  return filePath;
}

export { uploadDocuments, downloadDocument };