/**
 * ProductCard — individual product with hover interactions.
 * Hover: subtle image scale (1.02), "Add to Cart" fades in.
 * Click triggers ghost toast via StoreContext.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { type Product, formatPrice } from '../lib/api';
import { useStore } from '../context/StoreContext';

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    const { addToCart } = useStore();
    const [isHovered, setIsHovered] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = async () => {
        setIsAdding(true);
        await addToCart(product);
        setIsAdding(false);
    };

    return (
        <motion.div
            className="group relative cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            layout
        >
            {/* Product Image Placeholder */}
            <motion.div
                className="aspect-square bg-surface rounded-sm overflow-hidden mb-3 flex items-center justify-center"
                animate={{ scale: isHovered ? 1.02 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
                <span className="text-4xl font-light text-border select-none">
                    {product.name.charAt(0)}
                </span>
            </motion.div>

            {/* Product Info */}
            <div className="flex items-start justify-between gap-2">
                <div>
                    <h3 className="text-sm font-medium leading-tight">{product.name}</h3>
                    <p className="text-sm text-muted mt-0.5">{formatPrice(product.price)}</p>
                </div>
            </div>

            {/* Add to Cart — fades in on hover */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.15 }}
                onClick={handleAdd}
                disabled={isAdding}
                className="btn-press absolute bottom-0 right-0 bg-primary text-bg p-2 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                aria-label={`Add ${product.name} to cart`}
            >
                <Plus size={14} strokeWidth={2} />
            </motion.button>
        </motion.div>
    );
}
