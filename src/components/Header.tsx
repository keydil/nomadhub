'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Header: React.FC = () => {
  const pathname = usePathname();

  // Hide header on vendor storefront pages and dashboard
  const isStorefront = pathname !== '/' && !pathname?.startsWith('/login') && !pathname?.startsWith('/signup') && !pathname?.startsWith('/onboarding');
  if (isStorefront) return null;

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-slate-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-400 to-sky-600 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg leading-none">N</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">NomadHub</span>
        </Link>
        <nav className="flex items-center gap-5">
          <Link href="/mr-churraos" className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors">
            Demo Store
          </Link>
          <div className="h-4 w-px bg-slate-300 hidden sm:block"></div>
          <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link href="/signup" className="text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 px-4 py-2 rounded-full transition-colors shadow-sm">
            Create Store
          </Link>
        </nav>
      </div>
    </header>
  );
};
