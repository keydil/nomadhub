'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { logout } from '@/app/auth-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { fetchVendor, setVendorStatus, setVendorLocation, fetchActiveQueues, updateQueueStatus } from '@/app/actions';

interface QueueItem {
  id: string;
  customer_name: string;
  queue_number: number;
  created_at: string;
}

export default function VendorDashboard() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeQueueCount, setActiveQueueCount] = useState(0);
  const [location, setLocation] = useState('');
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const [vendorSlug, setVendorSlug] = useState('');
  const [queues, setQueues] = useState<QueueItem[]>([]);
  const [isMarkingDone, setIsMarkingDone] = useState<string | null>(null);

  const fetchQueuesData = async () => {
    const q = await fetchActiveQueues();
    if (q) {
      setQueues(q as QueueItem[]);
      setActiveQueueCount(q.length);
    }
  };

  useEffect(() => {
    const loadVendor = async () => {
      const v = await fetchVendor();
      if (v) {
        setIsOpen(v.status === 'open');
        setLocation(v.location);
        setVendorSlug(v.slug);
        await fetchQueuesData();
      }
    };
    loadVendor();

    // Poll for new queues every 5 seconds
    const interval = setInterval(() => {
      fetchQueuesData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleQueueDone = async (queueId: string) => {
    setIsMarkingDone(queueId);
    await updateQueueStatus(queueId, 'completed');
    await fetchQueuesData();
    setIsMarkingDone(null);
    toast.success('Pesanan berhasil diselesaikan!', { icon: '🎉' });
  };

  const handleStatusChange = async (status: 'open' | 'closed') => {
    setIsOpen(status === 'open');
    await setVendorStatus(status);
    toast.success(`Stall status changed to ${status.toUpperCase()}`);
  };

  const handleLocationUpdate = async () => {
    setIsUpdatingLocation(true);
    await setVendorLocation(location);
    setIsUpdatingLocation(false);
    toast.success('Live Location updated successfully!', { icon: '📍' });
  };

  const handleLogout = () => {
    toast.warning('Apakah Anda yakin ingin logout?', {
      action: {
        label: 'Logout',
        onClick: async () => await logout(),
      },
      duration: 5000,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Vendor Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your stall, queue, and menu from one place.</p>
        </div>
        
        <div className="flex gap-3 items-center">
          {vendorSlug && (
            <Link href={`/${vendorSlug}`} target="_blank" className="text-sm font-medium text-sky-600 hover:text-sky-700 underline underline-offset-4 mr-2">
              View Public Store
            </Link>
          )}
          <div className="flex items-center bg-white border border-slate-200 rounded-full p-1 shadow-sm">
            <button 
              onClick={() => handleStatusChange('closed')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!isOpen ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Closed
            </button>
            <button 
              onClick={() => handleStatusChange('open')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isOpen ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Open
            </button>
          </div>

          <Button 
            onClick={handleLogout}
            variant="outline"
            className="px-3 py-2 h-auto border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-colors rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Live Location Card */}
      <Card className="mb-8 border-sky-200 shadow-md shadow-sky-50 bg-gradient-to-r from-white to-sky-50/50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1 w-full">
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Update Live Location</h3>
              <p className="text-sm text-slate-500 mb-4">Let your customers know exactly where you are parked right now.</p>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. GBK Festival, Gate 3"
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <Button onClick={handleLocationUpdate} disabled={isUpdatingLocation}>
                  {isUpdatingLocation ? 'Saving...' : 'Update'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          Live Queue
          <span className="bg-sky-100 text-sky-600 px-2 py-0.5 rounded-full text-sm">{queues.length}</span>
        </h2>
        
        {queues.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center">
            <div className="w-16 h-16 mx-auto bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">No active queues right now.</p>
            <p className="text-slate-400 text-sm mt-1">Customers who join will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {queues.map((q) => (
              <Card key={q.id} className="border-slate-200 hover:border-sky-300 transition-colors">
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-6 w-full sm:w-auto">
                    <div className="text-4xl font-black text-slate-200 w-16 text-center">#{q.queue_number}</div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">{q.customer_name}</h4>
                      <p className="text-sm text-slate-500">Joined at {new Date(q.created_at).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleQueueDone(q.id)}
                    disabled={isMarkingDone === q.id}
                    className="w-full sm:w-auto px-8 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 border-0"
                    variant="outline"
                  >
                    {isMarkingDone === q.id ? 'Marking...' : 'Selesai'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
