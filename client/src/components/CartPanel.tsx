/**
 * CartPanel — slide-over cart from the right.
 * Uses Framer Motion AnimatePresence for smooth entry/exit.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatPrice, addToCartAPI, fetchCart } from '../lib/api';

export default function CartPanel() {
    const { state, toggleCart, userId } = useStore();
    const navigate = useNavigate();

    const handleQuantityChange = async (productId: string, delta: number) => {
        if (delta > 0) {
            await addToCartAPI(userId, productId, 1);
        }
        // Note: backend doesn't have a remove endpoint yet, but add works for increment
        const data = await fetchCart(userId);
        // We'd need to dispatch here, but for now just refresh
        window.location.reload(); // Simple approach for demo
    };

    const handleCheckout = () => {
        toggleCart(false);
        navigate('/checkout');
    };

    return (
        <AnimatePresence>
            {state.isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/20 z-50"
                        onClick={() => toggleCart(false)}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-bg z-50 border-l border-border flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 h-16 border-b border-border">
                            <h2 className="text-sm font-semibold uppercase tracking-wider">Cart</h2>
                            <button
                                onClick={() => toggleCart(false)}
                                className="btn-press p-1"
                                aria-label="Close cart"
                            >
                                <X size={18} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {state.items.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-muted text-sm">
                                    Your cart is empty
                                </div>
                            ) : (
                                <ul className="space-y-4">
                                    {state.items.map((item) => (
                                        <li key={item.productId} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{item.name}</p>
                                                <p className="text-xs text-muted mt-0.5">
                                                    {formatPrice(item.price)} × {item.quantity}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center border border-border rounded">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.productId, -1)}
                                                        className="btn-press p-1.5 text-muted hover:text-primary transition-colors"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.productId, 1)}
                                                        className="btn-press p-1.5 text-muted hover:text-primary transition-colors"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                                <span className="text-sm font-medium w-16 text-right">
                                                    {formatPrice(item.price * item.quantity)}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Footer */}
                        {state.items.length > 0 && (
                            <div className="border-t border-border px-6 py-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted">Subtotal</span>
                                    <span className="text-lg font-semibold tracking-tight">
                                        {formatPrice(state.subtotal)}
                                    </span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="btn-press w-full bg-primary text-bg py-3 text-sm font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
                                >
                                    Checkout
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
