import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/dashboard?verify=invalid', req.url));
  }

  const supabase = await createClient();

  // 1. Find the vendor with this token
  const { data: vendor, error } = await supabase
    .from('vendors')
    .select('id, verification_token, verification_expires_at, owner_id')
    .eq('verification_token', token)
    .single();

  if (error || !vendor) {
    return NextResponse.redirect(new URL('/dashboard?verify=invalid', req.url));
  }

  // 2. Check if token is expired
  if (vendor.verification_expires_at && new Date(vendor.verification_expires_at) < new Date()) {
    return NextResponse.redirect(new URL('/dashboard?verify=expired', req.url));
  }

  // 3. Mark vendor as verified and clear the token
  const { error: updateError } = await supabase
    .from('vendors')
    .update({
      is_email_verified: true,
      verification_token: null,
      verification_expires_at: null,
    })
    .eq('id', vendor.id);

  if (updateError) {
    console.error('Verification update error:', updateError);
    return NextResponse.redirect(new URL('/dashboard?verify=error', req.url));
  }

  // 4. Also update user metadata to mark as verified (so the layout banner disappears)
  await supabase.auth.updateUser({
    data: { is_verified: true }
  });

  // 5. Redirect to dashboard with success
  return NextResponse.redirect(new URL('/dashboard?verify=success', req.url));
}
