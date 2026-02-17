/**
 * Checkout Page — order summary, discount code input, and checkout flow.
 * Features:
 * - Cart summary with line items
 * - Discount code input with live validation
 * - Nth-order progress indicator
 * - Animated total on discount apply
 * - Monochrome confetti on success
 */

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Tag, Check, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { checkoutAPI, fetchStats, formatPrice } from '../lib/api';
import Confetti from '../components/Confetti';

export default function Checkout() {
    const { state, userId, clearCart, refreshCart } = useStore();
    const [discountCode, setDiscountCode] = useState('');
    const [discountError, setDiscountError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [orderResult, setOrderResult] = useState<any>(null);
    const [ordersAway, setOrdersAway] = useState<number | null>(null);

    // Fetch nth-order progress on mount
    useEffect(() => {
        refreshCart();
        fetchStats()
            .then((stats) => {
                // Calculate how many orders away from next discount
                const totalOrders = stats.totalOrders;
                const nthOrder = 5; // Default — ideally fetched from config
                const nextMilestone = Math.ceil((totalOrders + 1) / nthOrder) * nthOrder;
                setOrdersAway(nextMilestone - totalOrders);
            })
            .catch(() => { }); // Silently fail if backend is down
    }, [refreshCart]);

    const handleCheckout = useCallback(async () => {
        setIsProcessing(true);
        setDiscountError('');

        try {
            const result = await checkoutAPI(userId, discountCode || undefined);
            setOrderResult(result);
            setShowConfetti(true);
            clearCart();
        } catch (err: any) {
            setDiscountError(err.message);
        } finally {
            setIsProcessing(false);
        }
    }, [userId, discountCode, clearCart]);

    // Success state
    if (orderResult) {
        return (
            <>
                <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
                <div className="max-w-lg mx-auto px-6 py-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    >
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check size={28} className="text-bg" strokeWidth={2} />
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tighter mb-2">Order Confirmed</h1>
                        <p className="text-muted text-sm mb-6">{orderResult.message}</p>

                        <div className="bg-surface border border-border rounded-sm p-6 text-left space-y-3 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted">Order ID</span>
                                <span className="font-mono text-xs">{orderResult.order.id}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted">Subtotal</span>
                                <span>{formatPrice(orderResult.order.subtotal)}</span>
                            </div>
                            {orderResult.order.discountAmount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">Discount</span>
                                    <span className="text-primary font-medium">
                                        −{formatPrice(orderResult.order.discountAmount)}
                                    </span>
                                </div>
                            )}
                            <div className="border-t border-border pt-3 flex justify-between">
                                <span className="font-semibold">Total</span>
                                <span className="text-lg font-semibold tracking-tight">
                                    {formatPrice(orderResult.order.total)}
                                </span>
                            </div>
                        </div>

                        <Link
                            to="/"
                            className="btn-press inline-flex items-center gap-2 bg-primary text-bg px-6 py-3 text-sm font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
                        >
                            Continue Shopping
                        </Link>
                    </motion.div>
                </div>
            </>
        );
    }

    // Empty cart
    if (state.items.length === 0) {
        return (
            <div className="max-w-lg mx-auto px-6 py-24 text-center">
                <h1 className="text-2xl font-semibold tracking-tighter mb-2">Your Cart is Empty</h1>
                <p className="text-muted text-sm mb-6">Add some items before checking out.</p>
                <Link
                    to="/"
                    className="btn-press inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-primary transition-colors"
                >
                    <ArrowLeft size={14} />
                    Back to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            {/* Back link */}
            <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-8"
            >
                <ArrowLeft size={14} />
                Back to Shop
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                {/* Order Summary — Left */}
                <div className="lg:col-span-3">
                    <h1 className="text-2xl font-semibold tracking-tighter mb-6">Order Summary</h1>

                    <ul className="divide-y divide-border">
                        {state.items.map((item) => (
                            <li key={item.productId} className="flex items-center justify-between py-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-surface rounded-sm flex items-center justify-center text-lg font-light text-border">
                                        {item.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{item.name}</p>
                                        <p className="text-xs text-muted">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Checkout Panel — Right */}
                <div className="lg:col-span-2">
                    <div className="sticky top-24 space-y-6">
                        {/* Nth-order progress */}
                        {ordersAway !== null && ordersAway > 0 && (
                            <p className="text-xs text-muted/60">
                                You are {ordersAway} order{ordersAway !== 1 ? 's' : ''} away from a 10% privilege.
                            </p>
                        )}

                        {/* Discount Code Input */}
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wider text-muted block mb-2">
                                Discount Code
                            </label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                    <input
                                        type="text"
                                        value={discountCode}
                                        onChange={(e) => {
                                            setDiscountCode(e.target.value.toUpperCase());
                                            setDiscountError('');
                                        }}
                                        placeholder="Enter code"
                                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-transparent border border-border outline-none focus:border-primary transition-colors placeholder:text-muted/40"
                                    />
                                </div>
                            </div>
                            {discountError && (
                                <p className="text-xs text-danger mt-1.5">{discountError}</p>
                            )}
                        </div>

                        {/* Totals */}
                        <div className="space-y-2 pt-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted">Subtotal</span>
                                <span>{formatPrice(state.subtotal)}</span>
                            </div>
                            <div className="border-t border-border pt-3 flex justify-between">
                                <span className="font-semibold">Total</span>
                                <motion.span
                                    key={state.subtotal}
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xl font-semibold tracking-tight"
                                >
                                    {formatPrice(state.subtotal)}
                                </motion.span>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <button
                            onClick={handleCheckout}
                            disabled={isProcessing}
                            className="btn-press w-full bg-primary text-bg py-3.5 text-sm font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Processing
                                </>
                            ) : (
                                'Place Order'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
