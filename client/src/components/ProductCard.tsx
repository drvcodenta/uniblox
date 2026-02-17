import { useState } from 'react';
import { Plus } from 'lucide-react';
import { type Product, formatPrice } from '../lib/api';
import { useStore } from '../context/StoreContext';
import productImages from '../lib/productImages';

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    const { addToCart } = useStore();
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = async () => {
        setIsAdding(true);
        await addToCart(product);
        setIsAdding(false);
    };

    const image = productImages[product.id];

    return (
        <div className="group relative">
            {/* Product Image */}
            <div className="aspect-square bg-surface rounded-sm overflow-hidden mb-3">
                {image ? (
                    <img
                        src={image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-light text-border">
                        {product.name.charAt(0)}
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div>
                <h3 className="text-sm font-medium">{product.name}</h3>
                <p className="text-sm text-muted mt-0.5">{formatPrice(product.price)}</p>
            </div>

            {/* Add to Cart — visible on hover */}
            <button
                onClick={handleAdd}
                disabled={isAdding}
                className="btn-press absolute bottom-0 right-0 bg-primary text-bg p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                aria-label={`Add ${product.name} to cart`}
            >
                <Plus size={14} strokeWidth={2} />
            </button>
        </div>
    );
}
