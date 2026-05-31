'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeroProductProps {
  name: string;
  description: string;
  hashtags?: string[];
  imageUrl?: string;
  onExplore: () => void;
}

export function HeroProduct({ name, description, hashtags = [], imageUrl, onExplore }: HeroProductProps) {
  const [sparkles, setSparkles] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Generate random positions only on the client
    setSparkles([...Array(5)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
      x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
      y: [Math.random() * 100 - 50, Math.random() * 100 - 50]
    })));
  }, []);

  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden bg-slate-950 flex flex-col items-center justify-center">
      {/* Background Image with Deep Moody Overlay */}
      {imageUrl && (
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={imageUrl} 
            alt={name} 
            className="h-full w-full object-cover grayscale-[20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950" />
        </motion.div>
      )}

      {/* Content Area */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center px-8 pt-8 pb-32 text-center">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "circOut" }}
          className="flex flex-col items-center w-full max-w-lg"
        >
          {/* Top Badge */}
          <motion.span 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6 sm:mb-12 inline-flex items-center gap-2 rounded-full bg-amber-900/20 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.25em] text-amber-200 backdrop-blur-md border border-amber-500/20 shadow-lg"
          >
            <Sparkles className="h-3 w-3" />
            Signature Experience
          </motion.span>
          
          {/* The Multi-style Title */}
          <div className="mb-4 sm:mb-8 flex flex-col items-center">
            <h1 className="text-5xl sm:text-7xl font-serif text-white leading-[1.1] tracking-tight mb-2 drop-shadow-2xl">
              {name.split(' ').slice(0, -1).join(' ')}
            </h1>
            <h1 className="text-5xl sm:text-7xl font-serif italic text-amber-300 leading-[1.1] tracking-tight drop-shadow-2xl">
              {name.split(' ').slice(-1)}
            </h1>
          </div>
          
          <div className="mb-6 sm:mb-14">
            <p className="text-base sm:text-lg leading-relaxed text-slate-300/90 font-medium max-w-md mx-auto">
              {description}
            </p>
          </div>

          {/* Hashtags in Dark Pills */}
          {hashtags.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mb-8 sm:mb-16 flex flex-wrap justify-center gap-3"
            >
              {hashtags.map((tag, idx) => (
                <span 
                  key={idx}
                  className="rounded-xl bg-white/5 px-4 py-2 text-[10px] font-bold text-slate-400 border border-white/10 backdrop-blur-md"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          )}
          
          <div className="w-full">
            <Button 
              onClick={onExplore}
              className="group relative w-full h-16 sm:h-20 rounded-2xl bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 text-amber-950 text-base sm:text-lg font-black uppercase tracking-widest transition-all hover:from-amber-100 hover:via-amber-200 hover:to-amber-400 hover:scale-[1.02] active:scale-[0.98] shadow-[0_15px_35px_rgba(251,191,36,0.25)] border border-amber-300"
            >
              <span className="flex items-center justify-center gap-4">
                Explore Menu
                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
              </span>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Subtle Ambient Light (AI Vibe) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-30">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-yellow-500/10 rounded-full blur-[120px]" />
      </div>
    </section>
  );
}
