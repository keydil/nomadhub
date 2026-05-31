'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, ArrowRight, User, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useQueueStore } from '@/store/useQueueStore';
import { cn } from '@/utils/cn';
import { joinQueue } from '@/app/actions';
import { toast } from 'sonner';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  vendorId: string;
  onSuccess: () => void; // Callback to switch to Queue tab
}

export function CartDrawer({ isOpen, onClose, vendorId, onSuccess }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCartStore();
  const [step, setStep] = useState<'review' | 'checkout'>('review');
  const [customerName, setCustomerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = getTotalPrice();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await joinQueue(vendorId, customerName, items, totalPrice);
      if (result) {
        useQueueStore.getState().setActiveQueue(result);

        toast.success('Order Confirmed!', {
          description: `You are now in the queue. Your number is #${result.queue_number}`,
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        });
        clearCart();
        setStep('review');
        setCustomerName('');
        onSuccess(); // Switch tab
        onClose();   // Close drawer
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to join queue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Drawer Content */}
          {/* Drawer Content */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "fixed inset-x-0 bottom-0 z-[70] mx-auto w-full max-w-lg overflow-hidden rounded-t-[2.5rem] bg-white shadow-2xl transition-all duration-500 flex flex-col pb-[100px]",
              step === 'review' ? "h-[75vh]" : "h-[85vh]"
            )}
          >
            {/* 1. Header (Fixed) */}
            <div className="flex items-center justify-between px-8 pt-8 pb-4 flex-shrink-0">
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                {step === 'review' ? 'Your Order' : 'Final Details'}
              </h2>
              <button 
                onClick={onClose}
                className="rounded-full bg-slate-100 p-2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 2. Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto px-8">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-4 rounded-full bg-slate-50 p-6">
                    <ShoppingBag className="h-12 w-12 text-slate-200" />
                  </div>
                  <p className="font-bold text-slate-400">Your cart is empty</p>
                  <button 
                    onClick={onClose}
                    className="mt-4 text-sm font-bold text-sky-500"
                  >
                    Go browse the menu
                  </button>
                </div>
              ) : step === 'review' ? (
                /* STEP 1: Review Items */
                <div className="space-y-6 pt-4 pb-10">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">{item.title}</h3>
                        <p className="text-xs sm:text-sm font-black text-sky-600">Rp {item.price}</p>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-1">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="rounded-lg bg-white p-1 text-slate-400 shadow-sm hover:text-slate-900"
                        >
                          <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                        <span className="w-4 text-center text-xs sm:text-sm font-bold text-slate-900">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="rounded-lg bg-white p-1 text-slate-400 shadow-sm hover:text-slate-900"
                        >
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* STEP 2: Input Name Form */
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="pt-6 pb-20"
                >
                  <div className="mb-6 rounded-3xl bg-sky-50 p-6 border border-sky-100">
                    <p className="text-sm font-medium text-sky-800 leading-relaxed">
                      We just need your name to identify your order in the queue.
                    </p>
                  </div>
                  
                  <form onSubmit={handleCheckout} className="space-y-6">
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">
                        Your Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
                        <input 
                          type="text"
                          required
                          autoFocus
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="What should we call you?"
                          className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-4 pl-12 pr-6 font-bold text-slate-900 transition-all focus:border-sky-500 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>

            {/* 3. Footer (Fixed at Bottom, no overlapping) */}
            {items.length > 0 && (
              <div className="bg-white p-6 sm:p-8 border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex-shrink-0">
                <div className="mb-4 sm:mb-6 flex items-center justify-between">
                  <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Total Amount</span>
                  <span className="text-xl sm:text-2xl font-black text-slate-900">Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
                
                {step === 'review' ? (
                  <button 
                    onClick={() => setStep('checkout')}
                    className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 font-black text-white shadow-xl shadow-slate-200 transition-all hover:bg-slate-800 active:scale-[0.98]"
                  >
                    Confirm Order & Join Queue
                    <ArrowRight className="h-5 w-5 text-sky-400" />
                  </button>
                ) : (
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setStep('review')}
                      disabled={isSubmitting}
                      className="h-16 w-20 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handleCheckout}
                      disabled={isSubmitting}
                      className="flex h-16 flex-1 items-center justify-center gap-3 rounded-2xl bg-sky-500 font-black text-white shadow-xl shadow-sky-100 transition-all hover:bg-sky-600 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Processing...' : 'Place My Order'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
