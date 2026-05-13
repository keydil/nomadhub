import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function StorefrontLoading() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Store Header Skeleton */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-12 max-w-3xl text-center flex flex-col items-center">
          <Skeleton className="w-24 h-24 rounded-3xl mb-6" />
          <Skeleton className="h-10 w-64 mb-4" />
          
          <div className="flex gap-4 mt-6">
            <Skeleton className="h-8 w-28 rounded-full" />
            <Skeleton className="h-8 w-40 rounded-full" />
          </div>
          <Skeleton className="h-10 w-36 rounded-full mt-8" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl space-y-12">
        {/* Menu List Skeleton */}
        <div>
          <Skeleton className="h-8 w-40 mb-6" />
          
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl overflow-hidden p-0 flex flex-col sm:flex-row shadow-sm">
                <Skeleton className="w-full sm:w-40 md:w-48 aspect-[4/3] sm:aspect-square shrink-0 rounded-none" />
                <div className="flex-1 p-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
