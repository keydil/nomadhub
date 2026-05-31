import React, { useState, useEffect } from 'react';
import { Search, Star, Plus, Minus, MapPin, Compass, Phone, Sparkles, ShoppingCart, Check, Zap, X } from 'lucide-react';
import Header from './Header';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem } from '@/store/useCartStore';

interface HomeTabProps {
    vendor: any;
    menuItems: any[];
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    cart: CartItem[];
    onAddToCart: (newItem: Omit<CartItem, 'quantity'>) => void;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemoveItem: (id: string) => void;
    onUpdateNotes: (id: string, notes: string) => void;
    onNavigateCart: () => void;
}

// Fallback promos in case AI fails or is loading
const FALLBACK_PROMOS = [
    {
        itemId: "", 
        badge: "AIS REKOMENDASI PAGI",
        subBadge: "🌤️ CERAH WARM",
        badgeColor: "bg-amber-600",
        titlePrefix: "Booster Pagi",
        desc: "Perpaduan energi untuk menemani sesi produktivitas pagi Anda.",
        discountMultiplier: 0.85
    },
    {
        itemId: "",
        badge: "AI WEATHER SYNERGY",
        subBadge: "⛈️ WEATHER SHIELD",
        badgeColor: "bg-blue-600",
        titlePrefix: "Anget Maksimal",
        desc: "Kombinasi sempurna yang berfungsi optimal mengusir hawa dingin di luar.",
        discountMultiplier: 0.88
    },
    {
        itemId: "",
        badge: "NOMADHUB PERSONA",
        subBadge: "💻 FOCUS INTENSE",
        badgeColor: "bg-teal-600",
        titlePrefix: "Persona Calmer",
        desc: "Ditargetkan untuk Anda yang kejar target. Kombinasi penenang kadar stres.",
        discountMultiplier: 0.80
    }
];

export default function HomeTab({
    vendor,
    menuItems,
    selectedCategory,
    setSelectedCategory,
    cart,
    onAddToCart,
    onUpdateQuantity,
    onRemoveItem,
    onUpdateNotes,
    onNavigateCart,
}: HomeTabProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [modalQuantity, setModalQuantity] = useState(1);
    const [modalNotes, setModalNotes] = useState('');
    const [isModalAdded, setIsModalAdded] = useState(false);

    useEffect(() => {
        if (selectedProduct) {
            setModalQuantity(1);
            setModalNotes('');
            setIsModalAdded(false);
        }
    }, [selectedProduct]);
    const [aiPromos, setAiPromos] = useState<any[]>(FALLBACK_PROMOS);
    const [isAiLoading, setIsAiLoading] = useState(true);
    const [recIndex, setRecIndex] = useState(0);

    // Fetch dynamic AI recommendations on mount
    useEffect(() => {
        const fetchAiPromos = async () => {
            try {
                // Get local time of day
                const hour = new Date().getHours();
                let timeOfDay = 'Pagi';
                if (hour >= 11 && hour < 15) timeOfDay = 'Siang';
                else if (hour >= 15 && hour < 18) timeOfDay = 'Sore';
                else if (hour >= 18 || hour < 4) timeOfDay = 'Malam';
                
                // Simple weather mockup (for real production, integrate openweathermap)
                const isRaining = Math.random() > 0.5;
                const weather = isRaining ? 'Hujan' : 'Cerah';

                const response = await fetch('/api/ai/recommendation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        menuItems: menuItems.filter(i => i.isTopPick).length > 0 ? menuItems.filter(i => i.isTopPick) : menuItems, 
                        timeOfDay,
                        weather
                    })
                });
                
                const data = await response.json();
                if (data.recommendations && data.recommendations.length > 0) {
                    setAiPromos(data.recommendations);
                }
            } catch (error) {
                console.error("Failed to fetch AI promos", error);
            } finally {
                setIsAiLoading(false);
            }
        };

        if (menuItems.length > 0) {
            fetchAiPromos();
        } else {
            setIsAiLoading(false);
        }
    }, [menuItems]);

    // Fallback recommendation logic if AI doesn't pick an item explicitly
    const fallbackItems = menuItems.filter(item => item.isTopPick).length > 0
        ? menuItems.filter(item => item.isTopPick)
        : menuItems.slice(0, 3);

    const currentAiPromo = aiPromos[recIndex % aiPromos.length];
    
    // Find the actual menu item that Gemini selected, or fallback to standard top picks
    const currentRec = currentAiPromo?.itemId 
        ? menuItems.find(item => item.id === currentAiPromo.itemId) || fallbackItems[recIndex % fallbackItems.length]
        : fallbackItems[recIndex % fallbackItems.length];

    // Filter items based on category + search
    const filteredItems = menuItems.filter((item) => {
        const matchesCategory =
            selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch =
            (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const uniqueCategories = Array.from(new Set(menuItems.map(item => item.category || 'Lainnya')));
    const categories = ['All', ...uniqueCategories];
    
    // Auto-rotate recommendations every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setRecIndex((prev) => (prev + 1) % aiPromos.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [aiPromos.length]);

    // Calculate AI Promo Pricing
    const getAiPromoPrice = (originalPriceStr: string, multiplier: number) => {
        const priceNum = parseInt(originalPriceStr?.toString().replace(/[^\d]/g, '')) || 0;
        const discounted = Math.round(priceNum * multiplier);
        return {
            original: priceNum,
            discounted: discounted
        };
    };

    const currentPrices = currentRec && currentAiPromo ? getAiPromoPrice(currentRec.price, currentAiPromo.discountMultiplier || 0.8) : { original: 0, discounted: 0 };

    // Cart matching helpers for inline selector
    const getCartItemForMenuItem = (itemId: string) => {
        return cart.find((item) => item.id === itemId) || null;
    };

    const handleInstantAdd = (item: any, isAiPromo = false, discountPrice?: number, promoTitle?: string) => {
        const existing = getCartItemForMenuItem(item.id);
        if (existing) {
            onUpdateQuantity(existing.id, existing.quantity + 1);
        } else {
            onAddToCart({
                id: item.id,
                title: item.title,
                price: isAiPromo && discountPrice ? `Rp ${discountPrice}` : item.price,
                imageUrl: item.imageUrl,
                vendorId: vendor.id,
                notes: isAiPromo && promoTitle ? `[Promo: ${promoTitle}] ` : ''
            });
        }
    };

    const handleInstantDecrease = (item: any) => {
        const existing = getCartItemForMenuItem(item.id);
        if (existing) {
            if (existing.quantity > 1) {
                onUpdateQuantity(existing.id, existing.quantity - 1);
            } else {
                onRemoveItem(existing.id);
            }
        }
    };

    const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalCartPrice = cart.reduce((sum, item) => {
        const priceNum = parseInt(item.price?.toString().replace(/[^\d]/g, '')) || 0;
        return sum + (priceNum * item.quantity);
    }, 0);

    return (
        <div id="home_tab_root" className="flex flex-col flex-1 select-none pb-24 relative">
            {/* 1. Header with Status & Helper Buttons */}
            <Header vendor={vendor} />

            {/* 2. Welcome & Micro Search Bar */}
            <div className="px-6 pt-5 pb-3">
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#d97706]/70 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            Selamat Datang
                        </span>
                        <h2 className="text-xl font-extrabold text-stone-900 mt-0.5 leading-tight">
                            {vendor?.description || 'Pesan sekarang, nikmati sepuasnya!'}
                        </h2>
                    </div>
                </div>

                {/* Search menu */}
                <div className="relative mt-4.5">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari makanan manis atau kopi favoritmu..."
                        className="w-full bg-stone-100/90 border border-transparent hover:border-stone-200 focus:bg-white focus:border-amber-600 focus:ring-1 focus:ring-amber-600/20 py-3 pl-11 pr-4 rounded-xl text-xs font-semibold placeholder:text-stone-400 focus:outline-none transition-all"
                    />
                </div>
            </div>

            {/* 3. "AI Recommendation" Carousel */}
            <div id="recommendation_section" className="px-6 py-4 select-none">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-extrabold text-sm uppercase tracking-wider text-stone-400">
                        Recommendation
                    </h3>
                    <span className="text-[10px] text-amber-600 font-extrabold tracking-tight flex items-center gap-1">
                        {isAiLoading ? (
                            <motion.span 
                                animate={{ opacity: [1, 0.5, 1] }} 
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="w-1.5 h-1.5 rounded-full bg-amber-500"
                            />
                        ) : (
                            <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500 animate-spin" />
                        )}
                        AI REALTIME CAMPAIGN
                    </span>
                </div>

                {/* Carousel Card Container */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        {isAiLoading ? (
                            <motion.div
                                key="loading-skeleton"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="relative rounded-[28px] overflow-hidden min-h-[250px] shadow-xl bg-stone-900 border border-stone-800 animate-pulse"
                            >
                                <div className="absolute top-4 left-4 h-4 w-32 bg-stone-700/50 rounded-full" />
                                <div className="absolute bottom-16 left-5 h-6 w-48 bg-stone-700/50 rounded-md" />
                                <div className="absolute bottom-10 left-5 h-3 w-64 bg-stone-700/50 rounded-md" />
                                <div className="absolute bottom-4 left-5 h-4 w-24 bg-stone-700/50 rounded-md" />
                                <div className="absolute bottom-4 right-5 h-8 w-24 bg-stone-700/50 rounded-full" />
                            </motion.div>
                        ) : currentRec && currentAiPromo ? (
                            <motion.div
                                key={currentRec.id + currentAiPromo.titlePrefix}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => {
                                    setSelectedProduct({
                                        ...currentRec,
                                        price: currentPrices.discounted,
                                        title: `${currentAiPromo.titlePrefix}: ${currentRec.title}`
                                    });
                                }}
                                className={`relative rounded-[28px] overflow-hidden min-h-[250px] shadow-xl group border cursor-pointer transition-all ${getCartItemForMenuItem(currentRec.id)
                                        ? 'border-amber-400 bg-stone-950 ring-2 ring-amber-500/10'
                                        : 'bg-stone-950 border-stone-850'
                                    }`}
                            >
                                {/* Foto Kuliner Beresolusi Tinggi dengan Efek Hover Zoom */}
                                <div className="absolute inset-0">
                                    <img
                                        src={currentRec.imageUrl}
                                        alt={currentRec.title}
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover opacity-50 brightness-75 group-hover:scale-105 transition-all duration-700"
                                    />
                                    {/* Overlay gelap gradasi agar teks berwarna putih di atasnya tetap terbaca jelas (UX Kritis) */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                                </div>

                                {/* Tombol badge dinamis di ujung atas */}
                                <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className={`text-[8.5px] font-black text-white ${currentAiPromo.badgeColor || 'bg-amber-600'} px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm`}>
                                            {currentAiPromo.badge}
                                        </span>
                                        <span className="text-[8px] font-black text-white bg-stone-900/80 backdrop-blur-md px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm border border-stone-700/50">
                                            {currentAiPromo.subBadge || 'AI RECOMENDED'}
                                        </span>
                                    </div>
                                    
                                    {/* Muncul Checkmark hijau/oren jika item yang dipromosikan sudah ada di keranjang belanja */}
                                    {getCartItemForMenuItem(currentRec.id) && (
                                        <span className="text-[8.5px] font-black text-stone-950 bg-amber-400 px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1 animate-pulse">
                                            <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                                            <span>DIPILIH</span>
                                        </span>
                                    )}
                                </div>

                                {/* Informasi Detail Kampanye di Bawah Banner */}
                                <div className="absolute bottom-5 left-5 right-5 flex flex-col justify-end items-start">
                                    <h4 className="text-[14.5px] font-black text-white leading-tight drop-shadow-md text-wrap line-clamp-2">
                                        {currentAiPromo.titlePrefix}: {currentRec.title}
                                    </h4>

                                    <p className="text-[9.5px] text-zinc-300 font-medium leading-relaxed mt-1 line-clamp-2 drop-shadow-xs">
                                        {currentAiPromo.desc}
                                    </p>

                                    <div className="flex justify-between items-end w-full mt-3">
                                        {/* Visual Harga Coret & Harga Istimewa AI Promo */}
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[12.5px] font-extrabold text-amber-400 tracking-tight">
                                                    Rp {currentPrices.discounted.toLocaleString('id-ID')}
                                                </span>
                                                <span className="text-[10px] text-zinc-400 line-through font-semibold">
                                                    Rp {currentPrices.original.toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                            <span className="text-zinc-400 text-[9px] font-semibold block leading-none mt-0.5">
                                                Harga Spesial AI Promo
                                            </span>
                                        </div>

                                        {/* Tombol Interaksi Cerdas */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedProduct({
                                                    ...currentRec,
                                                    price: currentPrices.discounted,
                                                    title: `${currentAiPromo.titlePrefix}: ${currentRec.title}`
                                                });
                                            }}
                                            className={`text-[10.5px] font-black px-4 py-2 rounded-full transition shadow-md active:scale-95 cursor-pointer flex items-center gap-1 ${getCartItemForMenuItem(currentRec.id)
                                                    ? 'bg-amber-400 hover:bg-amber-300 text-stone-950'
                                                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                                                }`}
                                        >
                                            {getCartItemForMenuItem(currentRec.id) ? 'Ubah Pesanan' : 'Ambil Promo'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>

                    {/* Carousel Dots Indicator di Bagian Bawah */}
                    {!isAiLoading && aiPromos.length > 0 && (
                        <div className="flex justify-center items-center gap-1.5 mt-3.5">
                            {aiPromos.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setRecIndex(index)}
                                    className={`transition-all duration-300 rounded-full cursor-pointer ${recIndex === index ? 'w-4 h-1.5 bg-amber-600' : 'w-1.5 h-1.5 bg-stone-300 hover:bg-stone-400'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 4. "Explore Menu" and Category Tabs (Exact visual match) */}
            <div id="explore_menu_section" className="py-4 select-none mt-2">
                <h3 className="px-6 font-extrabold text-sm uppercase tracking-wider text-stone-400 mb-3.5">
                    Explore Menu
                </h3>

                {/* Styled Category pills */}
                <div className="flex gap-2 items-center overflow-x-auto px-6 whitespace-nowrap scrollbar-none pb-2.5">
                    {categories.map((cat) => {
                        const isSelected = selectedCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`py-2 px-4.5 rounded-full text-xs font-bold transition-all cursor-pointer ${isSelected
                                        ? 'bg-stone-900 text-white shadow-md shadow-stone-900/10'
                                        : 'bg-white text-stone-400 border border-stone-100 hover:text-stone-600 hover:bg-stone-50'
                                    }`}
                            >
                                {cat === 'Makanan Utama' ? 'Makanan Utama' : cat}
                            </button>
                        );
                    })}
                </div>

                {/* 5. Food Grid (Matcha Cupcake, Cheesecake, Gourmet Brownie listed below) */}
                <div className="px-6 grid grid-cols-2 gap-4 mt-3">
                    {filteredItems.map((item) => {
                        const cartItem = getCartItemForMenuItem(item.id);
                        const isSelected = !!cartItem;

                        return (
                            <motion.div
                                layout
                                key={item.id}
                                onClick={() => setSelectedProduct(item)}
                                className={`rounded-[24px] p-3 border transition-all duration-300 cursor-pointer group flex flex-col justify-between ${isSelected
                                        ? 'bg-amber-50/20 border-amber-400 shadow-[0_8px_20px_rgba(245,158,11,0.06)]'
                                        : 'bg-white border-stone-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-stone-200'
                                    }`}
                            >
                                <div>
                                    {/* Image Thumb */}
                                    <div className="w-full h-28 rounded-[18px] overflow-hidden bg-stone-50 border border-stone-100/50 relative">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            referrerPolicy="no-referrer"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                                        />
                                        {item.rating && (
                                            <span className="absolute top-2 right-2 text-[9.5px] font-extrabold text-stone-850 bg-white/95 backdrop-blur-md px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-xs">
                                                <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                                                {item.rating}
                                            </span>
                                        )}

                                        {/* Selected Checkmark Badge overlay */}
                                        {isSelected && (
                                            <span className="absolute top-2 left-2 text-[8px] font-black text-white bg-amber-600 px-2 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm">
                                                <Check className="w-2.5 h-2.5 stroke-[3px]" />
                                                <span>TERPILIH</span>
                                            </span>
                                        )}
                                    </div>

                                    {/* Info Text */}
                                    <div className="mt-3 px-1">
                                        <h4 className="text-[12.5px] font-black text-stone-900 group-hover:text-amber-800 transition line-clamp-1 leading-snug">
                                            {item.title}
                                        </h4>
                                        {/* Consistent and premium price placement below name */}
                                        <span className="text-[12px] font-extrabold text-amber-700 block mt-0.5">
                                            Rp {Number(String(item.price).replace(/\D/g, '')).toLocaleString('id-ID')}
                                        </span>
                                        <p className="text-[9px] text-stone-400 leading-relaxed line-clamp-2 mt-1">
                                            {(() => {
                                                try { return JSON.parse(item.description).description || item.description }
                                                catch { return item.description }
                                            })()}
                                        </p>
                                    </div>
                                </div>
                                {/* Direct Notes Input Field */}
                                {isSelected && (
                                    <div className="mt-2.5 px-0.5" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="text"
                                            value={cartItem.notes || ''}
                                            onChange={(e) => onUpdateNotes(item.id, e.target.value)}
                                            placeholder="Catatan tambahan..."
                                            className="w-full bg-white border border-stone-200/80 focus:border-amber-500 focus:outline-none py-1 px-2 rounded-lg text-[9px] font-medium text-stone-700 placeholder:text-stone-400 transition"
                                        />
                                    </div>
                                )}

                                {/* Action Row / Control pill at the bottom */}
                                <div className="mt-3 px-0.5 flex items-center justify-end">
                                    {isSelected ? (
                                        /* Beautiful, full-width quantity selector capsule with amber theme matching */
                                        <div
                                            className="w-full bg-amber-150/50 border border-amber-200 rounded-full py-1 px-1.5 flex items-center justify-between transition-all"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                onClick={() => handleInstantDecrease(item)}
                                                className="w-6.5 h-6.5 rounded-full bg-white hover:bg-amber-200 text-stone-850 flex items-center justify-center transition active:scale-90 shadow-sm border border-amber-100 cursor-pointer"
                                                title="Batal / Kurangi"
                                            >
                                                <Minus className="w-3 h-3 stroke-[3px]" />
                                            </button>
                                            <span className="text-[11px] font-black text-amber-950 font-mono">
                                                {cartItem.quantity}x
                                            </span>
                                            <button
                                                onClick={() => handleInstantAdd(item)}
                                                className="w-6.5 h-6.5 rounded-full bg-amber-500 hover:bg-amber-600 text-stone-950 flex items-center justify-center transition active:scale-90 shadow-sm cursor-pointer"
                                                title="Tambah porsi"
                                            >
                                                <Plus className="w-3 h-3 stroke-[3.5]" />
                                            </button>
                                        </div>
                                    ) : (
                                        /* Clean right-aligned original plus badge */
                                        <div className="w-full flex justify-end">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleInstantAdd(item);
                                                }}
                                                className="w-8 h-8 rounded-full bg-stone-50 border border-stone-200/60 hover:bg-amber-600 hover:text-white hover:border-amber-600 text-stone-600 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90"
                                            >
                                                <Plus className="w-4 h-4" strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}

                    {filteredItems.length === 0 && (
                        <div className="col-span-2 text-center py-10">
                            <p className="text-xs text-stone-400 font-medium">Tidak ada item yang ditemukan.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- PREMIUM FLOATING SUMMARY CART BAR ABOVE PHONE NAVIGATION --- */}
            <AnimatePresence>
                {totalCartCount > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 70, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 70, scale: 0.95 }}
                        className="fixed bottom-[84px] left-[5%] right-[5%] w-[90%] bg-stone-900 border border-stone-800 text-white p-3.5 rounded-2.5xl flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.15)] z-40"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center relative">
                                <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
                                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-stone-900">
                                    {totalCartCount}
                                </span>
                            </div>
                            <div className="text-left">
                                <h4 className="text-[11.5px] font-black text-white leading-none">
                                    {totalCartCount} Item Terpilih
                                </h4>
                                <p className="text-[10px] text-amber-400 font-bold mt-1">
                                    Total: Rp {totalCartPrice.toLocaleString('id-ID')}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onNavigateCart}
                            className="bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 py-2.5 px-5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                        >
                            <span>Lihat Detail</span>
                            <Check className="w-3.5 h-3.5 stroke-[3px]" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            
            {/* Product Detail Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-end justify-center z-[60]">
                        {/* Lapisan hitam penutup belakang untuk klik keluar */}
                        <div className="absolute inset-0" onClick={() => setSelectedProduct(null)} />

                        <motion.div 
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 220 }}
                            className="w-full bg-white rounded-t-[32px] overflow-hidden shadow-2xl relative z-10 max-w-[500px] flex flex-col max-h-[92vh]"
                        >
                            {/* Garis Notch Atas Layaknya Bottom Sheet */}
                            <div className="w-12 h-1 bg-stone-300 rounded-full mx-auto my-3 flex-shrink-0" />
                            
                            {/* Kontainer Utama yang Bisa Digulir (Scrollable) */}
                            <div className="flex-1 overflow-y-auto px-6 pb-6 select-none">
                                {/* Header Dialog & Tombol Tutup */}
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs font-bold uppercase tracking-wide bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full">
                                        {selectedProduct.category === 'All' ? 'Menu' : selectedProduct.category}
                                    </span>
                                    <button 
                                        onClick={() => setSelectedProduct(null)}
                                        className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Gambar Utama Hidangan / Kopi */}
                                <div className="w-full h-44 rounded-2xl overflow-hidden relative mb-4 border border-stone-100">
                                    <img 
                                        src={selectedProduct.imageUrl || 'https://placehold.co/600x400/e2e8f0/94a3b8?text=Menu'} 
                                        alt={selectedProduct.title} 
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover"
                                    />
                                    {selectedProduct.isTopPick && (
                                        <span className="absolute top-3 left-3 text-[10px] font-extrabold text-white bg-red-600 px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                                            Top Pick
                                        </span>
                                    )}
                                </div>

                                {/* Nama Produk & Deskripsi Singkat */}
                                <div className="mb-4">
                                    <h2 className="text-xl font-bold text-stone-900 leading-snug">{selectedProduct.title}</h2>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className="text-lg font-extrabold text-amber-700">
                                            Rp {Number(String(selectedProduct.price).replace(/\D/g, '')).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <p className="text-xs text-stone-500 leading-normal mt-2">
                                        {(() => {
                                            try { return JSON.parse(selectedProduct.description).description || selectedProduct.description }
                                            catch { return selectedProduct.description }
                                        })()}
                                    </p>
                                </div>

                                <hr className="border-stone-100 mb-4" />

                                {/* Tags */}
                                {(() => {
                                    let tags = [];
                                    try {
                                        const parsed = JSON.parse(selectedProduct.description);
                                        if (parsed.hashtags) tags = parsed.hashtags;
                                    } catch {}
                                    if (tags.length > 0) {
                                        return (
                                            <div className="mb-5">
                                                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Tags & Kategori</h3>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {tags.map((tag: string, i: number) => (
                                                        <span key={i} className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}

                                {/* Catatan Pesanan (Textarea Fleksibel) */}
                                <div className="mb-5">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Catatan Pesanan</h3>
                                    <textarea
                                        value={modalNotes}
                                        onChange={(e) => setModalNotes(e.target.value)}
                                        placeholder="Contoh: Tolong pisah kuah, jangan pakai bawang, dll."
                                        maxLength={100}
                                        className="w-full p-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 resize-none h-16 transition"
                                    />
                                </div>

                                {/* Pengatur Jumlah Pesanan (Quantity Counter) */}
                                <div className="flex items-center justify-between bg-stone-50 p-3.5 rounded-xl border border-stone-100 mb-2">
                                    <span className="text-xs font-semibold text-stone-600">Jumlah Pesanan</span>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            disabled={modalQuantity <= 1}
                                            onClick={() => setModalQuantity(prev => prev - 1)}
                                            className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-50 transition active:scale-90 disabled:opacity-40 cursor-pointer"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="text-sm font-bold text-stone-800 w-6 text-center">{modalQuantity}</span>
                                        <button
                                            type="button"
                                            onClick={() => setModalQuantity(prev => prev + 1)}
                                            className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-50 transition active:scale-90 cursor-pointer"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Bagian Tombol Aksi Bawah */}
                            <div className="p-4 px-6 border-t border-stone-100 bg-amber-50/20 flex-shrink-0 flex gap-3">
                                <button
                                    type="button"
                                    disabled={isModalAdded}
                                    onClick={() => {
                                        if (isModalAdded) return;
                                        
                                        const cartItem = getCartItemForMenuItem(selectedProduct.id);
                                        if (!cartItem) {
                                            onAddToCart(selectedProduct);
                                            if (modalQuantity > 1) {
                                                setTimeout(() => onUpdateQuantity(selectedProduct.id, modalQuantity), 50);
                                            }
                                        } else {
                                            onUpdateQuantity(selectedProduct.id, cartItem.quantity + modalQuantity);
                                        }
                                        
                                        if (modalNotes.trim()) {
                                            setTimeout(() => onUpdateNotes(selectedProduct.id, modalNotes.trim()), 50);
                                        }

                                        setIsModalAdded(true);
                                        setTimeout(() => {
                                            setIsModalAdded(false);
                                            setSelectedProduct(null);
                                        }, 1200);
                                    }}
                                    className={`flex-1 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                                        isModalAdded 
                                            ? 'bg-emerald-600 text-white shadow-emerald-400/20' 
                                            : 'bg-amber-600 hover:bg-amber-700 text-white active:scale-95 shadow-amber-600/25'
                                    }`}
                                >
                                    {isModalAdded ? (
                                        <>
                                            <Check className="w-4 h-4 animate-bounce" />
                                            <span>Berhasil Ditambahkan!</span>
                                        </>
                                    ) : (
                                        <span>Tambah ke Keranjang - Rp {(Number(String(selectedProduct.price).replace(/\D/g, '')) * modalQuantity).toLocaleString('id-ID')}</span>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}