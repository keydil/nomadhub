'use client';

import React from 'react';
import { MapPin, Clock, Phone, Map } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface VendorInfoFooterProps {
  vendor: {
    name: string;
    location?: string;
    status: string;
  };
}

export function VendorInfoFooter({ vendor }: VendorInfoFooterProps) {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(vendor.location || '')}`;

  return (
    <footer className="bg-slate-50 px-6 py-16 border-t border-slate-100">
      <div className="mx-auto max-w-xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
            {vendor.name.charAt(0)}
          </div>
        </div>
        
        <h2 className="mb-2 text-2xl font-black text-slate-900">{vendor.name}</h2>
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
            <Clock className="h-4 w-4" />
            <span className={vendor.status === 'open' ? 'text-emerald-600' : 'text-rose-600'}>
              {vendor.status === 'open' ? 'Open Now' : 'Closed'}
            </span>
          </div>
          <div className="h-1 w-1 rounded-full bg-slate-300" />
          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
            <MapPin className="h-4 w-4" />
            <span>{vendor.location || 'Location unknown'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="block">
            <Button variant="outline" className="w-full h-12 rounded-2xl border-slate-200 bg-white hover:bg-slate-50">
              <Map className="mr-2 h-4 w-4" />
              Open Maps
            </Button>
          </a>
          <Button variant="outline" className="w-full h-12 rounded-2xl border-slate-200 bg-white hover:bg-slate-50">
            <Phone className="mr-2 h-4 w-4" />
            Contact
          </Button>
        </div>

        <p className="mt-12 text-[10px] uppercase tracking-[0.2em] text-slate-300 font-bold">
          Powered by NomadHub Elite
        </p>
      </div>
    </footer>
  );
}
