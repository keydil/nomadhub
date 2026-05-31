import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { VerificationBanner } from '@/components/VerificationBanner';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if user has a store
  const { data: vendor, error } = await supabase
    .from('vendors')
    .select('id, is_email_verified')
    .eq('owner_id', user.id)
    .single();

  if (error || !vendor) {
    // If no store found, redirect to onboarding
    redirect('/onboarding');
  }

  // Check verification status from both user metadata AND vendor record
  const isEmailConfirmed = user.user_metadata?.is_verified === true || vendor.is_email_verified === true;

  return (
    <>
      {!isEmailConfirmed && (
        <VerificationBanner email={user.email || ''} />
      )}
      {children}
    </>
  );
}

