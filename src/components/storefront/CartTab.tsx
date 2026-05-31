import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Trash2, ArrowRight, Truck, Sparkles, AlertCircle, QrCode, CreditCard, CheckCircle2, Image as ImageIcon, Loader2, User } from 'lucide-react';
import { toast } from 'sonner';
import { CartItem } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface CartTabProps {
    cart: CartItem[];
    onUpdateQuantity: (id: string, delta: number) => void;
    onRemoveItem: (id: string) => void;
    onCheckout: (
        subtotal: number,
        deliveryFee: number,
        discount: number,
        couponCode: string,
        deliveryMethod: 'Pickup' | 'Delivery',
        customerName: string,
        paymentMethod: 'QRIS' | 'Cash' | 'Transfer',
        paymentStatus: 'Pending' | 'Paid',
        paymentProof?: string,
        tableNumber?: string
    ) => void;
    appliedCoupon: { code: string; discountAmount: number } | null;
    setAppliedCoupon: (coupon: { code: string; discountAmount: number } | null) => void;
    tableNumber: string;
    setTableNumber: (tbl: string) => void;
    customerName: string;
    setCustomerName: (name: string) => void;
}

export default function CartTab({
    cart,
    onUpdateQuantity,
    onRemoveItem,
    onCheckout,
    appliedCoupon,
    setAppliedCoupon,
    tableNumber,
    setTableNumber,
    customerName,
    setCustomerName,
}: CartTabProps) {
    const [deliveryMethod, setDeliveryMethod] = useState<'Pickup' | 'Delivery'>('Delivery');
    const [promoInput, setPromoInput] = useState('');
    const [promoError, setPromoError] = useState('');
    const [nameError, setNameError] = useState('');

    // Custom states for payment options
    const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'Cash' | 'Transfer'>('QRIS');
    const [paymentProof, setPaymentProof] = useState<string>('');
    const [paymentProofName, setPaymentProofName] = useState<string>('');
    const [showQrisModal, setShowQrisModal] = useState(false);
    const [qrisTimer, setQrisTimer] = useState(300); // 5 minutes countdown
    const [isSimulatingSuccess, setIsSimulatingSuccess] = useState(false);

    // QRIS Countdown logic when open
    useEffect(() => {
        if (!showQrisModal) return;

        // reset timer
        setQrisTimer(300);
        const interval = setInterval(() => {
            setQrisTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [showQrisModal]);

    const subtotal = cart.reduce((sum, item) => {
        const sizeSurcharge = item.size === 'Large' ? 5000 : 0;
        return sum + ((parseInt(String(item.price).replace(/[^\d]/g, '')) || 0) + sizeSurcharge) * item.quantity;
    }, 0);

    const deliveryFee = deliveryMethod === 'Delivery' ? 10000 : 0;

    // Custom Promos dictionary
    const PROMO_CODES: { [key: string]: number } = {
        'KMESPRESSOLATTE': 20000,
        'KMDISK25': 25000,
        'KMFREEMATCHA': 22000,
        'KMFREEONGKIR': 10000,
    };

    const handleApplyPromo = () => {
        const code = promoInput.trim().toUpperCase();
        if (!code) return;

        if (PROMO_CODES[code] !== undefined) {
            if (subtotal === 0) {
                setPromoError('Keranjang belanja kosong!');
                return;
            }

            let discountAmount = PROMO_CODES[code];
            // Special logic for FREEONGKIR
            if (code === 'KMFREEONGKIR') {
                discountAmount = Math.min(deliveryFee, 10000);
            }

            // Ensure discount isn't larger than subtotal
            discountAmount = Math.min(discountAmount, subtotal);

            setAppliedCoupon({
                code,
                discountAmount,
            });
            setPromoInput('');
            setPromoError('');
        } else {
            setPromoError('Voucher tidak valid atau sudah kedaluwarsa.');
        }
    };

    const handleRemovePromo = () => {
        setAppliedCoupon(null);
    };

    const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
    const total = Math.max(0, subtotal + deliveryFee - discount);

    // Handle final checkout dispatching
    const handleFinalCheckout = () => {
        if (!customerName.trim()) {
            setNameError('Mohon isi nama Anda agar pesanan tidak tertukar.');
            toast.error("Oops! Jangan lupa isi nama ya", {
                description: "Kami butuh namamu untuk memanggil saat pesanan siap.",
            });
            // Focus the input to let user know where the error is (optional, but good UX)
            document.getElementById('customer_name_input')?.focus();
            return;
        }

        if (paymentMethod === 'QRIS') {
            // Trigger interactive screen instead of direct completion
            setShowQrisModal(true);
        } else {
            // Cash or transfer can proceed directly with pending status
            onCheckout(
                subtotal,
                deliveryFee,
                discount,
                appliedCoupon?.code || '',
                deliveryMethod,
                customerName,
                paymentMethod,
                'Pending', // Transfer or Cash pays later or has proof pending
                paymentProof || undefined,
                tableNumber

            );
        }
    };

    // Triggering simulated payment status paid from dynamic app QRIS
    const handleSimulatePaymentSuccess = () => {
        setIsSimulatingSuccess(true);

        // Simulate interactive processing delay
        setTimeout(() => {
            setIsSimulatingSuccess(false);
            setShowQrisModal(false);

            // Call Checkout with 'Paid' & QRIS parameters
            onCheckout(
                subtotal,
                deliveryFee,
                discount,
                appliedCoupon?.code || '',
                deliveryMethod,
                customerName,
                'QRIS',
                'Paid', // QRIS simulates absolute paid!
                undefined,
                tableNumber
            );
        }, 1800);
    };

    // Format countdown clock nicely MM:SS
    const formatTimer = (secs: number) => {
        const mins = Math.floor(secs / 60);
        const remainder = secs % 60;
        return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
    };

    return (
        <div id="cart_tab_root" className="flex flex-col flex-1 p-6 select-none bg-stone-50 overflow-y-auto max-h-[100%]">
            {/* Tab Header */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-extrabold text-stone-900 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-amber-750" />
                        Keranjang Belanja
                    </h2>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mt-0.5">
                        Pesanan kopi & makanan anda
                    </p>
                </div>
            </div>

            {cart.length === 0 ? (
                /* Empty State */
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-10">
                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mb-4">
                        <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="text-sm font-bold text-stone-750">Keranjang Anda Kosong</h3>
                    <p className="text-xs text-stone-400 max-w-xs mt-1 leading-normal">
                        Jelajahi petulangan kuliner nikmat di tab Home dan pilih menu favorit Anda!
                    </p>
                </div>
            ) : (
                /* Active Cart Items */
                <div className="flex-1 space-y-4 pb-4">
                    <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                        {cart.map((item) => {
                            const itemSizePrice = (parseInt(String(item.price).replace(/[^\d]/g, '')) || 0) + (item.size === 'Large' ? 5000 : 0);
                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-2xl p-3 border border-stone-100 shadow-[0_3px_10px_rgba(0,0,0,0.015)] flex gap-3 relative"
                                >
                                    {/* Thumb image */}
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 border border-stone-50 flex-shrink-0">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            referrerPolicy="no-referrer"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Info details */}
                                    <div className="flex-1 min-w-0 pr-4">
                                        <h4 className="text-[12.5px] font-extrabold text-stone-900 truncate tracking-wide">
                                            {item.title}
                                        </h4>

                                        {/* Size and customized notes */}
                                        <p className="text-[9.5px] text-amber-700 font-bold mt-0.5 flex gap-1.5 items-center">
                                            <span>{item.size} Size</span>
                                            <span className="text-stone-300">•</span>
                                            <span>{item.sugarLevel}</span>
                                        </p>

                                        {item.notes && (
                                            <p className="text-[9px] text-stone-400 leading-none truncate mt-1 italic font-medium bg-stone-50 px-1.5 py-0.5 rounded inline-block">
                                                ✍️ "{item.notes}"
                                            </p>
                                        )}

                                        <span className="text-[11.5px] font-black text-stone-900 block mt-1.5">
                                            Rp {(itemSizePrice * item.quantity).toLocaleString('id-ID')}
                                        </span>
                                    </div>

                                    {/* Quantity & Delete Adjusters */}
                                    <div className="absolute right-3 bottom-3 flex items-center gap-2.5">
                                        <button
                                            onClick={() => onUpdateQuantity(item.id, -1)}
                                            className="w-6 h-6 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-600 hover:bg-stone-200 active:scale-90 cursor-pointer"
                                        >
                                            -
                                        </button>
                                        <span className="text-xs font-bold text-stone-800 w-4 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => onUpdateQuantity(item.id, 1)}
                                            className="w-6 h-6 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-600 hover:bg-stone-200 active:scale-90 cursor-pointer"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Absolute Delete Button on top-right */}
                                    <button
                                        onClick={() => onRemoveItem(item.id)}
                                        className="absolute top-2 right-2 text-stone-300 hover:text-red-500 cursor-pointer p-1 rounded"
                                        title="Hapus"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <hr className="border-stone-100" />

                    {/* Delivery vs Pickup Selector */}
                    <div>
                        <h3 className="text-[9px] font-black uppercase tracking-wider text-stone-400 mb-2">Metode Pengiriman</h3>
                        <div className="grid grid-cols-2 gap-2 bg-stone-100 p-1 rounded-xl">
                            <button
                                onClick={() => setDeliveryMethod('Delivery')}
                                className={`py-2 px-3 rounded-lg text-center font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1 ${deliveryMethod === 'Delivery'
                                    ? 'bg-white text-stone-900 shadow-sm'
                                    : 'text-stone-400 hover:text-stone-600'
                                    }`}
                            >
                                <Truck className="w-3.5 h-3.5" />
                                <span>Antar (Delivery)</span>
                            </button>
                            <button
                                onClick={() => setDeliveryMethod('Pickup')}
                                className={`py-2 px-3 rounded-lg text-center font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1 ${deliveryMethod === 'Pickup'
                                    ? 'bg-white text-stone-900 shadow-sm'
                                    : 'text-[#d97706]'
                                    }`}
                            >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Ambil / Dine-In</span>
                            </button>
                        </div>
                    </div>

                    {/* Table Number Input Block (Diners / QR scans benefit from this) */}
                    <div className="bg-amber-50/50 border border-amber-100 p-3.5 rounded-2xl space-y-1.5">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                                🍽️ Deteksi Nomor Meja
                            </span>
                            <span className="text-[8px] font-extrabold text-amber-600 uppercase">Optional dine-in</span>
                        </div>
                        <input
                            type="text"
                            maxLength={8}
                            placeholder="Contoh: Meja 05, VIP, Bar (Atau kosongkan)"
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            className="w-full bg-white border border-stone-200 focus:border-amber-500 focus:outline-none p-2 rounded-xl text-xs font-bold text-stone-800 uppercase placeholder:normal-case placeholder:font-semibold placeholder:text-stone-450"
                        />
                        {tableNumber && (
                            <p className="text-[8.5px] text-amber-800 font-extrabold leading-none mt-1">
                                📍 Tersambung otomatis ke pesanan Meja {tableNumber.toUpperCase()}!
                            </p>
                        )}
                    </div>

                    {/* Payment Method Option Selector */}
                    <div>
                        <h3 className="text-[9px] font-black uppercase tracking-wider text-stone-400 mb-2">Pilih Cara Pembayaran</h3>
                        <div className="grid grid-cols-3 gap-1.5">
                            {[
                                { id: 'QRIS', label: 'QRIS', desc: 'Auto-Sim' },
                                { id: 'Transfer', label: 'Mandiri / BCA', desc: 'Transfer' },
                                { id: 'Cash', label: 'Cash / COD', desc: 'Ke Kasir' }
                            ].map((method) => (
                                <button
                                    key={method.id}
                                    type="button"
                                    onClick={() => setPaymentMethod(method.id as any)}
                                    className={`border-[1.5px] rounded-xl p-2 flex flex-col items-center justify-center transition cursor-pointer active:scale-95 ${paymentMethod === method.id
                                        ? 'border-amber-600 bg-amber-50/30 text-stone-900 shadow-sm'
                                        : 'border-stone-200/50 bg-white hover:bg-stone-50 text-stone-500'
                                        }`}
                                >
                                    <span className="text-[11px] font-extrabold leading-none">{method.label}</span>
                                    <span className="text-[8px] font-medium text-stone-400 mt-1 leading-none">{method.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Manual Transfer Information Sheet */}
                    {paymentMethod === 'Transfer' && (
                        <div className="bg-stone-100/90 border border-stone-200/70 p-3.5 rounded-2xl space-y-2.5">
                            <div className="text-[9.5px] text-stone-600 font-bold leading-normal">
                                💳 Transfer Bank Mandiri:<br />
                                <span className="font-mono text-xs font-black text-stone-850 select-all block my-0.5">142-0012-3456-78</span>
                                a/n <strong className="text-stone-905">NOMADHUB KOPI MISKIN</strong>
                            </div>

                            <div className="border-t border-stone-200 pt-2.5 space-y-1.5">
                                <span className="text-[8.5px] font-black text-stone-450 uppercase uppercase block">Upload Bukti Transfer</span>
                                {paymentProof ? (
                                    <div className="bg-emerald-50 border border-emerald-100 p-2 text-emerald-800 text-xs rounded-xl flex justify-between items-center">
                                        <span className="font-bold truncate max-w-[180px]">🖼️ {paymentProofName || 'bukti_transfer.png'}</span>
                                        <button
                                            onClick={() => {
                                                setPaymentProof('');
                                                setPaymentProofName('');
                                            }}
                                            className="text-stone-400 hover:text-stone-700 font-extrabold py-0.5 px-2 cursor-pointer"
                                        >
                                            X
                                        </button>
                                    </div>
                                ) : (
                                    <label className="border border-dashed border-stone-300 rounded-xl p-3 py-4 flex flex-col items-center justify-center bg-white cursor-pointer hover:bg-stone-50 transition active:scale-98">
                                        <ImageIcon className="w-5 h-5 text-amber-600 mb-1" />
                                        <span className="text-[10px] font-bold text-stone-700">Pilih Bukti Transfer</span>
                                        <span className="text-[8px] text-stone-400 mt-0.5 font-bold">Resi M-Banking / Stroke ATM</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    setPaymentProof('receipt_mock_user_upload.png');
                                                    setPaymentProofName(e.target.files[0].name);
                                                }
                                            }}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Cash / Cashier Option Description */}
                    {paymentMethod === 'Cash' && (
                        <div className="bg-amber-50/30 border border-amber-100/60 p-3 rounded-2xl flex items-start gap-2 text-[9.5px] text-amber-850 leading-relaxed font-bold">
                            <AlertCircle className="w-4 h-4 text-amber-550 shrink-0 mt-0.5" />
                            <span>
                                Selesaikan pembayaran secara tunai (Cash) dengan langsung menghampiri konter Kasir, atau berikan uang cash ke Kurir (COD) ketika pesanan Anda diantarkan ke tujuan.
                            </span>
                        </div>
                    )}

                    {/* Promo Code Input Bar */}
                    <div>
                        <h3 className="text-[9px] font-black uppercase tracking-wider text-stone-400 mb-2">Voucher Promo</h3>

                        {appliedCoupon ? (
                            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-2.5 px-3 rounded-xl flex justify-between items-center text-xs">
                                <div className="flex items-center gap-1.5">
                                    <Sparkles className="w-4 h-4 text-emerald-600" />
                                    <span>Voucher <strong>{appliedCoupon.code}</strong> Terpasang!</span>
                                </div>
                                <button
                                    onClick={handleRemovePromo}
                                    className="text-stone-450 hover:text-stone-600 p-1 cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={promoInput}
                                        onChange={(e) => setPromoInput(e.target.value)}
                                        placeholder="Masukkan kode kupon..."
                                        className="flex-1 bg-white border border-stone-200 focus:border-amber-650 focus:outline-none rounded-xl px-3 py-2 text-xs font-bold uppercase placeholder:normal-case placeholder:text-stone-400 placeholder:font-semibold"
                                    />
                                    <button
                                        onClick={handleApplyPromo}
                                        className="bg-stone-900 hover:bg-stone-850 text-white text-xs font-bold px-4 rounded-xl cursor-pointer"
                                    >
                                        Pakai
                                    </button>
                                </div>

                                {/* Horizontal slider for quickly choosing/copying a code */}
                                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                                    {[
                                        { code: 'KMDISK25', text: '🎁 Rp 25rb Off' },
                                        { code: 'KMESPRESSOLATTE', text: '☕ Latte Free' },
                                        { code: 'KMFREEMATCHA', text: '🧁 Matcha Free' },
                                        { code: 'KMFREEONGKIR', text: '🛵 Free Ongkir' }
                                    ].map((vc) => (
                                        <button
                                            key={vc.code}
                                            onClick={() => {
                                                setPromoInput(vc.code);
                                                setPromoError('');
                                            }}
                                            className="bg-amber-50/50 hover:bg-amber-100 text-amber-900 border border-amber-100/60 px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer whitespace-nowrap active:scale-95 transition"
                                        >
                                            {vc.text}
                                        </button>
                                    ))}
                                </div>

                                {promoError && (
                                    <div className="text-[9.5px] text-red-500 font-semibold flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        <span>{promoError}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Pricing Breakdown Sheet */}
                    <div className="bg-stone-100/50 rounded-2xl p-4 border border-stone-100 space-y-2.5">
                        <div className="flex justify-between items-center text-xs text-stone-500 font-semibold">
                            <span>Subtotal Item</span>
                            <span className="text-stone-800">Rp {subtotal.toLocaleString('id-ID')}</span>
                        </div>

                        <div className="flex justify-between items-center text-xs text-stone-500 font-semibold">
                            <span>Biaya Pengiriman ({deliveryMethod})</span>
                            <span className="text-stone-800">
                                {deliveryFee === 0 ? 'Gratis' : `Rp ${deliveryFee.toLocaleString('id-ID')}`}
                            </span>
                        </div>

                        {appliedCoupon && (
                            <div className="flex justify-between items-center text-xs text-emerald-700 font-bold">
                                <span>Diskon Kupon</span>
                                <span>-Rp {appliedCoupon.discountAmount.toLocaleString('id-ID')}</span>
                            </div>
                        )}

                        <hr className="border-stone-150 my-1" />

                        <div className="flex justify-between items-center text-sm font-black text-stone-900">
                            <span>Total Pembayaran</span>
                            <span className="text-base text-amber-700 font-black">Rp {total.toLocaleString('id-ID')}</span>
                        </div>
                    </div>

                    {/* Customer Name Input */}
                    <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">Nama Pemesan (Untuk Antrean)</h3>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                            <input
                                id="customer_name_input"
                                type="text"
                                value={customerName}
                                onChange={(e) => {
                                    setCustomerName(e.target.value);
                                    if (nameError) setNameError('');
                                }}
                                placeholder="Masukkan nama Anda..."
                                className={`w-full bg-white border ${nameError ? 'border-red-400 focus:border-red-500 bg-red-50/30' : 'border-stone-200 focus:border-amber-600'} focus:outline-none rounded-xl py-2.5 pl-9 pr-4 text-xs font-bold placeholder:font-semibold placeholder:text-stone-400 transition-all`}
                            />
                        </div>
                        {nameError && (
                            <p className="text-red-500 text-[10px] mt-1.5 flex items-center gap-1 font-semibold">
                                <AlertCircle className="w-3 h-3" />
                                <span>{nameError}</span>
                            </p>
                        )}
                    </div>

                    {/* Checkout CTA */}
                    <button
                        id="cart_action_checkout"
                        onClick={handleFinalCheckout}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs tracking-wide py-3.5 mx-auto rounded-xl transition shadow-md shadow-amber-600/20 active:scale-99 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <span>{paymentMethod === 'QRIS' ? 'Buat QRIS & Konfirmasi' : 'Konfirmasi Masak & Bayar'}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* DYNAMIC QRIS INTERACTIVE GATEWAY OVERLAY SIMULATOR */}
            <AnimatePresence>
                {showQrisModal && (
                    <div className="absolute inset-0 z-50 flex flex-col bg-white overflow-hidden font-sans">
                        <div className="px-5 py-4 border-b border-stone-150 flex items-center justify-between bg-stone-50 shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-xs">
                                    QR
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-stone-905 uppercase leading-none">Gateway Pembayaran QRIS</h4>
                                    <p className="text-[8px] text-stone-400 font-bold uppercase tracking-wider mt-0.5 leading-none">NOMADHUB INTEGRATED PAY</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowQrisModal(false)}
                                className="w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 font-bold flex items-center justify-center cursor-pointer active:scale-90"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 flex flex-col items-center justify-center space-y-6 text-center select-none bg-stone-50/40">
                            {/* QRIS Top Banner logo representation */}
                            <div className="flex flex-col items-center space-y-1">
                                <span className="text-stone-400 font-semibold uppercase tracking-widest text-[8px]">GPN NATIONAL STANDARD ORDER</span>
                                <div className="flex items-center gap-1 bg-[#1d1d1f] text-white p-1 px-4 rounded-lg font-black tracking-tighter text-sm italic border-b-2 border-red-500">
                                    <span className="text-amber-500 font-black">QRIS</span>
                                    <span className="text-stone-300 font-bold text-xs">PAY</span>
                                </div>
                            </div>

                            {/* Transaction billing info */}
                            <div className="space-y-1 bg-white border border-stone-200/65 rounded-2xl p-4 w-full text-center">
                                <span className="text-[9px] text-stone-400 font-black uppercase block tracking-wider leading-none">TOTAL TAGIHAN</span>
                                <h3 className="text-xl font-black text-amber-700 tracking-tight">Rp {total.toLocaleString('id-ID')}</h3>
                                <p className="text-[8.5px] text-stone-400 font-bold leading-relaxed">
                                    Merchant: NOMADHUB - KOPI MISKIN<br />
                                    Order ID: KM-{Math.floor(1000 + Math.random() * 9000)}{tableNumber ? ` | Meja: ${tableNumber.toUpperCase()}` : ''}
                                </p>
                            </div>

                            {/* Dynamic Standard Dynamic QR Code */}
                            <div className="relative p-4 bg-white border border-stone-200/80 shadow-md rounded-2xl flex flex-col items-center justify-center w-52 h-52">
                                {isSimulatingSuccess ? (
                                    <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center gap-2">
                                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                                        <span className="text-[10px] font-black text-amber-700 block animate-pulse">MEMVERIFIKASI TRANSAKSI...</span>
                                    </div>
                                ) : (
                                    <>
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&ecc=H&data=${encodeURIComponent(`qris://nomadhub.biz.id/gateway?amount=${total}`)}`}
                                            alt="Merchant QRIS"
                                            className="w-full h-full object-contain"
                                            referrerPolicy="no-referrer"
                                        />
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border-2 border-stone-900 rounded-md flex items-center justify-center font-black text-[9px] text-stone-900">
                                            KM
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Expiry Countdown Clock */}
                            <div className="flex flex-col items-center space-y-1">
                                <span className="text-[9px] text-stone-400 font-extrabold uppercase leading-none">SELESAIKAN DALAM</span>
                                <div className="px-3 py-1 font-mono text-xs font-black text-amber-700 bg-amber-50 border border-amber-200/50 rounded-lg">
                                    {formatTimer(qrisTimer)}
                                </div>
                            </div>

                            <div className="text-[9.5px] text-stone-450 leading-relaxed font-bold max-w-xs">
                                Silakan scan kode QRIS di atas dengan aplikasi m-Banking (BCA, Mandiri, BRI, dll) atau E-Wallet (GoPay, OVO, Dana, ShopeePay) untuk membayar otomatis.
                            </div>

                            {/* Simulator Action Button */}
                            <button
                                onClick={handleSimulatePaymentSuccess}
                                disabled={isSimulatingSuccess}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10.5px] tracking-wide py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition active:scale-97 shadow-lg shadow-emerald-600/10 cursor-pointer disabled:opacity-50"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>SIMULASIKAN SCAN &amp; BAYAR SUKSES</span>
                            </button>
                        </div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}
