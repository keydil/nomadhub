'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CloudSun, Moon, Sunrise } from 'lucide-react';
import { cn } from '@/utils/cn';

interface AIRecommendationProps {
  recommendedItem?: {
    title: string;
    description: string;
    imageUrl?: string;
    price: string;
  };
}

export function AIRecommendation({ recommendedItem }: AIRecommendationProps) {
  const [greetingType, setGreetingType] = useState<'morning' | 'afternoon' | 'evening' | 'default'>('default');

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

  const getGreetingData = () => {
    switch (greetingType) {
      case 'morning':
        return { text: 'Good Morning!', icon: <Sunrise className="h-5 w-5 text-amber-400" /> };
      case 'afternoon':
        return { text: 'Good Afternoon!', icon: <CloudSun className="h-5 w-5 text-sky-400" /> };
      case 'evening':
        return { text: 'Good Evening!', icon: <Moon className="h-5 w-5 text-indigo-400" /> };
      default:
        return { text: 'Halo!', icon: <Sparkles className="h-5 w-5" /> };
    }
  };

  const greeting = getGreetingData();

  if (!recommendedItem) return null;

  return (
    <section className="px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-2xl ring-1 ring-white/10"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/20 text-sky-400">
            {greeting.icon}
          </div>
          <div>
            <h2 className="text-xl font-bold">{greeting.text}</h2>
            <p className="text-sm text-slate-400">AI Personal Recommendation for you</p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:aspect-square">
            <img 
              src={recommendedItem.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'} 
              alt={recommendedItem.title}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            <div className="absolute bottom-4 left-4 rounded-full bg-sky-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
              Must Try!
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-3xl font-black tracking-tight text-white">{recommendedItem.title}</h3>
              <span className="rounded-full bg-white/10 px-4 py-1 font-bold text-sky-400 backdrop-blur-md">
                Rp {recommendedItem.price}
              </span>
            </div>
            <p className="mb-8 text-lg leading-relaxed text-slate-300">
              {recommendedItem.description}
            </p>
            <button className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 py-4 font-bold text-white transition-all hover:bg-sky-400 hover:shadow-[0_0_20px_rgba(14,165,233,0.4)]">
              Add to Order
              <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
