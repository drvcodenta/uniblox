/**
 * Checkout Service — handles order creation and discount application.
 *
 * Design Decision: Business logic lives in the service layer (not controllers).
 * This makes unit testing straightforward — we can test checkout logic
 * without making HTTP requests.
 */

import { v4 as uuidv4 } from 'uuid';
import { store } from '../models/db';
import { Order } from '../models/types';
import { getCart, clearCart } from './cart.service';
import { validateAndApplyDiscount } from './discount.service';

export interface CheckoutResult {
    order: Order;
    message: string;
}

/**
 * Process checkout for a user.
 *
 * Steps:
 * 1. Verify cart is not empty
 * 2. Calculate subtotal
 * 3. If discount code provided, validate and apply it
 * 4. Create order record
 * 5. Increment global order count
 * 6. Clear the cart
 *
 * @throws Error if cart is empty or discount code is invalid.
 */
export function checkout(userId: string, discountCode?: string): CheckoutResult {
    const { items, subtotal } = getCart(userId);

    if (items.length === 0) {
        throw new Error('Cart is empty. Add items before checking out.');
    }

    let discountAmount = 0;
    let appliedCode: string | undefined;

    // Validate and apply discount if a code is provided
    if (discountCode) {
        const discountResult = validateAndApplyDiscount(discountCode);
        discountAmount = Math.round(subtotal * (discountResult.discountPercent / 100));
        appliedCode = discountCode;
    }

    const total = subtotal - discountAmount;

    // Create the order record
    const order: Order = {
        id: uuidv4(),
        userId,
        items: [...items], // Snapshot of cart items at time of purchase
        subtotal,
        discountCode: appliedCode,
        discountAmount,
        total,
        createdAt: new Date(),
    };

    // Persist order and increment global counter
    store.orders.push(order);
    store.orderCount += 1;

    // Clear the cart after successful checkout
    clearCart(userId);

    return {
        order,
        message: discountAmount > 0
            ? `Order placed! You saved ${discountAmount} with code "${appliedCode}".`
            : 'Order placed successfully!',
    };
}
