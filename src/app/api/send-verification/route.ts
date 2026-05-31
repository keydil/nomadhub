import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Generate a simple verification token
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

  // Store the token in the vendor record
  const { error: updateError } = await supabase
    .from('vendors')
    .update({ 
      verification_token: token,
      verification_expires_at: expiresAt 
    })
    .eq('owner_id', user.id);

  if (updateError) {
    console.error('Error storing verification token:', updateError);
    return NextResponse.json({ error: 'Failed to generate verification' }, { status: 500 });
  }

  // Build the verification URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const verifyUrl = `${baseUrl}/api/verify?token=${token}`;

  // Send email via Resend
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
  }

  try {
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'NomadHub <no-reply@nomadhub.biz.id>',
        to: [user.email],
        subject: '✅ Verifikasi Email NomadHub Anda',
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 560px; margin: 0 auto; background-color: #ffffff;">
            <div style="background: linear-gradient(135deg, #0c1a2e 0%, #1e3a5f 100%); padding: 40px 32px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: #f5f0e8; font-size: 28px; margin: 0 0 8px 0; font-weight: 800; letter-spacing: -0.5px;">NomadHub</h1>
              <p style="color: #d4a745; font-size: 13px; margin: 0; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">Verifikasi Email</p>
            </div>
            
            <div style="padding: 40px 32px;">
              <h2 style="color: #1a1a2e; font-size: 22px; margin: 0 0 16px 0; font-weight: 700;">Halo, Penjual Hebat! 👋</h2>
              <p style="color: #64748b; font-size: 15px; line-height: 1.7; margin: 0 0 24px 0;">
                Terima kasih sudah bergabung di NomadHub. Klik tombol di bawah ini untuk memverifikasi alamat email Anda dan mengaktifkan toko Anda sepenuhnya.
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: #ffffff; padding: 16px 48px; text-decoration: none; border-radius: 12px; font-size: 16px; font-weight: 700; letter-spacing: 0.3px; box-shadow: 0 4px 14px rgba(14, 165, 233, 0.4);">
                  Verifikasi Email Saya
                </a>
              </div>
              
              <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 24px 0 0 0; text-align: center;">
                Link ini berlaku selama 24 jam.<br/>
                Jika Anda tidak mendaftar di NomadHub, abaikan email ini.
              </p>
            </div>
            
            <div style="background-color: #f8fafc; padding: 24px 32px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} NomadHub — Smart Queue Engine for Street Vendors
              </p>
            </div>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errData = await emailResponse.json();
      console.error('Resend API Error:', errData);
      return NextResponse.json({ error: 'Failed to send email', details: errData }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Verification email sent!' });
  } catch (err) {
    console.error('Email send error:', err);
    return NextResponse.json({ error: 'Email service error' }, { status: 500 });
  }
}
