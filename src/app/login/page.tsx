'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { login } from '@/app/auth-actions';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
      toast.error('Login gagal', { description: result.error });
    } else {
      toast.success('Login berhasil! Selamat datang kembali 👋');
    }
    // NextJS `redirect()` internally called by actions handles navigation automatically if no return error
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-sky-50/30 px-4">
      <div className="w-full max-w-md">
        {/* Logo / Title top */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-sky-700 flex items-center justify-center shadow-lg shadow-sky-200 mb-3">
            <span className="text-white font-black text-2xl">N</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 mt-1 font-medium">Enter credentials to manage your store</p>
        </div>

        {/* Main Glass Form Container */}
        <Card className="border-white/60 bg-white/70 backdrop-blur-xl shadow-xl shadow-sky-100/50 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sky-400 to-indigo-500"></div>
          <CardContent className="p-8 pt-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium animate-in slide-in-from-top-2">
                  ⚠️ {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-semibold text-slate-700 ml-1">
                  Email Vendor
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="owner@company.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all bg-white/80"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                    Password
                  </label>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all bg-white/80"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                size="lg"
                fullWidth
                className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200 mt-4 rounded-xl h-12 transition-transform active:scale-[0.98]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Securing access...
                  </span>
                ) : (
                  'Sign In to Dashboard'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Elegant footer links */}
        <div className="text-center mt-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-sky-600 transition-colors gap-1.5 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Bukan vendor? Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
