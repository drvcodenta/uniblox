/**
 * Admin Controller — handles admin-only operations.
 * 1. Generate discount codes (if nth order condition is met)
 * 2. View store analytics/stats
 */

import { Request, Response } from 'express';
import { generateDiscountCode, getAllDiscountCodes } from '../services/discount.service';
import { store } from '../models/db';

/**
 * POST /admin/generate-discount
 * Generates a discount code if the current order count qualifies.
 */
export function handleGenerateDiscount(_req: Request, res: Response): void {
    try {
        const discount = generateDiscountCode();

        if (!discount) {
            res.status(200).json({
                message: 'No discount code generated. Condition not met.',
                orderCount: store.orderCount,
                nthOrder: store.config.nthOrder,
                hint: `Next eligible at order #${Math.ceil((store.orderCount + 1) / store.config.nthOrder) * store.config.nthOrder}`,
            });
            return;
        }

        res.status(201).json({
            message: 'Discount code generated!',
            discount,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * GET /admin/stats
 * Returns aggregated store analytics:
 * - Total items purchased
 * - Total revenue (after discounts)
 * - Total discount amount given
 * - All discount codes with their statuses
 */
export function handleGetStats(_req: Request, res: Response): void {
    try {
        const orders = store.orders;
        const discountCodes = getAllDiscountCodes();

        // Aggregate analytics from all orders
        const totalItemsPurchased = orders.reduce(
            (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
            0
        );

        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const totalDiscountAmount = orders.reduce((sum, order) => sum + order.discountAmount, 0);

        const totalCodesGenerated = discountCodes.length;
        const totalCodesUsed = discountCodes.filter(dc => dc.status === 'used').length;

        res.status(200).json({
            totalItemsPurchased,
            totalRevenue,
            totalDiscountAmount,
            totalOrders: orders.length,
            discountCodes: {
                total: totalCodesGenerated,
                used: totalCodesUsed,
                unused: totalCodesGenerated - totalCodesUsed,
                codes: discountCodes,
            },
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
