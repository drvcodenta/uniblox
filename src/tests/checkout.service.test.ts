/**
 * Unit tests for the Checkout Service.
 *
 * Tests cover:
 * - Successful checkout with correct total calculation
 * - Checkout with valid discount code
 * - Checkout with invalid/used discount code
 * - Empty cart rejection
 * - Order count increment
 * - Cart clearing after checkout
 */

import { checkout } from '../services/checkout.service';
import { addToCart, getCart } from '../services/cart.service';
import { generateDiscountCode } from '../services/discount.service';
import { store, resetStore } from '../models/db';

// Reset store before each test to ensure isolation
beforeEach(() => {
    resetStore();
});

describe('Checkout Service', () => {
    // Helper to set up a cart with items
    function setupCart(userId: string): void {
        addToCart(userId, 'p1', 2);  // Wireless Mouse x2 = 5998
        addToCart(userId, 'p3', 1);  // USB-C Hub x1     = 4999
    }

    describe('Basic checkout', () => {
        it('should create an order with correct total', () => {
            setupCart('user1');
            const result = checkout('user1');

            expect(result.order.subtotal).toBe(2 * 2999 + 4999); // 10997
            expect(result.order.discountAmount).toBe(0);
            expect(result.order.total).toBe(10997);
            expect(result.order.userId).toBe('user1');
            expect(result.order.items).toHaveLength(2);
        });

        it('should increment the global order count', () => {
            setupCart('user1');
            expect(store.orderCount).toBe(0);

            checkout('user1');
            expect(store.orderCount).toBe(1);

            // Another user checks out
            setupCart('user2');
            checkout('user2');
            expect(store.orderCount).toBe(2);
        });

        it('should clear the cart after checkout', () => {
            setupCart('user1');
            checkout('user1');

            const cart = getCart('user1');
            expect(cart.items).toHaveLength(0);
            expect(cart.subtotal).toBe(0);
        });

        it('should store the order in the orders array', () => {
            setupCart('user1');
            const result = checkout('user1');

            expect(store.orders).toHaveLength(1);
            expect(store.orders[0].id).toBe(result.order.id);
        });
    });

    describe('Checkout with discount', () => {
        it('should apply a valid discount code', () => {
            // Make 5 orders to become eligible for discount
            for (let i = 0; i < 5; i++) {
                setupCart(`temp-user-${i}`);
                checkout(`temp-user-${i}`);
            }

            // Generate discount code (5th order = eligible)
            const discount = generateDiscountCode()!;
            expect(discount).not.toBeNull();

            // Use the discount on the next order
            setupCart('discount-user');
            const result = checkout('discount-user', discount.code);

            const expectedSubtotal = 2 * 2999 + 4999; // 10997
            const expectedDiscount = Math.round(expectedSubtotal * (store.config.discountPercent / 100));

            expect(result.order.subtotal).toBe(expectedSubtotal);
            expect(result.order.discountAmount).toBe(expectedDiscount);
            expect(result.order.total).toBe(expectedSubtotal - expectedDiscount);
            expect(result.order.discountCode).toBe(discount.code);
        });

        it('should reject an invalid discount code', () => {
            setupCart('user1');

            expect(() => {
                checkout('user1', 'INVALIDCODE');
            }).toThrow('Invalid discount code');
        });

        it('should reject an already-used discount code', () => {
            // Generate valid code
            for (let i = 0; i < 5; i++) {
                setupCart(`temp-user-${i}`);
                checkout(`temp-user-${i}`);
            }
            const discount = generateDiscountCode()!;

            // Use it once
            setupCart('first-user');
            checkout('first-user', discount.code);

            // Try to use it again
            setupCart('second-user');
            expect(() => {
                checkout('second-user', discount.code);
            }).toThrow('already been used');
        });
    });

    describe('Edge cases', () => {
        it('should throw an error when cart is empty', () => {
            expect(() => {
                checkout('empty-cart-user');
            }).toThrow('Cart is empty');
        });

        it('should handle multiple items with same product (quantity increment)', () => {
            addToCart('user1', 'p1', 1);
            addToCart('user1', 'p1', 2); // Should increment to 3

            const result = checkout('user1');
            expect(result.order.items).toHaveLength(1);
            expect(result.order.items[0].quantity).toBe(3);
            expect(result.order.subtotal).toBe(3 * 2999); // 8997
        });
    });
});
