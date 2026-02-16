/**
 * Core TypeScript interfaces for the ecommerce store.
 * These define the shape of all data stored in-memory.
 */

export interface Product {
    id: string;
    name: string;
    price: number; // Price in smallest currency unit (e.g., cents) to avoid floating point issues
}

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Cart {
    userId: string;
    items: CartItem[];
}

export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    subtotal: number;
    discountCode?: string;
    discountAmount: number;
    total: number;
    createdAt: Date;
}

export interface DiscountCode {
    code: string;
    discountPercent: number;
    status: 'unused' | 'used';
    createdAt: Date;
    usedAt?: Date;
}

/**
 * Store configuration for the discount system.
 * nthOrder: Every nth order is eligible for a discount code.
 * discountPercent: The percentage discount that generated codes provide.
 */
export interface StoreConfig {
    nthOrder: number;
    discountPercent: number;
}
