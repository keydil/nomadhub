'use client';

import React from 'react';
import { MapPin, Phone, Map } from 'lucide-react';
import { cn } from '@/utils/cn';
import { checkVendorStatus } from '@/utils/vendorLogic';
import { EcosystemDrawer } from './EcosystemDrawer';

interface CompactHeaderVendorProps {
  vendor: {
    id: string;
    name: string;
    location?: string;
    is_manually_closed: boolean;
    opening_time: string;
    closing_time: string;
    logo_url?: string;
  };
  onClose: () => void;
}

export function CompactHeaderVendor({ vendor, onClose }: CompactHeaderVendorProps) {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(vendor.location || '')}`;
  
  // Real-time status calculation
  const currentStatus = checkVendorStatus(vendor);
  const isOpen = currentStatus === 'OPEN';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-blue-900/10 shadow-sm px-4 sm:px-6 py-4 flex items-center justify-between transition-all">
      <div className="flex items-center">
        <EcosystemDrawer currentVendorId={vendor.id} />
        <div className="flex items-center gap-3">
          <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-inner ring-1 ring-blue-900/20 overflow-hidden shrink-0",
          vendor.logo_url 
            ? "bg-white p-0.5" // Clean background for transparent logos
            : "bg-gradient-to-br from-blue-800 to-blue-950 text-amber-100"
        )}>
          {vendor.logo_url ? (
            <img src={vendor.logo_url} alt={`${vendor.name} logo`} className="w-full h-full object-contain" />
          ) : (
            vendor.name.charAt(0)
          )}
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tight text-blue-950 leading-none mb-1">{vendor.name}</h1>
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
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <a 
          href={mapUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-blue-900 hover:bg-blue-50 hover:text-blue-700 transition-all border border-blue-900/10 shadow-sm"
        >
          <Map className="w-4 h-4" />
        </a>
        <button 
          className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-blue-900 hover:bg-blue-50 hover:text-blue-700 transition-all border border-blue-900/10 shadow-sm"
        >
          <Phone className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
