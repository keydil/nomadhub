import React, { useState, useEffect } from 'react';
import { Signal, Wifi, Battery, MapPin, Phone, Home as HomeIcon, ShoppingCart, ClipboardCheck, Clock } from 'lucide-react';

interface PhoneContainerProps {
    children: React.ReactNode;
    activeTab: 'home' | 'cart' | 'orders';
    setActiveTab: (tab: 'home' | 'cart' | 'orders') => void;
    cartCount: number;
    onOpenStoreInfo: () => void;
}

export default function PhoneContainer({
    children,
    activeTab,
    setActiveTab,
    cartCount,
    onOpenStoreInfo,
}: PhoneContainerProps) {
    const [time, setTime] = useState('09:41');

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            let hours = now.getHours().toString().padStart(2, '0');
            let minutes = now.getMinutes().toString().padStart(2, '0');
            setTime(`${hours}:${minutes}`);
        };

        updateClock();
        const interval = setInterval(updateClock, 1000 * 60);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            id="workspace"
            className="min-h-[100dvh] w-full relative flex items-center justify-center bg-cover bg-center md:p-10 select-none overflow-x-hidden md:bg-black"
            style={{
                backgroundImage: 'linear-gradient(to bottom, rgba(45,26,15,0.78), rgba(24,13,7,0.92)), url("https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=1600&auto=format&fit=crop&q=80")',
            }}
        >
            {/* --- Ambient Desk Visual Accessories (Only visible on medium+ viewports) --- */}
            {/* 1. Traditional Coffee & Tea Overhead */}
            <div
                id="desk_coffee"
                className="hidden lg:block absolute -top-8 -right-8 w-64 h-64 rounded-full bg-cover bg-center shadow-2xl transition hover:scale-105 duration-700 select-none pointer-events-none"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=80")',
                    boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6), 0 20px 50px rgba(0,0,0,0.8)'
                }}
            />

            {/* 2. Traditional Batik Napkin/Runner on Left */}
            <div
                id="desk_batik"
                className="hidden lg:block absolute top-[10%] -left-16 w-52 h-96 opacity-65 rotate-12 bg-cover bg-center rounded-2xl shadow-xl transition-all hover:opacity-85 duration-500 pointer-events-none"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1621259182978-f09e5e2b0244?w=500&auto=format&fit=crop&q=80")',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
                }}
            />

            {/* 3. Subtle floating coffee bean particle sparks */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.7))] pointer-events-none" />

            {/* --- SMARTPHONE CONTAINER FRAME --- */}
            <div
                id="smartphone_frame"
                className="relative w-full h-[100dvh] flex flex-col md:max-w-[410px] md:h-[840px] md:rounded-[55px] md:bg-[#1a1a1a] md:p-3.5 md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] md:border-4 md:border-[#333333] transition-all duration-300 md:scale-[0.98] lg:scale-100"
            >
                {/* Glossy highlight on phone screen edge */}
                <div className="hidden md:block absolute inset-0 rounded-[51px] border border-white/5 pointer-events-none z-30" />

                {/* Dynamic Island Notch */}
                <div className="hidden md:flex absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6.5 bg-black rounded-full z-40 items-center justify-center">
                    {/* Virtual camera dots */}
                    <div className="w-2.5 h-2.5 rounded-full bg-[#111111] absolute right-4 border border-zinc-900 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-blue-900/40" />
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-950 absolute left-4" />
                </div>

                {/* --- ACTUAL VIRTUAL MOBILE APP SCREEN BODY --- */}
                <div
                    id="phone_screen"
                    className="relative w-full h-full bg-[#fafafa] overflow-hidden flex flex-col font-sans text-stone-800 z-10 md:rounded-[38px]"
                >
                    {/* Status Bar */}
                    <div className="hidden md:flex h-10 px-6.5 pt-3.5 justify-between items-center bg-white/90 backdrop-blur-md z-30 font-medium">
                        <div className="text-[13.5px] font-semibold text-stone-900 flex items-center gap-1">
                            {time}
                        </div>

                        <div className="flex items-center gap-1.5 text-stone-900">
                            <Signal className="w-4 h-4" strokeWidth={2.5} />
                            <Wifi className="w-4 h-4" strokeWidth={2.5} />
                            <div className="relative flex items-center">
                                <Battery className="w-[19px] h-[19px] rotate-0" strokeWidth={2} />
                                <span className="absolute left-[3px] top-[7px] w-2.5 h-1.5 bg-current rounded-3xs" />
                            </div>
                        </div>
                    </div>

                    {/* MAIN COMPONENT PORT */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col bg-stone-50 pb-[74px]">
                        {children}
                    </div>

                    {/* --- PREMIUM BOTTOM TAB NAVIGATION BAR (MATCHES PHOTO) --- */}
                    <div
                        id="app_navbar"
                        className="absolute bottom-0 left-0 right-0 h-[72px] bg-white/95 backdrop-blur-md border-t border-stone-100 px-6 pt-2 pb-5 flex justify-around items-center z-30 shadow-[0_-5px_15px_rgba(0,0,0,0.03)]"
                    >
                        {/* Tab: Home */}
                        <button
                            id="nav_btn_home"
                            onClick={() => setActiveTab('home')}
                            className={`flex flex-col items-center justify-center gap-1 min-w-[50px] transition-all duration-300 ${activeTab === 'home' ? 'text-amber-700 scale-105 font-medium' : 'text-stone-400 hover:text-stone-600'
                                }`}
                        >
                            <HomeIcon className="w-5.5 h-5.5" />
                            <span className="text-[10px] tracking-wide">Home</span>
                        </button>

                        {/* Tab: Cart */}
                        <button
                            id="nav_btn_cart"
                            onClick={() => setActiveTab('cart')}
                            className={`flex flex-col items-center justify-center gap-1 min-w-[50px] relative transition-all duration-300 ${activeTab === 'cart' ? 'text-amber-700 scale-105 font-medium' : 'text-stone-400 hover:text-stone-600'
                                }`}
                        >
                            <div className="relative">
                                <ShoppingCart className="w-5.5 h-5.5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-2 bg-amber-600 border border-white text-white text-[9px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center animate-pulse">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] tracking-wide">Cart</span>
                        </button>

                        {/* Tab: Orders */}
                        <button
                            id="nav_btn_orders"
                            onClick={() => setActiveTab('orders')}
                            className={`flex flex-col items-center justify-center gap-1 min-w-[50px] transition-all duration-300 ${activeTab === 'orders' ? 'text-amber-700 scale-105 font-medium' : 'text-stone-400 hover:text-stone-600'
                                }`}
                        >
                            <ClipboardCheck className="w-5.5 h-5.5" />
                            <span className="text-[10px] tracking-wide">Pesanan</span>
                        </button>
                    </div>

                    {/* Virtual iOS Bottom Indication Pill */}
                    <div className="hidden md:block absolute bottom-[4px] left-1/2 -translate-x-1/2 w-[124px] h-[4px] bg-stone-300 rounded-full z-40 pointer-events-none" />
                </div>
            </div>
        </div>
    );
}
