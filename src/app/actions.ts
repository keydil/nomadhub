'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { createClient as createServerSupabase } from '@/utils/supabase/server';

// We no longer use a hardcoded default slug for dashboard actions.
// Instead, we derive the vendor ID from the currently authenticated user.

// Utility to get the default vendor ID based on logged in user's owner_id
async function getDefaultVendorId() {
  const sb = await createServerSupabase();
  const { data: { user } } = await sb.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await sb
    .from('vendors')
    .select('id')
    .eq('owner_id', user.id)
    .single();
    
  if (error || !data) {
    console.error("Error fetching vendor ID for user:", error?.message);
    return null;
  }
  return data.id;
}

import { checkVendorStatus } from '@/utils/vendorStatus';

export async function fetchVendor() {
  const vendorId = await getDefaultVendorId();
  if (!vendorId) return null;

  const sb = await createServerSupabase();
  const { data, error } = await sb
    .from('vendors')
    .select('*')
    .eq('id', vendorId)
    .single();

  if (error || !data) {
    console.error('Error fetching vendor:', error?.message);
    return null;
  }
  
  // Dynamic status check using our new utility
  const isOpen = checkVendorStatus({
    is_manually_closed: data.is_manually_closed,
    opening_time: data.opening_time,
    closing_time: data.closing_time
  });

  return {
    ...data,
    slug: data.id,
    status: isOpen ? 'open' : 'closed',
    activeQueueCount: data.active_queue_count || 0
  };
}

export async function setVendorStatus(status: 'open' | 'closed') {
  const vendorId = await getDefaultVendorId();
  if (!vendorId) return;

  // Now we update is_manually_closed instead of just a 'status' string
  const isManuallyClosed = status === 'closed';

  const sb = await createServerSupabase();
  await sb
    .from('vendors')
    .update({ is_manually_closed: isManuallyClosed })
    .eq('id', vendorId);

  revalidatePath('/dashboard');
  revalidatePath(`/${vendorId}`);
}

export async function setVendorLocation(location: string) {
  const vendorId = await getDefaultVendorId();
  if (!vendorId) return;

  await supabase
    .from('vendors')
    .update({ location })
    .eq('id', vendorId);

  revalidatePath('/dashboard');
  revalidatePath(`/${vendorId}`);
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

  revalidatePath('/dashboard/menu');
  revalidatePath(`/${vendorId}`);
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

  const isOpen = checkVendorStatus({
    is_manually_closed: data.is_manually_closed,
    opening_time: data.opening_time,
    closing_time: data.closing_time
  });

  return {
    ...data,
    slug: data.id,
    status: isOpen ? 'open' : 'closed',
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
  revalidatePath('/dashboard');
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

  revalidatePath('/dashboard');
  revalidatePath(`/${vendorId}`);
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
