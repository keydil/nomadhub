'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function VendorDashboard() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeQueueCount, setActiveQueueCount] = useState(14);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Vendor Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your stall, queue, and menu from one place.</p>
        </div>
        
        <div className="flex items-center bg-white border border-slate-200 rounded-full p-1 shadow-sm">
          <button 
            onClick={() => setIsOpen(false)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!isOpen ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Closed
          </button>
          <button 
            onClick={() => setIsOpen(true)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isOpen ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Open
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card glass className="bg-gradient-to-br from-white to-sky-50/50 border-sky-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-600 text-sm font-medium">Active Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-sky-600">{activeQueueCount}</span>
              <span className="text-slate-500">orders</span>
            </div>
            <p className="text-sm text-sky-600 mt-2 flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              Live updating
            </p>
          </CardContent>
        </Card>

        <Card glass>
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-600 text-sm font-medium">Est. Wait Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-800">~25</span>
              <span className="text-slate-500">mins</span>
            </div>
            <p className="text-sm text-emerald-600 mt-2 font-medium">Optimal flow</p>
          </CardContent>
        </Card>

        <Card glass>
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-600 text-sm font-medium">Today&apos;s Served</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-800">86</span>
            </div>
            <p className="text-sm text-emerald-600 mt-2 font-medium">+12% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/vendor/menu" className="block">
          <Card className="hover:border-sky-300 hover:shadow-md transition-all cursor-pointer h-full border-slate-200 group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-900 group-hover:text-sky-600 transition-colors">AI Menu Manager</h3>
                <p className="text-sm text-slate-500">Add dishes & let AI generate details</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Card className="border-slate-200 opacity-70">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900">Analytics (Soon)</h3>
              <p className="text-sm text-slate-500">View sales and customer insights</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
