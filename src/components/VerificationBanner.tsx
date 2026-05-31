'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import { Mail, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface VerificationBannerProps {
  email: string;
}

export function VerificationBanner({ email }: VerificationBannerProps) {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const searchParams = useSearchParams();

  // Handle ?verify= query params from the verification link redirect
  useEffect(() => {
    const verifyStatus = searchParams.get('verify');
    if (verifyStatus === 'success') {
      toast.success('Email berhasil diverifikasi! 🎉', {
        description: 'Toko Anda sekarang sudah aktif sepenuhnya.',
        duration: 5000,
      });
    } else if (verifyStatus === 'expired') {
      toast.error('Link verifikasi sudah kadaluarsa.', {
        description: 'Silakan kirim ulang email verifikasi.',
      });
    } else if (verifyStatus === 'invalid') {
      toast.error('Link verifikasi tidak valid.', {
        description: 'Silakan kirim ulang email verifikasi.',
      });
    }
  }, [searchParams]);

  const handleSendVerification = async () => {
    setIsSending(true);
    try {
      const response = await fetch('/api/send-verification', { method: 'POST' });
      const data = await response.json();

      if (response.ok) {
        setIsSent(true);
        toast.success('Email verifikasi terkirim! 📨', {
          description: `Cek inbox ${email} (atau folder Spam).`,
          duration: 8000,
        });
      } else {
        toast.error('Gagal mengirim email.', {
          description: data.error || 'Silakan coba lagi.',
        });
      }
    } catch (err) {
      toast.error('Terjadi kesalahan jaringan.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200 text-amber-900 px-4 py-3 z-50 relative shadow-sm">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-sm font-medium">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
          <span>
            Verifikasi email <strong>{email}</strong> untuk mengaktifkan toko Anda sepenuhnya.
          </span>
        </span>

        {isSent ? (
          <span className="flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full shrink-0">
            <CheckCircle2 className="h-4 w-4" />
            Email Terkirim!
          </span>
        ) : (
          <button
            onClick={handleSendVerification}
            disabled={isSending}
            className="flex items-center gap-2 text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-full transition-all shadow-md shadow-amber-200 disabled:opacity-50 shrink-0 cursor-pointer"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Kirim Email Verifikasi
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
