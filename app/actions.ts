'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export type ActionState = {
  success: boolean;
  message: string;
  link?: string;
  error?: string;
};


/**
 * Upload a content in the db and allow to pay and download it by url `d/${id}`
 * @param prevState 
 * @param formData 
 * @returns 
 */
export async function generateLink(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const file = formData.get('file') as File;
  const price = formData.get('price') as string;

  if (!file) {
    return { success: false, message: 'No file uploaded' };
  }

  // 1. Upload to Supabase Storage
  const filename = `${Date.now()}-${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!)
    .upload(filename, file);

  if (uploadError) {
    console.error('Upload Error:', uploadError);
    return { success: false, message: 'File upload failed' };
  }

  // 2. Save metadata to DB
  const { data: insertData, error: dbError } = await supabase
    .from('files')
    .insert({
      filename: file.name,
      size: file.size,
      price: parseFloat(price) || 0,
      storage_path: uploadData.path,
    })
    .select('id')
    .single();

  if (dbError) {
    console.error('DB Error:', dbError);
    return { success: false, message: 'Metadata save failed' };
  }

  // 3. Generate Link
  const link = `/d/${insertData.id}`;

  return { success: true, message: 'Success', link };
}

/**
 * Generate a URL to download a file from the SupaBase storage by id
 * @param fileId file id
 * @returns URL to download the file
 */
export async function downloadFile(fileId: string) {
  try {
    const supabase = await createClient()

    const { data: file, error: fileError } = await supabase.from("files").select("*").eq("id", fileId).single()

    if (fileError) {
      console.error("Error, while retrieving file", fileError);
      return null
    }

    const { data, error } = await supabase.storage.
      from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!)
      .createSignedUrl(file!.storage_path, 3600, {
        download: file.filename,
      })

    if (error || !data?.signedUrl) {
      console.error('Error creating signed URL:', error);
      return null; // Or handle the error appropriately
    }

    return data.signedUrl;

  } catch (err) {
    return console.error("Error at downloadFile function", err);
  }
}

export type PaymentResult = {
  success: boolean;
  message?: string;
  downloadUrl?: string;
  redirectURL?: string;
}

export async function initiatePayment(fileId: string): Promise<PaymentResult> {
  const supabase = await createClient();

  // Verify file exists
  const { data: file } = await supabase.from('files').select('*').eq('id', fileId).single();

  if (!file) {
    return { success: false, message: 'File not found' };
  }

  // 1. Create a pending order
  const { data: order, error } = await supabase
    .from('orders')
    .insert({ file_id: fileId, status: 'pending' })
    .select()
    .single();

  if (error) throw new Error('Failed to create order');


  // Mock Payment Logic -> Generate Signed URL
  const { data } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!)
    .createSignedUrl(file.storage_path, 3600 * 24, {
      download: file.filename,
    }); // 1 hour link

  if (!data?.signedUrl) {
    return { success: false, message: 'Could not generate download link' };
  }

  // 2. Create a redirect to Telegram with the payload
  const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME!; // e.g., 'StarDropBot'
  console.log(botUsername, fileId);
  const redirectURL = `https://t.me/${botUsername}?start=order_${order.id}`
  console.log(data.signedUrl);

  return { success: true, downloadUrl: data.signedUrl, redirectURL, message: "Success initiate payment" };
}
