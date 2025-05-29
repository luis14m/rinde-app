import { FileMetadata } from '@/types/supabase/expense';
import { createClient } from '@/utils/supabase/server';

export async function uploadDocuments(files: File[]): Promise<FileMetadata[]> {
  const supabase = await createClient();

   const { data: { user } } = await supabase.auth.getUser();
    
  if (!user) {
    throw new Error('User not authenticated');
  }

  const uploadPromises = files.map(async (file) => {
    try {
      // Create a unique folder for each upload session using user_id
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
      //***SUBAPASE ENTREGA EL NOMBRE DE ARCHIVO CON UN 25 ANTES DEL ESPACIO  */

     
      const { data: { publicUrl } } = supabase.storage
        .from('expense-documents')
        .getPublicUrl(filePath);
      console.log('url publica obtenida:', publicUrl)
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