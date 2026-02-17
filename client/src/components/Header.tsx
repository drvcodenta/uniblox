/**
 * Header — fixed top nav with store name and cart badge.
 * Minimalist design: bold uppercase name, pill-shaped cart counter.
 */

import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Header() {
    const { itemCount, toggleCart } = useStore();
    const location = useLocation();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Store Name */}
                <Link to="/" className="text-lg font-bold tracking-tighter uppercase">
                    UNIBLOX
                </Link>

                {/* Navigation + Cart */}
                <div className="flex items-center gap-8">
                    <nav className="flex items-center gap-6 text-sm">
                        <Link
                            to="/"
                            className={`transition-colors duration-200 ${location.pathname === '/' ? 'text-primary font-medium' : 'text-muted hover:text-primary'
                                }`}
                        >
                            Shop
                        </Link>
                        <Link
                            to="/admin"
                            className={`transition-colors duration-200 ${location.pathname === '/admin' ? 'text-primary font-medium' : 'text-muted hover:text-primary'
                                }`}
                        >
                            Admin
                        </Link>
                    </nav>

                    {/* Cart Button */}
                    <button
                        onClick={() => toggleCart()}
                        className="btn-press relative flex items-center gap-2 text-sm font-medium"
                        aria-label={`Cart with ${itemCount} items`}
                    >
                        <ShoppingBag size={18} strokeWidth={1.5} />
                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-3 bg-primary text-bg text-[10px] font-semibold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                                {itemCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}
