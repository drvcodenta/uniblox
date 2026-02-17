/**
 * API helper for making requests to the Express backend.
 * In development, Vite's proxy forwards these to localhost:3000.
 */

export interface Product {
    id: string;
    name: string;
    price: number;
}

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    subtotal: number;
    discountCode?: string;
    discountAmount: number;
    total: number;
    createdAt: string;
}

export interface CheckoutResult {
    order: Order;
    message: string;
}

export interface StoreStats {
    totalItemsPurchased: number;
    totalRevenue: number;
    totalDiscountAmount: number;
    totalOrders: number;
    discountCodes: {
        total: number;
        used: number;
        unused: number;
        codes: Array<{
            code: string;
            discountPercent: number;
            status: 'used' | 'unused';
            createdAt: string;
            usedAt?: string;
        }>;
    };
}

const API_BASE = '';

export async function fetchProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
}

export async function addToCartAPI(userId: string, productId: string, quantity: number) {
    const res = await fetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, quantity }),
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add to cart');
    }
    return res.json();
}

export async function fetchCart(userId: string) {
    const res = await fetch(`${API_BASE}/cart/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch cart');
    return res.json();
}

export async function checkoutAPI(userId: string, discountCode?: string): Promise<CheckoutResult> {
    const res = await fetch(`${API_BASE}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, discountCode }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Checkout failed');
    return data;
}

export async function generateDiscount() {
    const res = await fetch(`${API_BASE}/admin/generate-discount`, { method: 'POST' });
    return res.json();
}

export async function fetchStats(): Promise<StoreStats> {
    const res = await fetch(`${API_BASE}/admin/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
}

/** Format price from cents to dollars */
export function formatPrice(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
}
