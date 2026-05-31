import React, { useState } from 'react';
import { MapPin, Phone, Compass, ClipboardCheck, X, Check, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PartnerDrawer from './PartnerDrawer';

interface HeaderProps {
    vendor: {
        id: string;
        name: string;
        location?: string;
        is_manually_closed: boolean;
        logo_url?: string;
    };
    onOpenStoreInfo?: () => void;
}

export default function Header({ vendor, onOpenStoreInfo }: HeaderProps) {
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [showPartnerDrawer, setShowPartnerDrawer] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopyAddress = () => {
        if (vendor.location) {
            navigator.clipboard.writeText(vendor.location);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <>
            <div
                id="app_header"
                className="px-6 py-4 flex justify-between items-center bg-white border-b border-stone-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
            >
                <div className="flex items-center gap-3">
                    {/* Hamburger Menu Icon */}
                    <button
                        id="header_hamburger"
                        onClick={() => setShowPartnerDrawer(true)}
                        className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 active:scale-95 transition-all shadow-sm cursor-pointer"
                        title="Discover Partner Stores"
                    >
                        <Menu className="w-5 h-5 text-stone-700 hover:text-amber-750" />
                    </button>

                    <div className="flex items-center gap-2.5">
                        <img 
                            src={vendor.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(vendor.name)}&background=292524&color=fff&size=150`} 
                            alt={vendor.name} 
                            className="w-9 h-9 rounded-full object-cover shadow-xs border border-stone-150"
                            referrerPolicy="no-referrer"
                        />
                        <div>
                            <h1 id="brand_title" className="text-xl font-black font-sans tracking-tight text-stone-900 leading-none">
                                {vendor.name}
                            </h1>
                            <div className="flex items-center gap-1 mt-1 text-[9px] font-bold uppercase tracking-wider text-stone-500">
                                <span className="inline-flex items-center gap-0.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${!vendor.is_manually_closed ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                                    <span className={!vendor.is_manually_closed ? 'text-emerald-700' : 'text-red-700'}>
                                        {!vendor.is_manually_closed ? 'SERVING' : 'CLOSED'}
                                    </span>
                                </span>
                                {vendor.location && (
                                    <>
                                        <span className="text-stone-300">•</span>
                                        <span className="inline-flex items-center gap-0.5 text-stone-400">
                                            <MapPin className="w-3 h-3" />
                                            <span className="truncate max-w-[80px]">{vendor.location}</span>
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons (Compass & Phone match image) */}
                <div className="flex items-center gap-2">
                    <button
                        id="header_btn_map"
                        onClick={() => setShowLocationModal(true)}
                        className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 active:scale-95 transition-all shadow-sm"
                    >
                        <Compass className="w-4.5 h-4.5 text-stone-600" />
                    </button>
                    <button
                        id="header_btn_phone"
                        onClick={() => setShowContactModal(true)}
                        className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-50 active:scale-95 transition-all shadow-sm"
                    >
                        <Phone className="w-4.5 h-4.5 text-stone-600" />
                    </button>
                </div>
            </div>

            {/* Partner Discovery Sidebar Drawer */}
            <PartnerDrawer isOpen={showPartnerDrawer} onClose={() => setShowPartnerDrawer(false)} currentVendorId={vendor.id} />

            {/* LOCATION & DIRECTIONS MODAL */}
            <AnimatePresence>
                {showLocationModal && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-end justify-center z-50">
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 220 }}
                            className="w-full bg-white rounded-t-[32px] p-6 shadow-2xl relative select-none max-w-[400px] pb-10"
                        >
                            <div className="w-12 h-1 bg-stone-300 rounded-full mx-auto mb-4" />

                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-stone-900">Lokasi {vendor.name}</h3>
                                <button
                                    onClick={() => setShowLocationModal(false)}
                                    className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Fake Micro Map Layout */}
                            <div className="w-full h-36 bg-emerald-50 rounded-2xl relative mb-4 border border-emerald-100 flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#0fa3b1_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
                                {/* Simulated Street Lines */}
                                <div className="absolute w-[2px] h-full bg-stone-200 left-1/3" />
                                <div className="absolute w-[2px] h-full bg-stone-200 left-2/3" />
                                <div className="absolute h-[2px] w-full bg-stone-200 top-1/2" />

                                {/* Floating Map Pin indicator */}
                                <div className="absolute top-[48%] left-[42%] flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white shadow-lg animate-bounce">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div className="text-[9px] font-bold bg-white text-stone-800 px-1.5 py-0.5 rounded shadow-xs mt-1 border border-stone-100">
                                        {vendor.name}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3.5 mb-6">
                                <div>
                                    <h4 className="text-xs text-stone-400 font-bold tracking-wider uppercase">Alamat Lengkap</h4>
                                    <p className="text-sm font-medium text-stone-700 mt-0.5">
                                        {vendor.location || 'Lokasi belum diatur oleh vendor.'}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center bg-stone-50 p-3 rounded-xl border border-stone-100">
                                    <div className="text-xs text-stone-500 font-medium">🛵 Jarak dari Anda: <strong className="text-stone-800">1.2 km</strong></div>
                                    <button
                                        onClick={handleCopyAddress}
                                        className="text-xs font-semibold text-amber-700 flex items-center gap-1 hover:underline cursor-pointer"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                <span className="text-emerald-700 font-bold">Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <ClipboardCheck className="w-3.5 h-3.5" />
                                                <span>Copy Alamat</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowLocationModal(false)}
                                className="w-full py-3 bg-stone-900 text-white font-semibold rounded-xl text-sm transition tracking-wide hover:bg-stone-800 active:scale-99"
                            >
                                Tutup Info
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* CONTACT/PHONE DETAILS MODAL */}
            <AnimatePresence>
                {showContactModal && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-end justify-center z-50">
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 220 }}
                            className="w-full bg-white rounded-t-[32px] p-6 shadow-2xl relative select-none max-w-[400px] pb-10"
                        >
                            <div className="w-12 h-1 bg-stone-300 rounded-full mx-auto mb-4" />

                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-stone-900">Hubungi Kami</h3>
                                <button
                                    onClick={() => setShowContactModal(false)}
                                    className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="text-center py-6">
                                <div className="w-14 h-14 bg-amber-50 rounded-full mx-auto flex items-center justify-center text-amber-700 mb-4 animate-pulse">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <h4 className="text-lg font-bold text-stone-800">Hubungi Kasir</h4>
                                <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                                    Hubungi staf {vendor.name} untuk pertanyaan pemesanan mendesak atau reservasi.
                                </p>
                            </div>

                            <div className="flex gap-3 mb-4">
                                <a
                                    href="tel:+6281234567890"
                                    className="flex-1 py-3 text-center bg-emerald-600 text-white font-semibold rounded-xl text-sm transition hover:bg-emerald-500 active:scale-99"
                                >
                                    Telepon Langsung
                                </a>
                                <button
                                    onClick={() => setShowContactModal(false)}
                                    className="flex-1 py-3 bg-stone-100 text-stone-700 font-semibold rounded-xl text-sm transition hover:bg-stone-200 active:scale-99"
                                >
                                    Tutup Bantuan
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
