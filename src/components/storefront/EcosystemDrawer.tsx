'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Compass, MapPin, Store } from 'lucide-react';
import { fetchAllActiveVendors } from '@/app/actions';
import Link from 'next/link';

interface EcosystemDrawerProps {
  currentVendorId: string;
}

export function EcosystemDrawer({ currentVendorId }: EcosystemDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && vendors.length === 0) {
      loadVendors();
    }
    // Prevent scrolling when drawer is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const loadVendors = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllActiveVendors();
      setVendors(data.filter((v: any) => v.id !== currentVendorId));
    } catch (error) {
      console.error("Failed to load ecosystem vendors", error);
    } finally {
      setIsLoading(false);
    }
  };

  const drawerContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] pointer-events-none flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 250 }}
            className="relative w-[300px] sm:w-[340px] h-full bg-slate-50 shadow-2xl flex flex-col pointer-events-auto border-r border-slate-200/50"
          >
            {/* Header */}
            <div className="bg-white px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 rounded-br-[2rem]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
                  <Compass className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-black text-slate-900 text-lg leading-none tracking-tight">NomadHub</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Ecosystem</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Main Navigation */}
            <div className="p-6 pb-2 shrink-0">
              <Link 
                href="/#ecosystem"
                className="flex items-center gap-4 w-full p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-sky-200 hover:shadow-md hover:shadow-sky-100 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-sky-50 flex items-center justify-center text-slate-400 group-hover:text-sky-500 transition-colors">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-slate-900 group-hover:text-sky-700 transition-colors">Discovery Map</h3>
                  <p className="text-xs text-slate-500 font-medium">Temukan toko di peta</p>
                </div>
              </Link>
            </div>

            {/* Vendor List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="flex items-center gap-2 mb-4 px-1">
                <Store className="h-4 w-4 text-slate-400" />
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Toko Lainnya</h3>
              </div>
              
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-sky-500"></div>
                  <p className="text-xs font-bold text-slate-400 animate-pulse">Memuat ekosistem...</p>
                </div>
              ) : vendors.length === 0 ? (
                <div className="text-center py-12 px-4 bg-white rounded-2xl border border-dashed border-slate-200">
                  <Compass className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 font-medium">Belum ada toko lain yang terdaftar aktif.</p>
                </div>
              ) : (
                <div className="space-y-3 pb-12">
                  {vendors.map((vendor) => {
                    const isOpenStatus = !vendor.is_manually_closed;
                    return (
                      <Link 
                        key={vendor.id}
                        href={`/${vendor.id}`}
                        className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-sky-200 hover:shadow-md transition-all group relative overflow-hidden"
                      >
                        {/* Status Line */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${isOpenStatus ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                        
                        {/* Logo */}
                        <div className="w-14 h-14 rounded-[1rem] bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center text-slate-300 font-black text-xl border border-slate-100 ml-1">
                          {vendor.logo_url ? (
                            <img src={vendor.logo_url} alt={vendor.name} className="w-full h-full object-cover" />
                          ) : (
                            vendor.name.substring(0, 1).toUpperCase()
                          )}
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0 py-1">
                          <h4 className="font-bold text-slate-900 truncate group-hover:text-sky-600 transition-colors text-sm mb-1">
                            {vendor.name}
                          </h4>
                          
                          <div className="flex items-center justify-between">
                            {vendor.location ? (
                              <p className="text-[10px] text-slate-500 truncate max-w-[100px] font-medium">
                                {vendor.location}
                              </p>
                            ) : (
                              <p className="text-[10px] text-slate-400 italic">Lokasi belum diatur</p>
                            )}
                            
                            {/* Status Badge */}
                            <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${isOpenStatus ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                              {isOpenStatus ? 'Buka' : 'Tutup'}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-blue-900 hover:bg-blue-50 hover:text-blue-700 transition-all border border-blue-900/10 shadow-sm mr-3 shrink-0"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mounted && createPortal(drawerContent, document.body)}
    </>
  );
}
