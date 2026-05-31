export interface MenuItem {
    id: string;
    name: string;
    description: string;
    hashtags?: string[];
    price: number;
    category: string;
    image: string;
    rating?: number;
    isTopPick?: boolean;
}

export interface CartItem {
    id: string; // Unique instance ID (e.g. itemId + size + notes)
    title: string;
    price: string | number;
    imageUrl?: string;
    quantity: number;
    vendorId: string;
    size?: string;
    sugarLevel?: string;
    notes?: string;
}

export type OrderStatus = 'Menerima' | 'Disiapkan' | 'Diantar' | 'Selesai';

export interface OrderState {
    id: string;
    items: CartItem[];
    status: OrderStatus;
    createdAt: string;
    timeLeft: number; // seconds remaining
    subtotal: number;
    deliveryFee: number;
    total: number;
    deliveryMethod: 'Pickup' | 'Delivery';
    tableNumber?: string;
    paymentMethod?: string;
    paymentStatus?: string;
}

export interface Voucher {
    id: string;
    title: string;
    description: string;
    pointsCost: number;
    icon: string;
    code: string;
}
