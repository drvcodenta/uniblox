/**
 * Unit tests for the Discount Service.
 *
 * Tests cover:
 * - Generating discount codes on nth-order milestones
 * - Rejecting generation when condition is not met
 * - Validating and applying unused codes
 * - Rejecting used or invalid codes
 * - Preventing duplicate generation for the same milestone
 */

import { generateDiscountCode, validateAndApplyDiscount, getAllDiscountCodes } from '../services/discount.service';
import { store, resetStore } from '../models/db';

// Reset store before each test to ensure isolation
beforeEach(() => {
    resetStore();
});

describe('Discount Service', () => {
    describe('generateDiscountCode', () => {
        it('should NOT generate a code when orderCount is 0', () => {
            store.orderCount = 0;
            const result = generateDiscountCode();
            expect(result).toBeNull();
        });

        it('should generate a code when orderCount is a multiple of nthOrder', () => {
            store.config.nthOrder = 5;
            store.orderCount = 5;

            const result = generateDiscountCode();

            expect(result).not.toBeNull();
            expect(result!.status).toBe('unused');
            expect(result!.discountPercent).toBe(store.config.discountPercent);
            expect(result!.code).toHaveLength(8); // UUID slice
        });

        it('should NOT generate a code when orderCount is NOT a multiple of nthOrder', () => {
            store.config.nthOrder = 5;
            store.orderCount = 3;

            const result = generateDiscountCode();
            expect(result).toBeNull();
        });

        it('should generate codes for successive milestones (5th, 10th order)', () => {
            store.config.nthOrder = 5;

            // 5th order
            store.orderCount = 5;
            const first = generateDiscountCode();
            expect(first).not.toBeNull();

            // 10th order
            store.orderCount = 10;
            const second = generateDiscountCode();
            expect(second).not.toBeNull();
            expect(second!.code).not.toBe(first!.code); // Unique codes
        });

        it('should NOT generate duplicate codes for the same milestone', () => {
            store.config.nthOrder = 5;
            store.orderCount = 5;

            const first = generateDiscountCode();
            expect(first).not.toBeNull();

            // Calling again at the same milestone should return null
            const duplicate = generateDiscountCode();
            expect(duplicate).toBeNull();
        });
    });

    describe('validateAndApplyDiscount', () => {
        it('should validate and apply an unused discount code', () => {
            store.config.nthOrder = 5;
            store.orderCount = 5;

            const discount = generateDiscountCode()!;
            const result = validateAndApplyDiscount(discount.code);

            expect(result.discountPercent).toBe(store.config.discountPercent);
            expect(result.code).toBe(discount.code);
            // Verify it's now marked as used
            expect(discount.status).toBe('used');
            expect(discount.usedAt).toBeDefined();
        });

        it('should throw an error for an invalid code', () => {
            expect(() => {
                validateAndApplyDiscount('FAKECODE');
            }).toThrow('Invalid discount code');
        });

        it('should throw an error for an already-used code', () => {
            store.config.nthOrder = 5;
            store.orderCount = 5;

            const discount = generateDiscountCode()!;
            // Use it once
            validateAndApplyDiscount(discount.code);

            // Try to use it again
            expect(() => {
                validateAndApplyDiscount(discount.code);
            }).toThrow('already been used');
        });
    });

    describe('getAllDiscountCodes', () => {
        it('should return empty array when no codes exist', () => {
            const codes = getAllDiscountCodes();
            expect(codes).toHaveLength(0);
        });

        it('should return all generated codes with correct statuses', () => {
            store.config.nthOrder = 5;

            // Generate two codes
            store.orderCount = 5;
            const first = generateDiscountCode()!;
            store.orderCount = 10;
            const second = generateDiscountCode()!;

            // Use first code
            validateAndApplyDiscount(first.code);

            const codes = getAllDiscountCodes();
            expect(codes).toHaveLength(2);
            expect(codes.find(c => c.code === first.code)!.status).toBe('used');
            expect(codes.find(c => c.code === second.code)!.status).toBe('unused');
        });
    });
});
