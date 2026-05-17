'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MenuItemCard } from './MenuItemCard';

interface MenuCatalogProps {
  items: any[];
}

export function MenuCatalog({ items }: MenuCatalogProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <p>No menu items available yet.</p>
      </div>
    );
  }

  return (
    <section className="px-6 pb-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Explore Menu</h2>
          <p className="text-slate-500">Delicious choices just for you</p>
        </div>
        <div className="flex gap-2">
          {/* Categories could go here */}
          <span className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-bold text-slate-900">All</span>
          <span className="rounded-full px-4 py-1.5 text-sm font-medium text-slate-400">Drinks</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {items.map((item, index) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
