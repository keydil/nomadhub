import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QueueState {
  activeQueueId: string | null;
  queueNumber: number | null;
  vendorId: string | null;
  customerName: string | null;
  deliveryMethod: 'Delivery' | 'Pickup' | null;
  status: 'waiting' | 'cooking' | 'completed' | 'cancelled' | null;
  totalPrice: number | null;
  items: any[] | null;
  paymentMethod: string | null;
  paymentStatus: string | null;
  tableNumber: string | null;
  
  // Actions
  setActiveQueue: (data: { 
    id: string; 
    queue_number: number; 
    vendor_id: string; 
    customer_name: string; 
    status: 'waiting' | 'cooking' | 'completed' | 'cancelled'; 
    total_price?: number; 
    items_json?: any[];
    payment_method?: string;
    payment_status?: string;
    table_number?: string;
  }) => void;
  updateStatus: (status: 'waiting' | 'cooking' | 'completed' | 'cancelled') => void;
  clearQueue: () => void;
}

export const useQueueStore = create<QueueState>()(
  persist(
    (set) => ({
      activeQueueId: null,
      queueNumber: null,
      vendorId: null,
      customerName: null,
      deliveryMethod: null,
      status: null,
      totalPrice: null,
      items: null,
      paymentMethod: null,
      paymentStatus: null,
      tableNumber: null,

      setActiveQueue: (data) => {
        let name = data.customer_name;
        let method: 'Delivery' | 'Pickup' = 'Pickup';
        if (name && name.includes('|||')) {
            const parts = name.split('|||');
            name = parts[0];
            method = parts[parts.length - 1] as 'Delivery' | 'Pickup';
        }
        set({
            activeQueueId: data.id,
            queueNumber: data.queue_number,
            vendorId: data.vendor_id,
            customerName: name,
            deliveryMethod: method,
            status: data.status,
            totalPrice: data.total_price || 0,
            items: data.items_json || [],
            paymentMethod: data.payment_method || 'Cash',
            paymentStatus: data.payment_status || 'Pending',
            tableNumber: data.table_number || '',
        });
      },

      updateStatus: (status) => set({ status }),

      clearQueue: () => set({
        activeQueueId: null,
        queueNumber: null,
        vendorId: null,
        customerName: null,
        deliveryMethod: null,
        status: null,
      }),
    }),
    {
      name: 'nomadhub-queue-storage',
    }
  )
);
