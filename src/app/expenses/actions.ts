"use server";
import { createClient } from "@/utils/supabase/server";
import type { Expense, ExpenseCreate, FileMetadata } from "@/types/expenses";


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
    .eq('archivado', false)
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

export async function updateExpense(id: string, expense: Partial<Expense>)
  : Promise<void> {
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
    console.error('Error updating expense state:', error);
    throw error;
  }
}

export async function updateStateOfExpense(id: string, estadoNuevo: string)
: Promise<void> {

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user === null || user === undefined) {
    throw new Error('User not authenticated');
  }

  try {
    const { error } = await supabase
      .from('expenses')
      .update({ estado: estadoNuevo })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating expense state:', error);
    throw error;
  }
}

export async function storeExpense(id: string) {
  const supabase = await createClient();
  try {
    const { error } = await supabase
      .from('expenses')
      .update({ archivado: true })
      .eq('id', id);

    if (error) throw error;

  }
  catch (error) {
    console.error('Error storing expense:', error);
    throw error;
  }
}



/* export async function deleteExpense(id: string): Promise<void> {
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
} */


export async function downloadDocument(publicUrl: string): Promise<boolean> {
  try {
    // Extract the path from the public URL
    const url = new URL(publicUrl);
    const pathSegments = url.pathname.split('/');
    const bucketIndex = pathSegments.indexOf('expense-documents');

    if (bucketIndex === -1) {
      throw new Error('Invalid file URL');
    }

    // Get the file path within the bucket (everything after 'expense-documents')
    const filePath = pathSegments.slice(bucketIndex + 1).join('/');


    const supabase = await createClient();

    // Get the file data
    const { data, error } = await supabase.storage
      .from('expense-documents')
      .download(filePath);

    if (error) {
      console.error('Error downloading file:', error);
      return false;
    }

    if (!data) {
      console.error('No data received');
      return false;
    }

    // Get the original filename from the URL
    const originalName = decodeURIComponent(pathSegments[pathSegments.length - 1]);

    // Create a download link
    const blobUrl = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = originalName;
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);

    return true;
  } catch (error) {
    console.error('Error in downloadDocument:', error);
    return false;
  }
}

export async function uploadDocuments(files: File[]): Promise<FileMetadata[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const uploadPromises = files.map(async (file) => {
    try {
      const timestamp = Date.now();
      const filePath = `${user.id}/uploads/${timestamp}/${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('expense-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }

      // Obtener la URL pública del archivo subido
      const publicUrlResult = supabase.storage
        .from('expense-documents')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlResult.data?.publicUrl;
      if (!publicUrl) {
        throw new Error('No se pudo obtener la URL pública del archivo');
      }

      // Reemplazar %2520 por %20
      const correctedUrl = publicUrl.replace(/%2520/g, '%20');

      return {
        url: correctedUrl,
        originalName: file.name,
        size: file.size,
        type: file.type
      };
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
      throw error;
    }
  });

  return Promise.all(uploadPromises);
}

export async function getCurrentUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  if (error) return null;
  return data;
}
