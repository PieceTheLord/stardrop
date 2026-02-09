'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export type ActionState = {
  success: boolean;
  message: string;
  link?: string;
  error?: string;
};

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

export type PaymentResult = {
  success: boolean;
  message?: string;
  downloadUrl?: string;
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
    .createSignedUrl(file.storage_path, 3600, {
      download: file.filename,
    }); // 1 hour link

  if (!data?.signedUrl) {
    return { success: false, message: 'Could not generate download link' };
  }

  // 2. Redirect to Telegram with the payload


  return { success: true, downloadUrl: data.signedUrl };
}
