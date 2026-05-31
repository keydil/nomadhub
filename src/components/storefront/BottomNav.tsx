'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, Ticket } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useCartStore } from '@/store/useCartStore';

interface BottomNavProps {
  activeTab: 'home' | 'cart' | 'queue';
  isCartOpen?: boolean;
  onTabChange: (tab: 'home' | 'cart' | 'queue') => void;
}

export function BottomNav({ activeTab, isCartOpen, onTabChange }: BottomNavProps) {
  const totalItems = useCartStore((state) => state.getTotalItems());

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'cart', label: 'Cart', icon: ShoppingBag },
    { id: 'queue', label: 'My Queue', icon: Ticket },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[80]">
      {/* Soft gradient shadow extending upwards */}
      <div className="absolute bottom-full left-0 right-0 h-10 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
      
      <nav className="bg-white/95 backdrop-blur-2xl border-t border-slate-100 rounded-t-[2rem] px-6 py-4 pb-6 shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between max-w-md mx-auto relative">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isCart = tab.id === 'cart';
            const isActive = isCartOpen ? isCart : (activeTab === tab.id);
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as any)}
                className="relative flex flex-col items-center flex-1 group"
              >
                <div className={cn(
                  "relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-500",
                  isActive ? "bg-amber-400 text-amber-950 shadow-lg shadow-amber-400/30 -translate-y-2" : "bg-transparent text-slate-400 hover:text-slate-600"
                )}>
                  <Icon className={cn("transition-all duration-300", isActive ? "w-6 h-6 stroke-[2.5px]" : "w-6 h-6 stroke-[2px]")} />
                  
                  {/* Cart Badge */}
                  {isCart && totalItems > 0 && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={cn(
                        "absolute top-0 right-0 h-5 w-5 rounded-full border-2 border-white flex items-center justify-center shadow-sm",
                        isActive ? "bg-red-500 text-white" : "bg-amber-500 text-amber-950"
                      )}
                    >
                      <span className="text-[10px] font-black">{totalItems}</span>
                    </motion.div>
                  )}
                </div>
                
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest transition-all duration-300 absolute -bottom-1",
                  isActive ? "text-slate-900 opacity-100 translate-y-0" : "text-slate-400 opacity-0 translate-y-2"
                )}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
