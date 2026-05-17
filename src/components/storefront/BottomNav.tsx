'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, Ticket } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useCartStore } from '@/store/useCartStore';

interface BottomNavProps {
  activeTab: 'home' | 'cart' | 'queue';
  onTabChange: (tab: 'home' | 'cart' | 'queue') => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const totalItems = useCartStore((state) => state.getTotalItems());

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'cart', label: 'Cart', icon: ShoppingBag },
    { id: 'queue', label: 'My Queue', icon: Ticket },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
      <nav className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl px-4 py-3">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isCart = tab.id === 'cart';
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as any)}
                className="relative flex flex-col items-center gap-1 group"
              >
                <div className={cn(
                  "p-2 rounded-2xl transition-all duration-300",
                  isActive ? "bg-sky-500 text-white shadow-lg shadow-sky-200" : "text-slate-400 group-hover:text-slate-600"
                )}>
                  <Icon className="w-6 h-6" />
                  
                  {/* Cart Badge */}
                  {isCart && totalItems > 0 && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-1 h-5 w-5 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center"
                    >
                      <span className="text-[10px] font-bold text-white">{totalItems}</span>
                    </motion.div>
                  )}
                </div>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider transition-all",
                  isActive ? "text-sky-600" : "text-slate-400"
                )}>
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="activeDot"
                    className="absolute -bottom-1 w-1 h-1 bg-sky-500 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
