import React, { useState, useEffect } from 'react';
import { X, Search, MapPin, Star, ArrowUpRight, CheckCircle2, ShieldCheck, Compass, Info, Globe, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAllActiveVendors } from '@/app/actions';

interface PartnerStore {
    id: string;
    name: string;
    category: string;
    rating: number;
    distance: string;
    image: string;
    url: string;
    isActive: boolean;
    specialty: string;
}



interface PartnerDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    currentVendorId?: string;
}

export default function PartnerDrawer({ isOpen, onClose, currentVendorId }: PartnerDrawerProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [vendors, setVendors] = useState<PartnerStore[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        async function loadVendors() {
            setIsLoading(true);
            try {
                const data = await fetchAllActiveVendors();
                const formatted = data.map((v: any) => ({
                    id: v.id,
                    name: v.name,
                    category: v.category || 'Food & Beverage',
                    rating: 4.5 + Math.random() * 0.5,
                    distance: 'Dalam radius kota',
                    image: v.logo_url || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=500&q=80',
                    url: `/${v.id}`,
                    isActive: v.id === currentVendorId,
                    specialty: v.description || 'Tenant Resmi NomadHub'
                }));
                // Sort so current vendor is first
                formatted.sort((a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0));
                setVendors(formatted);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        loadVendors();
    }, [isOpen, currentVendorId]);

    const filteredStores = vendors.filter(store =>
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <div id="partner_drawer_overlay" className="absolute inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-start select-none">
                    {/* Backdrop Tap closer */}
                    <div className="absolute inset-0 z-0 cursor-pointer" onClick={onClose} />

                    {/* Drawer Panel */}
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 26, stiffness: 220 }}
                        className="relative z-15 w-[85%] max-w-[340px] h-full bg-stone-900 border-r border-stone-800 text-white flex flex-col shadow-2xl pl-1"
                    >
                        {/* Top Branding Section on NomadHub */}
                        <div className="p-5.5 border-b border-stone-800 pb-5">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-black tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                                    NOMADHUB PORTAL
                                </span>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:text-white cursor-pointer hover:bg-stone-750 transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <h2 className="text-xl font-black text-white leading-none tracking-tight">
                                Partner Store network
                            </h2>
                            <p className="text-[10px] text-stone-400 font-bold tracking-normal mt-1 flex items-center gap-1">
                                <Globe className="w-3 h-3 text-emerald-500" />
                                <span>Navigasi langsung pada ekosistem nomadhub.biz.id</span>
                            </p>
                        </div>

                        {/* Quick search input */}
                        <div className="px-5.5 py-4">
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari warung, boba, atau martabak..."
                                    className="w-full bg-stone-800 border border-stone-750 hover:border-stone-700 focus:border-amber-500 focus:outline-none py-2.5 pl-9 pr-3 rounded-xl text-xs font-semibold text-white placeholder:text-stone-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Micro warning notice */}
                        <div className="mx-5.5 mb-2 bg-amber-500/5 rounded-xl border border-amber-500/15 p-3 flex gap-2 items-start">
                            <Compass className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div className="text-[9.5px] font-semibold text-amber-100/90 leading-relaxed">
                                Menyediakan akses instan ke unit tenant kami. Klik arah panah untuk berpindah domain web secara otomatis.
                            </div>
                        </div>

                        {/* List scroll container */}
                        <div className="flex-1 overflow-y-auto px-5.5 space-y-4 pb-12 scrollbar-none">
                            <div className="space-y-3.5">

                                {/* --- PROMOTIONAL MERCHANT REGISTRATION BANNER --- */}
                                <div className="bg-gradient-to-br from-amber-500/20 via-amber-600/5 to-transparent rounded-2.5xl border border-amber-500/25 p-4.5 flex flex-col gap-3 shadow-[0_4px_24px_rgba(245,158,11,0.04)] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />

                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8.5 h-8.5 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0 border border-amber-500/10">
                                            <Compass className="w-4.5 h-4.5" />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-black text-amber-300">Punya Usaha Kuliner / Toko?</h3>
                                            <p className="text-[8px] text-stone-400 font-extrabold uppercase tracking-widest">GABUNG NOMADHUB GRATIS</p>
                                        </div>
                                    </div>

                                    <p className="text-[10.5px] text-stone-200 leading-relaxed font-semibold">
                                        Mau tokomu punya aplikasi pemesanan mobile modern yang canggih & responsif seperti Kopi Miskin? Daftarkan usahamu di <span className="text-amber-400">nomadhub.biz.id</span> gratis sekarang!
                                    </p>

                                    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 py-1 text-[9px] text-stone-400 font-bold border-t border-b border-stone-800/40 my-0.5">
                                        <span className="flex items-center gap-1 text-emerald-400">
                                            <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                            Tanpa Coding & Instan
                                        </span>
                                        <span className="flex items-center gap-1 text-emerald-400">
                                            <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                            Fitur Antar & Pickup
                                        </span>
                                        <span className="flex items-center gap-1 text-emerald-400">
                                            <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                            Live Custom Tracking
                                        </span>
                                        <span className="flex items-center gap-1 text-emerald-400">
                                            <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                            Integrasi Google Maps
                                        </span>
                                    </div>

                                    <a
                                        href="https://nomadhub.biz.id"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-[10px] rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/10 active:scale-97 cursor-pointer uppercase tracking-wider"
                                    >
                                        <span>Daftarkan Usahamu Sekarang</span>
                                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[3px]" />
                                    </a>
                                </div>

                                {/* --- PARTNER LIST HEADER TITLE --- */}
                                <div className="pt-2.5 flex items-center justify-between border-t border-stone-850">
                                    <span className="text-[9px] font-black uppercase text-stone-500 tracking-widest block">
                                        Jaringan Tenant NomadHub ({isLoading ? '...' : filteredStores.length})
                                    </span>
                                    <span className="flex h-1.5 w-1.5 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                    </span>
                                </div>

                                {isLoading && (
                                    <div className="flex justify-center items-center py-10">
                                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                                    </div>
                                )}

                                {!isLoading && filteredStores.map((store) => (
                                    <div
                                        key={store.id}
                                        className={`group bg-stone-850 rounded-2xl border p-3.5 flex flex-col gap-3 transition-all ${store.isActive
                                                ? 'border-amber-500 bg-amber-500/5 shadow-[0_4px_16px_rgba(245,158,11,0.08)]'
                                                : 'border-stone-800 hover:border-stone-700 hover:bg-stone-800/60'
                                            }`}
                                    >
                                        <div className="flex gap-3">
                                            {/* Store Thumbnail */}
                                            <div className="w-13 h-13 rounded-xl overflow-hidden bg-stone-800 flex-shrink-0 border border-stone-750 relative">
                                                <img
                                                    src={store.image}
                                                    alt={store.name}
                                                    referrerPolicy="no-referrer"
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                                                />
                                            </div>

                                            {/* Store meta info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1 flex-wrap">
                                                    <h4 className="text-xs font-extrabold text-white truncate max-w-[120px]">
                                                        {store.name}
                                                    </h4>
                                                    {store.isActive && (
                                                        <span className="text-[8px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1 py-0.2 rounded-md uppercase tracking-tight animate-pulse">
                                                            Active Now
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-stone-400 font-bold truncate mt-0.5">{store.category}</p>

                                                {/* Rating and distance info */}
                                                <div className="flex items-center gap-2 mt-1.5 text-[9px] font-semibold text-stone-500">
                                                    <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                                                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                                        {store.rating.toFixed(1)}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-0.5 truncate max-w-[100px]">
                                                        <MapPin className="w-2.5 h-2.5 text-stone-500" />
                                                        {store.distance}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Specialized Menu Recommendation text */}
                                        <div className="bg-black/25 rounded-lg p-2 text-[10px] text-stone-400 font-semibold border border-stone-800/40">
                                            ✨ Rekomendasi: <span className="text-stone-300 italic">"{store.specialty}"</span>
                                        </div>

                                        {/* CTA redirect button directly linking target */}
                                        <a
                                            href={store.url}
                                            className={`w-full py-2 px-3.5 text-[10px] font-bold rounded-xl flex items-center justify-between transition active:scale-98 text-center cursor-pointer ${store.isActive
                                                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/10'
                                                    : 'bg-stone-800 hover:bg-stone-700 border border-stone-750 text-stone-300 hover:text-white'
                                                }`}
                                        >
                                            <span>{store.isActive ? 'Sedang Anda Jelajahi' : 'Kunjungi Website Portal'}</span>
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                ))}

                                {!isLoading && filteredStores.length === 0 && (
                                    <div className="text-center py-6">
                                        <p className="text-xs text-stone-500 font-bold">Toko parnert tidak ditemukan.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Micro Brand Footer */}
                        <div className="p-5.5 border-t border-stone-800 text-center bg-stone-950/20 rounded-b-[38px]">
                            <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Secure NomadHub Ecosystem</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
