/**
 * Shop Page — product catalog grid.
 * Fetches products from backend and displays in a 3-column grid.
 */

import { useState, useEffect } from 'react';
import { fetchProducts, type Product } from '../lib/api';
import ProductCard from '../components/ProductCard';
import CartPanel from '../components/CartPanel';
import Toast from '../components/Toast';

export default function Shop() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts()
            .then(setProducts)
            .catch(() => {
                // Fallback to hardcoded products if backend is down
                setProducts([
                    { id: 'p1', name: 'Wireless Mouse', price: 2999 },
                    { id: 'p2', name: 'Mechanical Keyboard', price: 7999 },
                    { id: 'p3', name: 'USB-C Hub', price: 4999 },
                    { id: 'p4', name: 'Monitor Stand', price: 3499 },
                    { id: 'p5', name: 'Webcam HD', price: 5999 },
                ]);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Page Header */}
                <div className="mb-12">
                    <h1 className="text-3xl font-semibold tracking-tighter">All Products</h1>
                    <p className="text-muted text-sm mt-1">Curated essentials for your workspace</p>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="space-y-3 animate-pulse">
                                <div className="aspect-square bg-surface rounded-sm" />
                                <div className="h-4 bg-surface rounded w-2/3" />
                                <div className="h-3 bg-surface rounded w-1/4" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>

            <CartPanel />
            <Toast />
        </>
    );
}
