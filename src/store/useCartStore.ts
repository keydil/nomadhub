import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  title: string;
  price: string | number;
  imageUrl?: string;
  quantity: number;
  vendorId: string;
  size?: string;
  sugarLevel?: string;
  notes?: string;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateNotes: (id: string, notes: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (newItem) => {
        const items = get().items;
        
        // Safety check: if adding an item from a different vendor, clear the cart first
        if (items.length > 0 && items[0].vendorId !== newItem.vendorId) {
          set({ items: [{ ...newItem, quantity: 1 }] });
          return;
        }

        const existingItem = items.find((item) => item.id === newItem.id);
        
        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...items, { ...newItem, quantity: 1 }] });
        }
      },
      
      removeFromCart: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      updateNotes: (id, notes) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, notes } : item
          ),
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          // Clean price string (remove separators) to convert to number
          const priceNum = parseInt(String(item.price).replace(/[^\d]/g, '')) || 0;
          return total + (priceNum * item.quantity);
        }, 0);
      },
    }),
    {
      name: 'nomadhub-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
