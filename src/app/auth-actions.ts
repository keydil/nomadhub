'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard', 'layout');
  redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Usually requires email verification, but we'll assume they can proceed to onboarding.
  redirect('/onboarding');
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  
  // Need to get the origin for redirecting back. In a real app, this should be dynamic or pulled from env.
  // For now, we'll assume localhost:3000 or the production URL.
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }
  
  if (error) {
    throw error;
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  revalidatePath('/', 'layout');
  redirect('/login');
}

export async function setupStore(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const slug = formData.get('slug') as string;
  
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Not authenticated' };
  }
  
  // Create store with owner_id
  const { error } = await supabase
    .from('vendors')
    .insert([{
      id: slug, // using slug as id per previous schema logic
      name,
      description,
      owner_id: user.id
    }]);
    
  if (error) {
    // If slug is taken, it will throw a unique constraint error
    if (error.code === '23505') {
      return { error: 'That store URL is already taken. Please choose another.' };
    }
    return { error: error.message };
  }
  
  revalidatePath('/dashboard', 'layout');
  redirect('/dashboard');
}

