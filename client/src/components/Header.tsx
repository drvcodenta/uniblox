import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Header() {
    const { itemCount, toggleCart } = useStore();
    const location = useLocation();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                <Link to="/" className="text-lg font-bold tracking-tight">
                    UNIBLOX
                </Link>

                <div className="flex items-center gap-6">
                    <nav className="flex items-center gap-5 text-sm">
                        <Link
                            to="/"
                            className={location.pathname === '/'
                                ? 'text-black font-medium'
                                : 'text-gray-400 hover:text-black transition-colors'}
                        >
                            Shop
                        </Link>
                        <Link
                            to="/admin"
                            className={location.pathname === '/admin'
                                ? 'text-black font-medium'
                                : 'text-gray-400 hover:text-black transition-colors'}
                        >
                            Admin
                        </Link>
                    </nav>

                    <button
                        onClick={() => toggleCart()}
                        className="relative p-1"
                        aria-label={`Cart (${itemCount})`}
                    >
                        <ShoppingBag size={20} strokeWidth={1.5} />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-2 bg-black text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full">
                                {itemCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}
