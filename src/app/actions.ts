'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { createClient as createServerSupabase } from '@/utils/supabase/server';

// Hardcoded vendor ID for demo (Assuming this matches a UUID in your DB or we lookup by slug)
// For a real app, this comes from auth context.
const DEFAULT_VENDOR_SLUG = 'mr-churraos';

// Utility to get the default vendor ID based on slug/id
async function getDefaultVendorId() {
  const { data, error } = await supabase
    .from('vendors')
    .select('id')
    .eq('id', DEFAULT_VENDOR_SLUG)
    .single();
    
  if (error || !data) {
    console.error("Error fetching default vendor ID:", error);
    return null;
  }
  return data.id;
}

export async function fetchVendor() {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', DEFAULT_VENDOR_SLUG)
    .single();

  if (error) {
    console.error('Error fetching vendor:', error);
    return null;
  }
  
  // Transform to match old mock DB format if necessary
  return {
    ...data,
    slug: data.id, // Map id to slug for frontend compatibility
    status: data.status || 'open', // Default if column missing
    activeQueueCount: data.active_queue_count || 0 // Default if column missing
  };
}

export async function setVendorStatus(status: 'open' | 'closed') {
  const vendorId = await getDefaultVendorId();
  if (!vendorId) return;

  await supabase
    .from('vendors')
    .update({ status })
    .eq('id', vendorId);

  revalidatePath('/vendor');
  revalidatePath(`/${DEFAULT_VENDOR_SLUG}`);
}

export async function setVendorLocation(location: string) {
  const vendorId = await getDefaultVendorId();
  if (!vendorId) return;

  await supabase
    .from('vendors')
    .update({ location })
    .eq('id', vendorId);

  revalidatePath('/vendor');
  revalidatePath(`/${DEFAULT_VENDOR_SLUG}`);
}

export async function fetchMenu() {
  const vendorId = await getDefaultVendorId();
  if (!vendorId) return [];

  const { data, error } = await supabase
    .from('menus')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('id', { ascending: false });

  if (error) {
    console.error('Error fetching menus:', error);
    return [];
  }
  
  return data.map(item => ({
    ...item,
    imageUrl: item.image_url,
    vendorId: item.vendor_id
  }));
}

export async function saveMenuItem(title: string, description: string, price: string, imageUrl?: string) {
  const vendorId = await getDefaultVendorId();
  if (!vendorId) return;

  const sb = await createServerSupabase();

  const { error } = await sb
    .from('menus')
    .insert([{
      vendor_id: vendorId,
      title,
      description,
      price,
      image_url: imageUrl // Mapping our parameter to db snake_case column
    }]);

  if (error) {
    console.error('Error saving menu item:', error);
    return;
  }

  revalidatePath('/vendor/menu');
  revalidatePath(`/${DEFAULT_VENDOR_SLUG}`);
}

export async function uploadMenuImage(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) throw new Error('No file chosen');

  const sb = await createServerSupabase();
  
  const fileExt = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
  const uuid = crypto.randomUUID();
  const filePath = `${uuid}.${fileExt}`;

  console.log('Starting Upload to Supabase Storage:', filePath);

  // Convert web File into generic Buffer readable by native Supabase SDK on server
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { data, error } = await sb.storage
    .from('menu-images')
    .upload(filePath, buffer, {
      contentType: file.type || 'image/jpeg', // ensure non-empty fallback
      upsert: false
    });

  if (error) {
    // VITAL: Dump exact error object to server console to identify RLS vs Bucket vs Payload
    console.error('[Supabase Upload CRASH REPORT]:', JSON.stringify(error, null, 2));
    throw new Error(`Supabase Storage Error: [${error.name}] - ${error.message}`);
  }

  // Retrieve public tracking url
  const { data: { publicUrl } } = sb.storage
    .from('menu-images')
    .getPublicUrl(filePath);

  return publicUrl;
}

// Data fetching methods for the public storefront

export async function getVendorBySlug(slug: string) {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', slug)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    slug: data.id,
    status: data.status || 'open',
    activeQueueCount: data.active_queue_count || 0
  };
}

export async function getMenuItemsByVendorId(vendorId: string) {
  const { data, error } = await supabase
    .from('menus')
    .select('*')
    .eq('vendor_id', vendorId);

  if (error) return [];

  return data.map(item => ({
    ...item,
    imageUrl: item.image_url,
    vendorId: item.vendor_id
  }));
}

// --- Queue Management Actions ---

export async function joinQueue(vendorId: string, customerName: string) {
  // Get current max queue number
  const { count, error: countError } = await supabase
    .from('queues')
    .select('*', { count: 'exact', head: true })
    .eq('vendor_id', vendorId);
    
  const queueNumber = (count || 0) + 1;

  const { data, error } = await supabase
    .from('queues')
    .insert([{
      vendor_id: vendorId,
      customer_name: customerName,
      status: 'waiting',
      queue_number: queueNumber
    }])
    .select()
    .single();

  if (error) {
    console.error('Error joining queue:', error);
    return null;
  }
  
  revalidatePath(`/${vendorId}`);
  revalidatePath('/vendor');
  return data;
}

export async function fetchActiveQueues() {
  const vendorId = await getDefaultVendorId();
  if (!vendorId) return [];

  const { data, error } = await supabase
    .from('queues')
    .select('*')
    .eq('vendor_id', vendorId)
    .eq('status', 'waiting')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching queues:', error);
    return [];
  }
  
  return data;
}

export async function updateQueueStatus(queueId: string, status: 'completed' | 'cancelled') {
  const vendorId = await getDefaultVendorId();
  if (!vendorId) return;

  const { error } = await supabase
    .from('queues')
    .update({ status })
    .eq('id', queueId);

  if (error) {
    console.error('Error updating queue status:', error);
    return;
  }

  revalidatePath('/vendor');
  revalidatePath(`/${DEFAULT_VENDOR_SLUG}`);
}

export async function checkQueueStatus(queueId: string) {
  const { data, error } = await supabase
    .from('queues')
    .select('status')
    .eq('id', queueId)
    .single();

  if (error) {
    console.error('Error checking queue status:', error);
    return null;
  }
  
  return data.status as string;
}
