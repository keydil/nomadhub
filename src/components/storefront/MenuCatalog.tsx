'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuItemCard } from './MenuItemCard';

interface MenuCatalogProps {
  items: any[];
}

export function MenuCatalog({ items }: MenuCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    items.forEach(item => {
      if (item.category && item.category !== 'Lainnya') {
        cats.add(item.category);
      }
    });
    return ['All', ...Array.from(cats)];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return items;
    return items.filter(item => item.category === activeCategory);
  }, [items, activeCategory]);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <p>No menu items available yet.</p>
      </div>
    );
  }

  return (
    <section className="px-6 pb-20">
      <div className="mb-6 flex flex-col gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Explore Menu</h2>
          <p className="text-slate-500">Delicious choices just for you</p>
        </div>
        
        {/* Horizontal Scrollable Categories */}
        {categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 snap-x">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full px-5 py-2 text-sm transition-all snap-start ${
                  activeCategory === cat 
                    ? 'bg-slate-900 text-white font-bold shadow-md' 
                    : 'bg-slate-100 text-slate-500 font-medium hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div 
          layout
          className="grid gap-6 md:grid-cols-2"
        >
          {filteredItems.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              key={item.id}
            >
              <MenuItemCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

