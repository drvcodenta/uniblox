/**
 * Discount Service — handles discount code generation, validation, and application.
 *
 * Design Decision: Discount codes use a status flag ('used' | 'unused') instead
 * of being deleted after use. This makes analytics (total generated vs used) easy.
 */

import { v4 as uuidv4 } from 'uuid';
import { store } from '../models/db';
import { DiscountCode } from '../models/types';

export interface DiscountValidationResult {
    discountPercent: number;
    code: string;
}

/**
 * Generate a discount code if the current order count is eligible.
 * Eligibility: orderCount > 0 AND orderCount % nthOrder === 0.
 *
 * The admin calls this endpoint to check if a discount should be issued.
 *
 * @returns The generated discount code, or null if not eligible.
 */
export function generateDiscountCode(): DiscountCode | null {
    const { orderCount, config } = store;

    // Check if current order count qualifies for a discount
    if (orderCount === 0 || orderCount % config.nthOrder !== 0) {
        return null;
    }

    // Prevent duplicate generation for the same order count milestone
    // by checking if we already generated a code for this count
    const alreadyGenerated = store.discountCodes.some(
        (_code, _index) => store.discountCodes.length > 0 &&
            Math.floor(store.orderCount / config.nthOrder) <= store.discountCodes.length
    );

    // Simpler duplicate check: count how many codes should exist vs how many do
    const expectedCodeCount = Math.floor(orderCount / config.nthOrder);
    if (store.discountCodes.length >= expectedCodeCount) {
        return null; // Already generated for this milestone
    }

    const discount: DiscountCode = {
        code: uuidv4().slice(0, 8).toUpperCase(), // Short, readable code
        discountPercent: config.discountPercent,
        status: 'unused',
        createdAt: new Date(),
    };

    store.discountCodes.push(discount);
    return discount;
}

/**
 * Validate a discount code and mark it as used.
 *
 * @throws Error if the code is invalid or already used.
 */
export function validateAndApplyDiscount(code: string): DiscountValidationResult {
    const discount = store.discountCodes.find(d => d.code === code);

    if (!discount) {
        throw new Error(`Invalid discount code: "${code}"`);
    }

    if (discount.status === 'used') {
        throw new Error(`Discount code "${code}" has already been used.`);
    }

    // Mark as used
    discount.status = 'used';
    discount.usedAt = new Date();

    return {
        discountPercent: discount.discountPercent,
        code: discount.code,
    };
}

/**
 * Get all discount codes (for admin analytics).
 */
export function getAllDiscountCodes(): DiscountCode[] {
    return store.discountCodes;
}
