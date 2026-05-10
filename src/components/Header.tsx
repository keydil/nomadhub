import React from 'react';
import Link from 'next/link';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-slate-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-400 to-sky-600 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg leading-none">N</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">NomadHub</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/vendor" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">
            Vendor
          </Link>
          <Link href="/queue" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">
            Queue
          </Link>
        </nav>
      </div>
    </header>
  );
};
