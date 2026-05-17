'use client';

import React from 'react';
import { MapPin, Phone, Map } from 'lucide-react';
import { cn } from '@/utils/cn';
import { checkVendorStatus } from '@/utils/vendorLogic';

interface CompactHeaderVendorProps {
  vendor: {
    name: string;
    location?: string;
    is_manually_closed: boolean;
    opening_time: string;
    closing_time: string;
  };
  onClose: () => void;
}

export function CompactHeaderVendor({ vendor, onClose }: CompactHeaderVendorProps) {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(vendor.location || '')}`;
  
  // Real-time status calculation
  const currentStatus = checkVendorStatus(vendor);
  const isOpen = currentStatus === 'OPEN';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-lg">
          {vendor.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tight text-slate-900 leading-none mb-1">{vendor.name}</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className={cn(
                "h-1.5 w-1.5 rounded-full",
                isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              )} />
              <span className={cn(
                "text-[9px] font-bold uppercase tracking-widest transition-colors",
                isOpen ? "text-emerald-600" : "text-rose-500"
              )}>
                {isOpen ? 'Serving' : 'Closed'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <MapPin className="w-3 h-3" />
              <span className="text-[9px] font-bold truncate max-w-[80px] uppercase tracking-widest">
                {vendor.location || 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <a 
          href={mapUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-sky-50 hover:text-sky-600 transition-all border border-slate-100"
        >
          <Map className="w-4 h-4" />
        </a>
        <button 
          className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-sky-50 hover:text-sky-600 transition-all border border-slate-100"
        >
          <Phone className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
