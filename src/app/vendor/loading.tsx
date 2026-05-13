import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function VendorLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
      {/* Top Control bar Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left col: Location management skeletons */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Right col: Quick Access Grid skeleton */}
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>

      {/* Queue Section Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-7 w-48" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
