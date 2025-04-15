import { createSupabaseClient } from "@/utils/supabase/server";

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

    
    const supabase = await createSupabaseClient();
    
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