'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signup, signInWithGoogle } from '@/app/auth-actions';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  async function handleGoogleLogin() {
    setIsGoogleLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate with Google');
      setIsGoogleLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await signup(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
      toast.error('Signup failed', { description: result.error });
    } else {
      toast.success('Account created! Welcome to NomadHub. 🎉');
      // Redirect handled by the server action
    }
  }

  return (
    <div className="flex min-h-screen bg-white flex-row-reverse">
      {/* Right Panel - Branding & Image (Reversed for Signup to look distinct but unified) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <Image 
          src="/auth-bg.png" 
          alt="NomadHub Luxury Aesthetic" 
          fill
          priority
          className="object-cover opacity-60 mix-blend-overlay scale-x-[-1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-end p-16 h-full text-white">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-400 to-emerald-500 flex items-center justify-center shadow-xl shadow-sky-500/20 mb-8">
            <span className="font-black text-3xl">N</span>
          </div>
          <h2 className="text-5xl font-black tracking-tight leading-tight mb-6">
            Start your <br/>journey today.
          </h2>
          <p className="text-lg text-slate-300 max-w-md leading-relaxed font-medium">
            Create an elite storefront in seconds. Manage menus with AI and completely eliminate chaotic queues.
          </p>
        </div>
      </div>

      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 xl:p-24 bg-white relative">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 lg:hidden flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 to-sky-600 flex items-center justify-center shadow-md">
            <span className="font-bold text-white text-xl">N</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">NomadHub</span>
        </div>

        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Create an account</h1>
            <p className="text-slate-500 font-medium">Enter your details below to set up your store.</p>
          </div>

          <div className="space-y-6">
            <button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-bold h-14 rounded-2xl transition-all shadow-sm active:scale-[0.98]"
            >
              {isGoogleLoading ? (
                <div className="w-5 h-5 border-2 border-slate-400 border-t-slate-700 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  <path d="M1 1h22v22H1z" fill="none"/>
                </svg>
              )}
              Sign up with Google
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-xs font-bold uppercase tracking-widest text-slate-400">or continue with email</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium animate-in fade-in slide-in-from-top-2">
                  <span className="font-bold">Error:</span> {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="owner@nomadhub.app"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 font-medium placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-bold text-slate-700 ml-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 font-medium placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                size="lg"
                fullWidth
                className="bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-200 mt-2 rounded-2xl h-14 font-black transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm font-medium text-slate-500 pt-6">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-sky-500 hover:text-sky-600 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
