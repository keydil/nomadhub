import React, { useEffect } from 'react';
import { ClipboardCheck, Clock, CheckCircle, Bike, ShoppingBag, ArrowRight, RotateCcw } from 'lucide-react';
import { OrderState } from '../../types';
import { CartItem } from '../../store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueueStore } from '../../store/useQueueStore';
import confetti from 'canvas-confetti';

interface OrdersTabProps {
    orders: OrderState[];
    onReorder: (items: CartItem[]) => void;
    onClearHistory: () => void;
    onNavigateHome: () => void;
}

export default function OrdersTab({
    orders,
    onNavigateHome,
}: OrdersTabProps) {
    const currentOrder = orders[0];

    // Confetti on completion
    useEffect(() => {
        if (currentOrder && currentOrder.status === 'Selesai') {
            const duration = 2500;
            const end = Date.now() + duration;
            const frame = () => {
                confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors: ['#f59e0b', '#3b82f6', '#10b981'] });
                confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors: ['#f59e0b', '#3b82f6', '#10b981'] });
                if (Date.now() < end) requestAnimationFrame(frame);
            };
            frame();
        }
    }, [currentOrder?.status]);

    const handleDismiss = () => {
        useQueueStore.getState().clearQueue();
    };

    // ─── EMPTY STATE ───
    if (!currentOrder) {
        return (
            <div id="orders_tab_root" className="flex flex-col flex-1 p-5 select-none bg-stone-50">
                <div className="mb-3">
                    <h2 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
                        <ClipboardCheck className="w-5 h-5 text-amber-700" />
                        Pesanan Saya
                    </h2>
                    <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider mt-0.5">
                        Lacak pesanan & menu berjalan anda
                    </p>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-4 shadow-xs border border-amber-100">
                        <ShoppingBag className="w-7 h-7" />
                    </div>
                    <h3 className="text-sm font-bold text-stone-750">Belum Ada Pesanan Aktif</h3>
                    <p className="text-xs text-stone-400 max-w-xs mt-1.5 leading-relaxed">
                        Menu lezat sudah menunggu untuk Anda pesan!
                    </p>
                    <button
                        onClick={onNavigateHome}
                        className="mt-5 py-2.5 px-5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-2xl transition shadow-md shadow-amber-600/15 cursor-pointer flex items-center gap-1.5 active:scale-98"
                    >
                        <span>Pesan Sekarang</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        );
    }

    // ─── ACTIVE ORDER ───
    const steps = ['Menerima', 'Disiapkan', 'Selesai'];
    const currentStepIndex = steps.indexOf(currentOrder.status) !== -1 ? steps.indexOf(currentOrder.status) : 0;
    const isCompleted = currentOrder.status === 'Selesai';
    const isCooking = currentOrder.status === 'Disiapkan';
    const isDelivery = currentOrder.deliveryMethod === 'Delivery';
    const cleanQueueNumber = currentOrder.id.includes('#') ? currentOrder.id.split('#')[1] : currentOrder.id;

    return (
        <div id="orders_tab_root" className="flex flex-col flex-1 p-5 select-none bg-stone-50 overflow-y-auto">
            {/* Header */}
            <div className="mb-3 flex-shrink-0">
                <h2 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-amber-700" />
                    Pesanan Saya
                </h2>
                <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider mt-0.5">
                    Lacak pesanan & menu berjalan anda
                </p>
            </div>

            {/* ─── Compact Queue Number Badge ─── */}
            <div className="flex justify-center mt-2 mb-3 flex-shrink-0">
                <AnimatePresence mode="wait">
                    {!isCompleted ? (
                        <motion.div
                            key={`orb-${currentOrder.status}`}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            className="relative w-24 h-24"
                        >
                            {/* Pulsing rings behind */}
                            <motion.div
                                animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0, 0.3] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className={`absolute inset-0 rounded-full ${isCooking ? 'bg-orange-200' : 'bg-blue-200'}`}
                            />
                            <div className={`absolute inset-0 rounded-full flex items-center justify-center shadow-lg border-[3px] border-white z-10 ${
                                isCooking 
                                    ? 'bg-gradient-to-br from-orange-500 to-red-600' 
                                    : 'bg-gradient-to-br from-blue-900 to-blue-950'
                            }`}>
                                <div className="text-center">
                                    <span className={`block text-[7px] font-black uppercase tracking-widest mb-0.5 ${isCooking ? 'text-orange-100' : 'text-amber-200'}`}>
                                        {isCooking ? 'Diproses' : 'Antrean'}
                                    </span>
                                    <span className="block text-3xl font-black text-white leading-none">#{cleanQueueNumber}</span>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="orb-done"
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative w-24 h-24"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0, 0.2] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute inset-0 rounded-full bg-emerald-200"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg border-[3px] border-white z-10">
                                <CheckCircle className="w-12 h-12 text-white" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ─── Status Text ─── */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-3.5 shadow-2xs border border-stone-200/40 text-center mb-3 flex-shrink-0">
                <div className={`flex items-center justify-center gap-1 mb-1 font-bold text-xs ${
                    isCompleted ? 'text-emerald-600' : isCooking ? 'text-orange-600' : 'text-blue-900'
                }`}>
                    {!isCompleted && <Clock className="w-3.5 h-3.5 animate-pulse" />}
                    <span className="font-black uppercase tracking-wider">
                        {isCompleted ? 'Pesanan Selesai!' : isCooking ? 'Sedang Dimasak!' : 'Sedang Diverifikasi'}
                    </span>
                </div>
                <p className="text-stone-500 font-semibold text-[11px] leading-relaxed">
                    {currentOrder.status === 'Menerima'
                        ? 'Pesanan Anda sedang diverifikasi. Mohon tunggu sebentar ya!'
                        : isCooking
                            ? (isDelivery
                                ? 'Kurir sedang meluncur mengantar pesananmu! 🛵💨'
                                : 'Pesanan kamu sudah matang dan siap diambil di konter! 🥡')
                            : 'Pesananmu sudah diserahkan. Selamat menikmati! 🎉'}
                </p>
            </div>

            {/* ─── PLAYFUL ANIMATION ZONE (The star of the show!) ─── */}
            {isCooking && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full rounded-3xl border border-stone-200/40 relative overflow-hidden mb-3 flex-shrink-0 shadow-2xs"
                    style={{ 
                        height: 120, 
                        background: isDelivery 
                            ? 'linear-gradient(to bottom, #eff6ff, #f0f9ff)' 
                            : 'linear-gradient(to bottom, #fff7ed, #fffbeb)'
                    }}
                >
                    {isDelivery ? (
                        /* ── Delivery: Scooter racing across a road ── */
                        <>
                            {/* Sky clouds */}
                            <motion.div 
                                animate={{ x: [-20, 20, -20] }}
                                transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                                className="absolute top-4 left-8 w-12 h-3 bg-white/70 rounded-full"
                            />
                            <motion.div 
                                animate={{ x: [15, -15, 15] }}
                                transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
                                className="absolute top-7 right-12 w-16 h-4 bg-white/50 rounded-full"
                            />

                            {/* Road surface */}
                            <div className="absolute bottom-0 left-0 right-0 h-10 bg-stone-200/60 rounded-b-3xl" />
                            <div className="absolute bottom-4 left-8 right-8 h-[2px] border-t-2 border-dashed border-stone-300/70" />

                            {/* Scooter riding */}
                            <motion.div
                                animate={{ 
                                    x: [-160, 200],
                                    y: [0, -3, 0, -2, 0]
                                }}
                                transition={{ 
                                    x: { repeat: Infinity, duration: 4, ease: "linear" },
                                    y: { repeat: Infinity, duration: 0.8, ease: "easeInOut" }
                                }}
                                className="absolute bottom-5 flex flex-col items-center z-10"
                            >
                                <Bike className="w-10 h-10 text-blue-600 drop-shadow-sm" />
                                <span className="text-[7px] font-black text-blue-800 bg-white/95 px-2 py-0.5 rounded-full border border-blue-200/80 shadow-xs mt-0.5 whitespace-nowrap tracking-wide">
                                    OTW! 🛵💨
                                </span>
                            </motion.div>

                            {/* Exhaust puffs */}
                            <motion.div
                                animate={{ x: [-180, 180], opacity: [0, 0.6, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                className="absolute bottom-8 text-stone-300 text-lg"
                            >
                                💨
                            </motion.div>
                        </>
                    ) : (
                        /* ── Pickup: Floating bag with sparkles ── */
                        <div className="w-full h-full flex items-center justify-center relative">
                            {/* Floating sparkle particles */}
                            <motion.div
                                animate={{ y: [10, -25], x: [-8, 8], opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                                className="absolute text-orange-400 text-sm"
                                style={{ top: '25%', left: '30%' }}
                            >
                                ✦
                            </motion.div>
                            <motion.div
                                animate={{ y: [5, -30], x: [5, -8], opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 2, delay: 0.8, ease: "easeOut" }}
                                className="absolute text-amber-400 text-base"
                                style={{ top: '30%', right: '30%' }}
                            >
                                ✨
                            </motion.div>
                            <motion.div
                                animate={{ y: [8, -20], opacity: [0, 0.8, 0] }}
                                transition={{ repeat: Infinity, duration: 1.8, delay: 1.2, ease: "easeOut" }}
                                className="absolute text-orange-300 text-xs"
                                style={{ top: '20%', left: '55%' }}
                            >
                                ⭐
                            </motion.div>

                            {/* Floating bag */}
                            <motion.div
                                animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                className="flex flex-col items-center z-10"
                            >
                                <ShoppingBag className="w-12 h-12 text-orange-600 drop-shadow-sm" />
                                <span className="text-[8px] font-black text-orange-850 bg-white/95 px-2.5 py-0.5 rounded-full border border-orange-200/80 shadow-xs mt-1.5 whitespace-nowrap tracking-wide">
                                    SIAP DIAMBIL! 🛍️
                                </span>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            )}

            {/* ─── 3-Step Progress Bar ─── */}
            <div className="flex justify-between items-center px-8 relative my-3 flex-shrink-0">
                <div className="absolute top-3 left-10 right-10 h-[3px] bg-stone-200 rounded-full z-0" />
                <div
                    className="absolute top-3 left-10 h-[3px] bg-amber-500 rounded-full z-0 transition-all duration-700"
                    style={{ width: `${(currentStepIndex / 2) * 78}%` }}
                />
                {steps.map((st, sIdx) => {
                    const isDone = currentStepIndex >= sIdx;
                    const isCurrent = currentStepIndex === sIdx;
                    return (
                        <div key={st} className="flex flex-col items-center relative z-10">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isDone
                                ? 'bg-amber-600 border-amber-600 text-white shadow-xs'
                                : 'bg-white border-stone-200 text-stone-300'
                            }`}>
                                {isDone ? <span className="text-[9px] font-black">✓</span> : <span className="text-[8px] font-black">{sIdx + 1}</span>}
                            </div>
                            <span className={`text-[8px] font-black mt-1.5 ${isCurrent ? 'text-amber-800' : 'text-stone-400'}`}>
                                {st === 'Menerima' ? 'Verif' : st === 'Disiapkan' ? 'Masak' : (isDelivery ? 'Tiba' : 'Ambil')}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* ─── Bottom Details Card ─── */}
            <div className="bg-white rounded-2xl border border-stone-150 p-3.5 shadow-2xs space-y-2 mt-auto flex-shrink-0">
                <div className="flex justify-between items-center text-[11px]">
                    <span className="font-semibold text-stone-400">Pengiriman</span>
                    <span className="font-extrabold text-stone-800 uppercase text-[10px] tracking-wide">
                        {isDelivery ? '🛵 Antar' : '🥡 Ambil'} {currentOrder.tableNumber && `(Meja ${currentOrder.tableNumber.toUpperCase()})`}
                    </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                    <span className="font-semibold text-stone-400">Item</span>
                    <span className="font-bold text-stone-800 truncate max-w-[200px] text-[10px]">
                        {currentOrder.items.map(it => `${it.quantity}x ${it.title}`).join(', ')}
                    </span>
                </div>
                <div className="flex justify-between items-center text-[11px] border-t border-stone-100 pt-2">
                    <span className="font-semibold text-stone-400">Bayar</span>
                    <div className="flex items-center gap-1.5">
                        <span className="font-black text-stone-800 uppercase text-[10px]">{currentOrder.paymentMethod || 'QRIS'}</span>
                        {currentOrder.paymentStatus === 'Paid' ? (
                            <span className="text-[8px] font-black text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/30">Lunas</span>
                        ) : (
                            <span className="text-[8px] font-black text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200/30 animate-pulse">Menunggu</span>
                        )}
                    </div>
                </div>
                <div className="flex justify-between items-center text-xs font-extrabold text-stone-900 border-t border-stone-100 pt-2">
                    <span>Total</span>
                    <span className="font-mono font-black text-amber-700">Rp {currentOrder.total.toLocaleString('id-ID')}</span>
                </div>

                {isCompleted && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pt-1">
                        <button
                            onClick={handleDismiss}
                            className="w-full h-11 rounded-xl bg-amber-600 text-white font-extrabold text-[11px] hover:bg-amber-700 transition-all shadow-md shadow-amber-600/10 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>SELESAI & PESAN LAGI</span>
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
