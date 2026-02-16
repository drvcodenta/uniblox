/**
 * Checkout Controller — maps HTTP requests to checkout service.
 */

import { Request, Response } from 'express';
import { checkout } from '../services/checkout.service';

/**
 * POST /checkout
 * Body: { userId: string, discountCode?: string }
 */
export function handleCheckout(req: Request, res: Response): void {
    try {
        const { userId, discountCode } = req.body;

        if (!userId) {
            res.status(400).json({ error: 'Missing required field: userId' });
            return;
        }

        const result = checkout(userId, discountCode);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}
