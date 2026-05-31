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

export async function signupWithStore(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const storeName = formData.get('storeName') as string;
  
  // Auto-generate slug from store name: convert spaces to hyphens
  const slug = storeName.toLowerCase().trim().replace(/[\s_]+/g, '-').replace(/[^a-z0-9-]/g, '') || `store-${Date.now()}`;

  const supabase = await createClient();

  // 1. Sign Up the User
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        is_verified: false // Custom metadata for frictionless UX banner
      }
    }
  });

  if (authError) {
    return { error: authError.message };
  }

  // Wait, if email confirmation is enabled, the user might not be logged in yet.
  // In a real app, we would use a webhook or service_role to create the tenant record.
  // Here we attempt to create it. If RLS blocks it, we might need to handle it.
  // Let's assume for this SaaS we have auto-login on signup (or email confirmations disabled during dev).
  
  if (authData.user) {
    let finalSlug = slug;
    const { error: dbError } = await supabase
      .from('vendors')
      .insert([{
        id: finalSlug,
        name: storeName,
        description: 'Welcome to my new elite boutique!',
        owner_id: authData.user.id
      }]);

    let storeCreated = true;

    if (dbError) {
      // If slug is taken, fallback to a unique slug
      if (dbError.code === '23505') {
        finalSlug = `${slug}-${Math.floor(Math.random() * 1000)}`;
        const { error: retryError } = await supabase.from('vendors').insert([{
          id: finalSlug,
          name: storeName,
          description: 'Welcome to my new elite boutique!',
          owner_id: authData.user.id
        }]);
        if (retryError) storeCreated = false;
      } else {
        console.error('Failed to create store record:', dbError);
        storeCreated = false;
        // We don't fail the signup, but the store wasn't created.
      }
    }

    // Auto-Inject 3 Dummy Menus to prevent Blank Slate Problem
    if (storeCreated) {
      const dummyMenus = [
        {
          vendor_id: finalSlug,
          title: 'Signature Elite Espresso',
          description: '{"description":"Kopi espresso klasik dengan sentuhan biji kopi pilihan kualitas dunia. Aroma tajam yang membangkitkan semangat.","hashtags":["#espresso","#kopi premium"]}',
          price: '35.000',
        },
        {
          vendor_id: finalSlug,
          title: 'Artisan Butter Croissant',
          description: '{"description":"Croissant mentega berlapis renyah yang dipanggang sempurna setiap pagi. Meleleh di mulut pada gigitan pertama.","hashtags":["#croissant","#pastry"]}',
          price: '45.000',
        },
        {
          vendor_id: finalSlug,
          title: 'Royal Matcha Latte',
          description: '{"description":"Perpaduan susu murni segar dan matcha asli Kyoto kualitas ceremonial grade.","hashtags":["#matcha","#latte"]}',
          price: '55.000',
        }
      ];

      await supabase.from('menus').insert(dummyMenus);
    }
  }

  revalidatePath('/dashboard', 'layout');
  redirect('/dashboard');
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

