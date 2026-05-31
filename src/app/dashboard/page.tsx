'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { logout } from '@/app/auth-actions';
import { Loader2 } from 'lucide-react';
import { 
  fetchVendor, setVendorStatus, setVendorLocation, fetchActiveQueues, updateQueueStatus, 
  updateVendorProfile, uploadVendorLogo, fetchMenu, saveMenuItem, uploadMenuImage,
  deleteMenuItem, editMenuItem
} from '@/app/actions';
import { createClient } from '@/utils/supabase/client';
import VendorDashboard from '@/components/VendorDashboard';

interface QueueItem {
  id: string;
  customer_name: string;
  queue_number: number;
  created_at: string;
  total_price?: number;
  items_json?: any[];
  status?: string;
  delivery_method?: string;
  table_number?: string;
  payment_method?: string;
  payment_status?: string;
}

export default function DashboardContainer() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Vendor States
  const [storeStatus, setStoreStatus] = useState<'Open' | 'Closed'>('Closed');
  const [activeQueueCount, setActiveQueueCount] = useState(0);
  const [storeLocation, setStoreLocation] = useState('');
  const [vendorSlug, setVendorSlug] = useState('');
  const [storeName, setStoreName] = useState('');
  const [storeSlogan, setStoreSlogan] = useState('');
  const [logoImage, setLogoImage] = useState('');
  
  // Data States
  const [queues, setQueues] = useState<QueueItem[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  
  const [isMarkingDone, setIsMarkingDone] = useState<string | null>(null);
  
  // Actual File chosen by VendorDashboard
  const [actualFileToUpload, setActualFileToUpload] = useState<File | null>(null);

  const bellAudioRef = useRef<HTMLAudioElement | null>(null);

  // Pre-load the bell audio once
  useEffect(() => {
    bellAudioRef.current = new Audio('/bell.mp3');
    bellAudioRef.current.volume = 0.7;
  }, []);

  const playBellSound = useCallback(() => {
    try {
      if (bellAudioRef.current) {
        bellAudioRef.current.currentTime = 0;
        bellAudioRef.current.play().catch(() => {});
      }
    } catch (e) {
      console.log('Audio playback failed:', e);
    }
  }, []);

  const fetchQueuesData = async () => {
    const q = await fetchActiveQueues();
    if (q) {
      setQueues(q as QueueItem[]);
      setActiveQueueCount(q.length);
    }
  };

  const loadMenuData = async () => {
    try {
      const items = await fetchMenu();
      if (items) setMenuItems(items);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let vendorId = '';

    const loadVendor = async () => {
      setIsLoading(true);
      const v = await fetchVendor();
      if (v) {
        setStoreStatus(v.status === 'open' ? 'Open' : 'Closed');
        setStoreLocation(v.location || '');
        setVendorSlug(v.slug);
        setStoreName(v.name || 'Vendor Toko');
        setStoreSlogan(v.description || '');
        setLogoImage(v.logo_url || '');
        vendorId = v.slug;
        await fetchQueuesData();
        await loadMenuData();
        subscribeToRealtime(vendorId);
      }
      setIsLoading(false);
    };

    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const subscribeToRealtime = (vid: string) => {
      const channelName = `vendor-queue-${vid}-${Date.now()}`;
      channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'queues',
            filter: `vendor_id=eq.${vid}`,
          },
          (payload) => {
            const newItem = payload.new as QueueItem;
            setQueues((prev) => [...prev, newItem]);
            setActiveQueueCount((prev) => prev + 1);
            playBellSound();
            toast.success(`Pesanan baru dari ${newItem.customer_name}!`, { icon: '🔔' });
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'queues',
            filter: `vendor_id=eq.${vid}`,
          },
          (payload) => {
            const updated = payload.new as any;
            if (updated.status === 'completed' || updated.status === 'cancelled') {
              setQueues((prev) => prev.filter((q) => q.id !== updated.id));
              setActiveQueueCount((prev) => Math.max(0, prev - 1));
            } else if (updated.status === 'cooking') {
              setQueues((prev) => prev.map(q => q.id === updated.id ? { ...q, status: 'cooking' } : q));
            }
          }
        )
        .subscribe();
    };

    loadVendor();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [playBellSound]);

  // ACTION WRAPPERS TO PASS TO VENDOR DASHBOARD

  const onAdvanceOrderAction = async (queueId: string, currentStatus: string) => {
    // CurrentStatus from the UI maps to: 'Menerima' (waiting), 'Disiapkan' (cooking)
    // We want to advance to the next real DB status
    let newStatus: 'cooking' | 'completed' = 'cooking';
    if (currentStatus === 'Disiapkan' || currentStatus === 'cooking') {
       newStatus = 'completed';
    }

    setIsMarkingDone(queueId);
    
    // Optimistic UI Update
    if (newStatus === 'cooking') {
      setQueues(prev => prev.map(q => q.id === queueId ? { ...q, status: 'cooking' } : q));
    } else {
      setQueues(prev => prev.filter(q => q.id !== queueId));
      setActiveQueueCount(prev => Math.max(0, prev - 1));
    }

    await updateQueueStatus(queueId, newStatus);
    setIsMarkingDone(null);
    if (newStatus === 'completed') {
      toast.success('Pesanan berhasil diselesaikan!', { icon: '🎉' });
    } else if (newStatus === 'cooking') {
      toast.success('Pesanan mulai dimasak!', { icon: '🍳' });
    }
  };

  const onUpdateStoreStatusAction = async (status: 'Open' | 'Closed') => {
    setStoreStatus(status);
    await setVendorStatus(status === 'Open' ? 'open' : 'closed');
  };

  const onUpdateLocationAction = async (loc: string) => {
    setStoreLocation(loc);
    await setVendorLocation(loc);
  };

  const onSaveSettingsAction = async (name: string, location: string, slogan: string) => {
    setStoreName(name);
    setStoreLocation(location);
    setStoreSlogan(slogan);
    await updateVendorProfile(name, slogan, location, logoImage);
  };

  const onUploadLogoAction = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const publicUrl = await uploadVendorLogo(formData);
      setLogoImage(publicUrl);
      // Immediately save to database to prevent UX confusion
      await updateVendorProfile(storeName, storeSlogan, storeLocation, publicUrl);
      return publicUrl;
    } catch (err: any) {
      toast.error('Gagal mengunggah logo', { description: err.message });
      return null;
    }
  };

  const onProcessImageAction = async (file: File) => {
    // Basic compression/processing could go here if needed, or in the UI component
    const formData = new FormData();
    formData.append('image', file, 'compressed_food.jpg');
    
    const response = await fetch('/api/analyze-food', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to analyze image');
    const data = await response.json();
    return data;
  };

  const onMagicPolishAction = async (title: string) => {
    const res = await fetch('/api/magic-polish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error('Polish failed');
    const data = await res.json();
    return data.result; // contains description and hashtags
  };

  const onPublishMenuAction = async (title: string, desc: string, price: string, localUrl: string | null, category: string, file: File | null, tags: string[] = []) => {
    let uploadedUrl = undefined;
    if (file) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      try {
        uploadedUrl = await uploadMenuImage(uploadFormData);
      } catch (e: any) {
        toast.warning('Gagal upload foto ke bucket.');
      }
    }
    
    // Structure description if there are hashtags
    const structuredDescription = JSON.stringify({
      description: desc,
      hashtags: tags
    });

    await saveMenuItem(title, structuredDescription, price, uploadedUrl, category || 'Lainnya');
    await loadMenuData(); // Refresh list
  };

  const onEditMenuAction = async (id: string, name: string, price: number, category: string, desc: string, tags: string[] = [], imageUrl?: string) => {
    try {
      const fullDesc = JSON.stringify({ description: desc, hashtags: tags });
      await editMenuItem(id, name, fullDesc, price, category, imageUrl);
      setMenuItems(prev => prev.map(item => item.id === id ? { ...item, title: name, price, category, description: fullDesc, ...(imageUrl && { imageUrl }) } : item));
      toast.success('Edit berhasil disimpan ke database.');
    } catch (e: any) {
      toast.error('Gagal menyimpan edit: ' + e.message);
    }
  };

  const onDeleteMenuAction = async (id: string) => {
    try {
      await deleteMenuItem(id);
      setMenuItems(prev => prev.filter(item => item.id !== id));
      toast.success('Menu berhasil dihapus permanen.');
    } catch (e: any) {
      toast.error('Gagal menghapus menu: ' + e.message);
    }
  };

  const handleLogout = () => {
    toast.warning('Apakah Anda yakin ingin logout?', {
      action: {
        label: 'Logout',
        onClick: async () => await logout(),
      },
      duration: 5000,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <p className="text-stone-400 text-xs font-bold uppercase tracking-widest animate-pulse">Memuat Portal Mitra...</p>
      </div>
    );
  }

  // Mapper: Map Real Queue items to what VendorDashboard expects for "orders"
  const mappedOrders = queues.map(q => {
    let displayStatus = 'Menerima';
    if (q.status === 'cooking') displayStatus = 'Disiapkan';
    if (q.status === 'completed') displayStatus = 'Selesai';
    
    const parsedItems = Array.isArray(q.items_json) ? q.items_json : [];
    const mappedItems = parsedItems.map(item => ({
      title: item.title,
      imageUrl: item.imageUrl || item.image || 'https://placehold.co/100x100?text=Menu',
      size: 'Regular',
      sugarLevel: 'Normal',
      quantity: item.quantity,
      notes: item.notes
    }));

    return {
      id: `#${q.queue_number}`,
      items: mappedItems,
      status: displayStatus,
      createdAt: q.created_at,
      timeLeft: 15,
      subtotal: q.total_price || 0,
      deliveryFee: 0,
      total: q.total_price || 0,
      deliveryMethod: (() => {
        if (q.customer_name && q.customer_name.includes('|||')) {
          const parts = q.customer_name.split('|||');
          return parts[parts.length - 1];
        }
        return 'Pickup';
      })(),
      customerName: (() => {
        if (q.customer_name && q.customer_name.includes('|||')) return q.customer_name.split('|||')[0] || 'Pelanggan';
        return q.customer_name || 'Pelanggan';
      })(),
      tableNumber: q.table_number || '',
      paymentMethod: q.payment_method || 'Cash',
      paymentStatus: q.payment_status || 'Pending',
      originalId: q.id // store original UUID for actions
    };
  });

  return (
    <VendorDashboard 
      orders={mappedOrders as any}
      setOrders={setQueues as any} // Not directly used since we intercept actions
      storeName={storeName}
      setStoreName={setStoreName}
      storeStatus={storeStatus}
      setStoreStatus={setStoreStatus}
      storeLocation={storeLocation}
      setStoreLocation={setStoreLocation}
      menuItems={menuItems.map(m => {
          let desc = m.description;
          let tags: string[] = [];
          try {
             const parsed = JSON.parse(m.description);
             if (parsed.description) desc = parsed.description;
             if (parsed.hashtags) tags = parsed.hashtags;
          } catch {}
          return { id: m.id, name: m.title, description: desc, hashtags: tags, price: m.price, category: m.category, image: m.imageUrl || 'https://placehold.co/400?text=Menu' };
      }) as any}
      setMenuItems={setMenuItems as any}
      
      onViewPublicStore={() => {
          if (vendorSlug) window.open(`/${vendorSlug}`, '_blank');
      }}
      onLogout={handleLogout}

      // New action props we injected into VendorDashboard
      onUpdateStoreStatusAction={onUpdateStoreStatusAction}
      onUpdateLocationAction={onUpdateLocationAction}
      onSaveSettingsAction={onSaveSettingsAction}
      onUploadLogoAction={onUploadLogoAction}
      onProcessImageAction={onProcessImageAction}
      onMagicPolishAction={onMagicPolishAction}
      onPublishMenuAction={onPublishMenuAction}
      onEditMenuAction={onEditMenuAction}
      onDeleteMenuAction={onDeleteMenuAction}
      onAdvanceOrderAction={(displayId: string, status: string) => {
         const realOrder = mappedOrders.find(o => o.id === displayId);
         if (realOrder) {
             onAdvanceOrderAction(realOrder.originalId, status);
         }
      }}
      setActualFileToUpload={setActualFileToUpload}
      actualFileToUpload={actualFileToUpload}
      logoImage={logoImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(storeName)}&background=292524&color=fff&size=150`}
    />
  );
}
