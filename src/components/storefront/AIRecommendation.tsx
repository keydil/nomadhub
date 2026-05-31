'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CloudSun, Moon, Sunrise, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';

interface AIRecommendationProps {
  items?: any[];
}

export function AIRecommendation({ items }: AIRecommendationProps) {
  const [greetingType, setGreetingType] = useState<'morning' | 'afternoon' | 'evening' | 'default'>('default');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreetingType('morning');
    } else if (hour < 18) {
      setGreetingType('afternoon');
    } else {
      setGreetingType('evening');
    }
  }, []);

  // Auto-rotate items every 5 seconds
  useEffect(() => {
    if (!items || items.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [items]);

  const getGreetingData = () => {
    switch (greetingType) {
      case 'morning':
        return { text: 'Good Morning!', icon: <Sunrise className="h-5 w-5 text-amber-400" /> };
      case 'afternoon':
        return { text: 'Good Afternoon!', icon: <CloudSun className="h-5 w-5 text-amber-300" /> };
      case 'evening':
        return { text: 'Good Evening!', icon: <Moon className="h-5 w-5 text-indigo-300" /> };
      default:
        return { text: 'Halo!', icon: <Sparkles className="h-5 w-5 text-amber-300" /> };
    }
  };

  const greeting = getGreetingData();

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];

  // Safely parse description if it's stored as JSON
  let parsedDesc = currentItem.description;
  let parsedHashtags: string[] = [];
  try {
    const parsed = JSON.parse(currentItem.description);
    if (parsed.description) parsedDesc = parsed.description;
    if (parsed.hashtags) parsedHashtags = parsed.hashtags;
  } catch (e) {
    // If it's just a regular string, keep it as is
  }

  const handleAddToCart = () => {
    useCartStore.getState().addToCart({
      ...currentItem,
      vendorId: currentItem.vendorId, // Use the correct vendor id from the item
    });
    toast.success(`${currentItem.title} ditambahkan ke keranjang!`);
  };

  return (
    <section className="pt-2 pb-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl bg-gradient-to-br from-blue-900 via-blue-950 to-zinc-950 p-6 text-white shadow-2xl shadow-blue-900/20 ring-1 ring-white/10 relative overflow-hidden"
      >
        <div className="mb-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
              {greeting.icon}
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">{greeting.text}</h2>
              <p className="text-[11px] font-medium text-amber-200/80 uppercase tracking-wider">AI Recommendation</p>
            </div>
          </div>
          
          {/* Pagination Indicators */}
          {items.length > 1 && (
            <div className="flex gap-1.5">
              {items.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/20'}`} 
                />
              ))}
            </div>
          )}
        </div>

        <div className="relative h-[160px] w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex gap-4 h-full"
            >
              {/* Image side */}
              <div className="relative aspect-square h-full shrink-0 overflow-hidden rounded-2xl border-2 border-white/10 shadow-lg bg-white/5">
                <img 
                  src={currentItem.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'} 
                  alt={currentItem.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-2 left-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-950 shadow-md">
                  Top Pick
                </div>
              </div>

              {/* Content side */}
              <div className="flex flex-1 flex-col justify-between py-1 min-w-0">
                <div>
                  <h3 className="truncate text-lg font-bold text-white drop-shadow-sm mb-1">{currentItem.title}</h3>
                  <div className="mb-2">
                    <span className="inline-block rounded-md bg-white/10 px-2 py-0.5 text-xs font-bold text-amber-300 border border-white/5">
                      Rp {currentItem.price}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed opacity-90">
                    {parsedDesc}
                  </p>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="mt-auto flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-400 py-2.5 text-xs font-black text-amber-950 transition-all active:scale-95 shadow-[0_4px_15px_-3px_rgba(251,191,36,0.4)]"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Add to Order
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
