'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Info, X, Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';

interface MenuItemCardProps {
  item: {
    id: string;
    title: string;
    description: string;
    price: string;
    imageUrl?: string;
    vendorId: string;
  };
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      imageUrl: item.imageUrl,
      vendorId: item.vendorId,
    });
    toast.success(`${item.title} ditambahkan ke keranjang`, {
      icon: <Check className="h-4 w-4 text-emerald-500" />,
      style: { borderRadius: '1rem' }
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={cn(
        "group relative overflow-hidden rounded-3xl bg-white transition-all",
        isExpanded ? "ring-1 ring-blue-900/20 shadow-2xl shadow-blue-900/10 z-20" : "hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
      )}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Product Image */}
        <div className={cn(
          "relative overflow-hidden bg-slate-100 transition-all duration-500",
          isExpanded ? "w-full sm:w-1/2 aspect-video sm:aspect-square" : "w-full sm:w-32 md:w-40 aspect-video sm:aspect-square"
        )}>
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-300">
              <Plus className="h-8 w-8 opacity-20" />
            </div>
          )}
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-900 shadow-md backdrop-blur-sm transition-transform hover:scale-110"
          >
            {isExpanded ? <X className="h-4 w-4" /> : <Info className="h-4 w-4" />}
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="text-xl font-serif font-bold tracking-tight text-slate-900 group-hover:text-blue-900 transition-colors">
              {item.title}
            </h3>
            <span className="font-black text-amber-600">Rp {item.price}</span>
          </div>

          <div className="relative">
            <p className={cn(
              "text-sm text-slate-500 transition-all duration-300",
              !isExpanded && "line-clamp-3"
            )}>
              {(() => {
                try {
                  const parsed = JSON.parse(item.description);
                  return parsed.description || item.description;
                } catch {
                  return item.description;
                }
              })()}
            </p>
            {item.description.length > 100 && !isExpanded && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(true);
                }}
                className="mt-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 hover:text-amber-700"
              >
                Baca selengkapnya
              </button>
            )}
          </div>

          {/* Hashtags Rendering - Chips Estetik */}
          {(() => {
            try {
              const parsed = JSON.parse(item.description);
              if (parsed.hashtags && Array.isArray(parsed.hashtags)) {
                return (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {parsed.hashtags.map((tag: string, i: number) => (
                      <span key={i} className="text-[10px] font-medium text-slate-400 bg-slate-100/50 px-2 py-0.5 rounded-md border border-slate-200/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                );
              }
            } catch {
              return null;
            }
          })()}

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 space-y-4 pt-6 border-t border-slate-100"
              >
                <div className="flex gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">Fast Prep</span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600">Premium Ingredients</span>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-950 py-3 text-sm font-bold text-amber-50 transition-all hover:bg-blue-900 active:scale-95 shadow-md"
                >
                  <Plus className="h-4 w-4" />
                  Add to My Order
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!isExpanded && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-slate-200" />
                ))}
                <span className="ml-4 text-[10px] font-medium text-slate-400">+12 orders today</span>
              </div>
              <button 
                onClick={handleAddToCart}
                className="rounded-full bg-slate-50 p-2 text-blue-900 transition-all hover:bg-blue-900 hover:text-white active:scale-90 border border-slate-100 shadow-sm"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
