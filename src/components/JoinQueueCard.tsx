'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { joinQueue, checkQueueStatus } from '@/app/actions';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

interface JoinQueueCardProps {
  vendorId: string;
  activeQueueCount: number;
}

export function JoinQueueCard({ vendorId, activeQueueCount }: JoinQueueCardProps) {
  const [isJoining, setIsJoining] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [joinedQueue, setJoinedQueue] = useState<{ id: string; queue_number: number } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Fire complex confetti
  const fireConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
      }));
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
      }));
    }, 250);
  };

  // Poll queue status once user joins
  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    if (joinedQueue && !isCompleted) {
      // Check status immediately once just in case
      const check = async () => {
        const status = await checkQueueStatus(joinedQueue.id);
        if (status === 'completed') {
          setIsCompleted(true);
          fireConfetti();
          
          // Vibrate if supported (haptic feedback)
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
          }
          
          // Play sound notification
          try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => console.log('Audio play blocked by browser policy until interaction:', e));
          } catch (error) {
            console.error('Audio play failed:', error);
          }
        }
      };
      
      // Check every 3 seconds for rapid feedback
      pollInterval = setInterval(check, 3000);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [joinedQueue, isCompleted]);

  const handleJoinQueue = async () => {
    if (!customerName.trim()) {
      toast.error('Masukkan namamu untuk antre.');
      return;
    }

    setIsJoining(true);
    try {
      const result = await joinQueue(vendorId, customerName, [], 0);
      if (result) {
        setJoinedQueue(result);
        toast.success('Berhasil bergabung dalam antrean! 🎉');
      } else {
        toast.error('Gagal bergabung antrean. Coba lagi.');
      }
    } catch (e) {
      console.error(e);
      toast.error('Terjadi gangguan teknis.');
    } finally {
      setIsJoining(false);
    }
  };

  // View 3: Order Ready state
  if (isCompleted) {
    return (
      <Card className="mb-12 border-amber-200 shadow-xl shadow-amber-100 bg-gradient-to-b from-amber-50 to-white overflow-hidden relative animate-in zoom-in duration-300">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-5 pointer-events-none"></div>
        <CardContent className="p-10 text-center relative z-10 flex flex-col items-center">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">ORDER READY!</h3>
          <p className="text-lg text-amber-700 font-medium mb-6">Hi {customerName}, silakan ambil pesanan Anda di konter.</p>
          
          <div className="bg-white border-2 border-dashed border-amber-300 rounded-2xl px-8 py-6 mb-6 shadow-sm">
            <p className="text-slate-400 text-xs font-bold tracking-widest mb-1 uppercase">Your Number</p>
            <p className="text-5xl font-black text-slate-800">#{joinedQueue?.queue_number}</p>
          </div>
          
          <Button 
            onClick={() => {
              setJoinedQueue(null);
              setIsCompleted(false);
              setCustomerName('');
            }}
            className="bg-slate-900 text-white rounded-full px-6 py-2 hover:bg-slate-800 shadow-md"
          >
            Selesai & Tutup
          </Button>
        </CardContent>
      </Card>
    );
  }

  // View 2: Waiting in line state
  if (joinedQueue) {
    return (
      <Card className="mb-12 border-emerald-200 shadow-md shadow-emerald-50 bg-gradient-to-r from-emerald-50 to-white overflow-hidden relative">
        <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10 pointer-events-none"></div>
        <CardContent className="p-8 text-center relative z-10">
          <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">You are in line!</h3>
          <p className="text-slate-600 mb-6">Keep this screen open. We will notify you.</p>
          <div className="text-6xl font-black text-emerald-600 mb-6">#{joinedQueue.queue_number}</div>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 italic">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            Waiting for vendor confirmation...
          </div>
        </CardContent>
      </Card>
    );
  }

  // View 1: Default CTA state
  return (
    <Card className="mb-12 border-sky-200 shadow-md shadow-sky-50 bg-gradient-to-r from-sky-50 to-white overflow-hidden relative">
      <div className="absolute right-0 top-0 w-32 h-32 bg-sky-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10 pointer-events-none"></div>
      <CardContent className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex-1 w-full text-center sm:text-left">
          <h3 className="text-xl font-bold text-slate-900 mb-1">Skip the Line</h3>
          <p className="text-slate-600 text-sm mb-4">Join our digital queue now. We are currently preparing {activeQueueCount} orders.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              placeholder="Enter your name..." 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="px-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 w-full sm:max-w-xs bg-white"
              onKeyDown={(e) => e.key === 'Enter' && handleJoinQueue()}
            />
            <Button 
              onClick={handleJoinQueue} 
              disabled={isJoining || !customerName.trim()}
              className="shrink-0 px-8 rounded-full shadow-sky-200 shadow-lg"
            >
              {isJoining ? 'Joining...' : 'Join Queue'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
