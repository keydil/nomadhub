'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { useMagicPolish } from '@/hooks/useMagicPolish';
import PhoneContainer from './PhoneContainer';
import HomeTab from './HomeTab';
import CartTab from './CartTab';
import OrdersTab from './OrdersTab';

import { useCartStore } from '@/store/useCartStore';
import { useQueueStore } from '@/store/useQueueStore';
import { joinQueue } from '@/app/actions';
import { toast } from 'sonner';

interface StorefrontClientProps {
  vendor: any;
  menuItems: any[];
}

export default function StorefrontClient({ vendor, menuItems }: StorefrontClientProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'cart' | 'orders'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Coupon state for the CartTab
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');

  const signatureDish = menuItems[0] || {
    title: 'Welcome to our Kitchen',
    description: 'Discover the best flavors in town.',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=2000'
  };

  const { data: polishedData, isLoading: isPolishing } = useMagicPolish(signatureDish);
  const queueState = useQueueStore();
  // Only show orders that belong to THIS vendor (multi-tenant isolation)
  const orders = (queueState.activeQueueId && queueState.vendorId === vendor.id) ? [{
    id: `${queueState.customerName} #${queueState.queueNumber}`,
    originalId: queueState.activeQueueId,
    items: queueState.items || [],
    status: queueState.status === 'waiting' ? 'Menerima' : queueState.status === 'cooking' ? 'Disiapkan' : queueState.status === 'completed' ? 'Selesai' : 'Menerima' as import("../../types").OrderStatus,
    createdAt: new Date().toISOString(),
    timeLeft: 600,
    subtotal: queueState.totalPrice || 0,
    deliveryFee: 0,
    total: queueState.totalPrice || 0,
    deliveryMethod: queueState.deliveryMethod || 'Pickup',
    paymentMethod: queueState.paymentMethod || 'Cash',
    paymentStatus: queueState.paymentStatus || 'Pending',
    tableNumber: queueState.tableNumber || ''
  } as import("../../types").OrderState] : [];

  const activeQueueId = useQueueStore((state) => state.activeQueueId);
  

  // Cart State
  const items = useCartStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addToCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateNotes = useCartStore((state) => state.updateNotes);
  const clearCart = useCartStore((state) => state.clearCart);

  // Audio Reference for order completion
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/success.mp3');
  }, []);

  // Realtime subscription to track buyer order status
  useEffect(() => {
    if (!queueState.activeQueueId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`buyer-queue-${queueState.activeQueueId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'queues',
          filter: `id=eq.${queueState.activeQueueId}`,
        },
        (payload) => {
          const updated = payload.new as any;
          if (updated.status !== queueState.status) {
            queueState.updateStatus(updated.status);
            
            // Play success sound if order completed
            if ((updated.status === 'completed' || updated.status === 'ready') && audioRef.current) {
               audioRef.current.currentTime = 0;
               audioRef.current.play().catch(() => {});
               toast.success('Yeay! Pesananmu sudah selesai! 🎉', { duration: 5000 });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queueState.activeQueueId, queueState.status]);

  // Enforce single-vendor cart policy
  useEffect(() => {
    if (items.length > 0 && items[0].vendorId !== vendor.id) {
      clearCart();
    }
  }, [vendor.id, items]);

  const handleCheckout = async (
    subtotal: number, 
    deliveryFee: number, 
    discount: number, 
    couponCode: string, 
    deliveryMethod: 'Pickup' | 'Delivery', 
    customerName: string, 
    paymentMethod: string = 'Cash',
    paymentStatus: string = 'Pending',
    paymentProof?: string,
    tableNumberFromCart?: string
  ) => {
    const calculatedTotal = Math.max(0, subtotal + deliveryFee - discount);
    
    // Call real Supabase action
    try {
      const result = await joinQueue(vendor.id, customerName, items, calculatedTotal, deliveryMethod, paymentMethod, tableNumberFromCart || tableNumber, paymentStatus, paymentProof);
      if (result) {
        // Save to useQueueStore so the OrdersTab can track it
        useQueueStore.getState().setActiveQueue(result);
        
        toast.success('Order Confirmed!', {
          description: `You are now in the queue. Your number is #${result.queue_number}`
        });

        clearCart();
        setAppliedCoupon(null);
        setActiveTab('orders');
      } else {
        toast.error('Failed to submit order');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong!');
    }
  };

  const handleClearHistory = () => {};

  const handleReorder = (itemsToCopy: any[]) => {
    itemsToCopy.forEach(item => {
      addToCart({
        id: item.id,
        title: item.title,
        price: item.price,
        imageUrl: item.imageUrl,
        vendorId: item.vendorId,
        notes: item.notes
      });
    });
    setActiveTab('cart');
  };

  return (
    <PhoneContainer
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      cartCount={items.length}
      onOpenStoreInfo={() => setSelectedCategory('All')}
    >
      {activeTab === 'home' && (
        <HomeTab
          vendor={vendor}
          menuItems={menuItems}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          cart={items}
          onAddToCart={addToCart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onUpdateNotes={updateNotes}
          onNavigateCart={() => setActiveTab('cart')}
        />
      )}

      {activeTab === 'cart' && (
        <CartTab
          cart={items}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onCheckout={handleCheckout}
          appliedCoupon={appliedCoupon}
          setAppliedCoupon={setAppliedCoupon}
          tableNumber={tableNumber}
          setTableNumber={setTableNumber}
          customerName={customerName}
          setCustomerName={setCustomerName}
        />
      )}

      {activeTab === 'orders' && (
        <OrdersTab
          orders={orders}
          onReorder={handleReorder}
          onClearHistory={handleClearHistory}
          onNavigateHome={() => setActiveTab('home')}
        />
      )}
    </PhoneContainer>
  );
}
