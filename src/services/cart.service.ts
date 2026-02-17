/**
 * Cart Service — handles all cart business logic.
 *
 * Design Decision: Cart is stored as a Map<userId, CartItem[]> in memory.
 * This allows easy per-user cart management without sessions or cookies,
 * which makes API testing via Postman/curl straightforward.
 */

import { store } from '../models/db';
import { CartItem, Product } from '../models/types';

/**
 * Add an item to the user's cart.
 * If the product already exists in the cart, increment its quantity.
 *
 * @throws Error if the product doesn't exist in the store.
 */
export function addToCart(userId: string, productId: string, quantity: number): CartItem[] {
    // Validate product exists
    const product: Product | undefined = store.products.find(p => p.id === productId);
    if (!product) {
        throw new Error(`Product not found: ${productId}`);
    }

    if (quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
    }

    // Get or create cart for this user
    let cart = store.carts.get(userId);
    if (!cart) {
        cart = [];
        store.carts.set(userId, cart);
    }

    // Check if item already in cart — if so, increment quantity
    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
        });
    }

    return cart;
}

/**
 * Retrieve the user's cart with line totals.
 */
export function getCart(userId: string): { items: CartItem[]; subtotal: number } {
    const items = store.carts.get(userId) || [];
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { items, subtotal };
}

/**
 * Remove one unit of an item from the user's cart.
 * If quantity reaches 0, the item is removed entirely.
 */
export function removeFromCart(userId: string, productId: string): CartItem[] {
    const cart = store.carts.get(userId);
    if (!cart) return [];

    const index = cart.findIndex(item => item.productId === productId);
    if (index === -1) return cart;

    cart[index].quantity -= 1;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    return cart;
}

/**
 * Clear the user's cart (called after successful checkout).
 */
export function clearCart(userId: string): void {
    store.carts.delete(userId);
}
