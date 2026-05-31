'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueueStore } from '@/store/useQueueStore';
import { createClient } from '@/utils/supabase/client';
import confetti from 'canvas-confetti';
import { PartyPopper, CheckCircle2, Clock, RotateCcw, Flame } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function LiveQueueTracker() {
  const { activeQueueId, queueNumber, status, customerName, updateStatus, clearQueue } = useQueueStore();
  const successAudioRef = useRef<HTMLAudioElement | null>(null);

  // Pre-load the success audio once
  useEffect(() => {
    successAudioRef.current = new Audio('/success.mp3');
    successAudioRef.current.volume = 0.8;
  }, []);

  const playSuccessSound = useCallback(() => {
    try {
      if (successAudioRef.current) {
        successAudioRef.current.currentTime = 0;
        successAudioRef.current.play().catch(() => {});
      }
    } catch (e) {
      console.log('Audio playback failed:', e);
    }
  }, []);

  // Subscribe to Realtime changes for this specific queue item
  useEffect(() => {
    if (!activeQueueId || status === 'completed' || status === 'cancelled') return;

    const supabase = createClient();
    const channel = supabase
      .channel(`customer-queue-${activeQueueId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'queues',
          filter: `id=eq.${activeQueueId}`,
        },
        (payload) => {
          const newStatus = (payload.new as any).status;
          if (newStatus && newStatus !== status) {
            updateStatus(newStatus);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeQueueId, status, updateStatus]);

  // Handle completion effects: confetti, vibration, sound
  useEffect(() => {
    if (status === 'completed') {
      // Play success sound
      playSuccessSound();

      // Fire confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#f59e0b', '#3b82f6', '#10b981']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#f59e0b', '#3b82f6', '#10b981']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      // Trigger vibration with iOS Safari safeguard
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([200, 100, 200, 100, 500]);
        } catch (e) {
          console.log("Vibration API not supported or blocked", e);
        }
      }
    }
  }, [status, playSuccessSound]);

  if (!activeQueueId) {
    return (
      <div className="px-6 py-20 text-center text-slate-400">
        <h2 className="text-2xl font-black text-slate-900 mb-2">My Queue</h2>
        <p>You have no active orders yet.</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 flex flex-col items-center justify-center min-h-[50vh]">
      <AnimatePresence mode="wait">
        {status === 'waiting' ? (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center w-full max-w-sm"
          >
            <div className="relative w-48 h-48 mb-8">
              {/* Pulsing background circles */}
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-50" />
              <div className="absolute inset-4 bg-blue-200 rounded-full animate-pulse opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-950 rounded-full shadow-[0_0_40px_rgba(30,58,138,0.3)] border-4 border-white z-10">
                <div className="text-center">
                  <span className="block text-amber-200 text-sm font-bold uppercase tracking-widest mb-1">Nomor Antrean</span>
                  <span className="block text-6xl font-black text-white drop-shadow-md">#{queueNumber}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-blue-900/10 w-full text-center">
              <div className="flex items-center justify-center gap-2 text-blue-900 mb-2">
                <Clock className="w-5 h-5 animate-pulse" />
                <h3 className="text-xl font-bold">Sedang Diproses</h3>
              </div>
              <p className="text-slate-500 font-medium text-sm">
                Halo <span className="text-slate-900 font-bold">{customerName}</span>, pesananmu sedang disiapkan dengan penuh cinta. Mohon tunggu sebentar ya!
              </p>
            </div>
          </motion.div>
        ) : status === 'cooking' ? (
          <motion.div
            key="cooking"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center w-full max-w-sm"
          >
            <div className="relative w-48 h-48 mb-8">
              {/* Pulsing background circles for heat/cooking */}
              <div className="absolute inset-0 bg-orange-100 rounded-full animate-ping opacity-50" />
              <div className="absolute inset-4 bg-orange-200 rounded-full animate-pulse opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-600 rounded-full shadow-[0_0_40px_rgba(239,68,68,0.4)] border-4 border-white z-10 overflow-hidden">
                {/* Simulated fire/heat effect inside */}
                <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-red-600/50 to-transparent animate-pulse" />
                <div className="text-center z-10 relative">
                  <span className="block text-orange-100 text-sm font-bold uppercase tracking-widest mb-1">Antrean</span>
                  <span className="block text-6xl font-black text-white drop-shadow-md">#{queueNumber}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-orange-900/10 w-full text-center">
              <div className="flex items-center justify-center gap-2 text-orange-600 mb-2">
                <Flame className="w-5 h-5 animate-bounce" />
                <h3 className="text-xl font-bold">Sedang Dimasak!</h3>
              </div>
              <p className="text-slate-500 font-medium text-sm">
                Harumnya udah kecium nih <span className="text-slate-900 font-bold">{customerName}</span>! Chef sedang memasak pesananmu dengan penuh cinta.
              </p>
            </div>
          </motion.div>
        ) : status === 'completed' ? (
          <motion.div
            key="completed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center w-full max-w-sm"
          >
            <div className="w-32 h-32 mb-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.4)] border-4 border-white z-10">
              <CheckCircle2 className="w-16 h-16 text-white" />
            </div>
            
            <h2 className="text-3xl font-black text-slate-900 mb-2">Pesanan Siap!</h2>
            <p className="text-slate-500 text-center font-medium mb-8">
              Yey! Pesananmu (#{queueNumber}) sudah selesai dan siap diambil. Silakan menuju kasir.
            </p>

            <Button 
              onClick={clearQueue}
              className="w-full h-14 rounded-2xl bg-blue-950 text-amber-50 font-bold hover:bg-blue-900 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Pesan Lagi
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="cancelled"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">😔</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Pesanan Dibatalkan</h2>
            <Button variant="outline" onClick={clearQueue} className="mt-4 rounded-full">
              Kembali
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
