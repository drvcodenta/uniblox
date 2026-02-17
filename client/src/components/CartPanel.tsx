import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatPrice, addToCartAPI } from '../lib/api';
import productImages from '../lib/productImages';

export default function CartPanel() {
    const { state, toggleCart, userId, removeFromCart, refreshCart } = useStore();
    const navigate = useNavigate();

    const handleIncrement = async (productId: string) => {
        await addToCartAPI(userId, productId, 1);
        await refreshCart();
    };

    const handleDecrement = async (productId: string) => {
        await removeFromCart(productId);
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
                        className="fixed inset-0 bg-black/30 z-[60]"
                        onClick={() => toggleCart(false)}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-[420px] bg-white z-[70] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <h2 className="text-base font-semibold">Cart</h2>
                            <button onClick={() => toggleCart(false)} className="p-1 hover:opacity-60 transition-opacity">
                                <X size={20} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto">
                            {state.items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                                    <ShoppingBag size={40} strokeWidth={1} />
                                    <p className="text-sm">Your cart is empty</p>
                                </div>
                            ) : (
                                <ul>
                                    {state.items.map((item) => (
                                        <li key={item.productId} className="flex gap-4 px-6 py-4 border-b border-gray-50">
                                            {/* Thumbnail */}
                                            <div className="w-16 h-16 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                                                {productImages[item.productId] ? (
                                                    <img
                                                        src={productImages[item.productId]}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">
                                                        {item.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{item.name}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{formatPrice(item.price)}</p>

                                                {/* Quantity controls */}
                                                <div className="flex items-center gap-3 mt-2">
                                                    <button
                                                        onClick={() => handleDecrement(item.productId)}
                                                        className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleIncrement(item.productId)}
                                                        className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Line total */}
                                            <div className="text-sm font-medium self-start pt-0.5">
                                                {formatPrice(item.price * item.quantity)}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Footer */}
                        {state.items.length > 0 && (
                            <div className="border-t border-gray-100 px-6 py-5">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm text-gray-500">Subtotal</span>
                                    <span className="text-lg font-semibold">{formatPrice(state.subtotal)}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-black text-white py-3 text-sm font-semibold uppercase tracking-wider rounded hover:bg-gray-900 transition-colors"
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
