/**
 * Store Context — global state for cart management.
 *
 * Uses React Context + useReducer for predictable state updates.
 * The cart is synced with the backend on every add operation.
 * A simple userId ("guest") is used for demo purposes.
 */

import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import { addToCartAPI, fetchCart, type CartItem, type Product } from '../lib/api';

const USER_ID = 'guest';

interface StoreState {
    items: CartItem[];
    subtotal: number;
    isCartOpen: boolean;
    toastMessage: string | null;
}

type StoreAction =
    | { type: 'SET_CART'; items: CartItem[]; subtotal: number }
    | { type: 'TOGGLE_CART'; open?: boolean }
    | { type: 'SHOW_TOAST'; message: string }
    | { type: 'HIDE_TOAST' }
    | { type: 'CLEAR_CART' };

const initialState: StoreState = {
    items: [],
    subtotal: 0,
    isCartOpen: false,
    toastMessage: null,
};

function reducer(state: StoreState, action: StoreAction): StoreState {
    switch (action.type) {
        case 'SET_CART':
            return { ...state, items: action.items, subtotal: action.subtotal };
        case 'TOGGLE_CART':
            return { ...state, isCartOpen: action.open ?? !state.isCartOpen };
        case 'SHOW_TOAST':
            return { ...state, toastMessage: action.message };
        case 'HIDE_TOAST':
            return { ...state, toastMessage: null };
        case 'CLEAR_CART':
            return { ...state, items: [], subtotal: 0 };
        default:
            return state;
    }
}

interface StoreContextValue {
    state: StoreState;
    userId: string;
    itemCount: number;
    addToCart: (product: Product) => Promise<void>;
    refreshCart: () => Promise<void>;
    toggleCart: (open?: boolean) => void;
    clearCart: () => void;
    showToast: (message: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const refreshCart = useCallback(async () => {
        try {
            const data = await fetchCart(USER_ID);
            dispatch({ type: 'SET_CART', items: data.items, subtotal: data.subtotal });
        } catch {
            // Cart may not exist yet — that's fine
        }
    }, []);

    const addToCart = useCallback(async (product: Product) => {
        try {
            await addToCartAPI(USER_ID, product.id, 1);
            await refreshCart();
            dispatch({ type: 'SHOW_TOAST', message: `${product.name} added to cart` });
            setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 1500);
        } catch (err: any) {
            dispatch({ type: 'SHOW_TOAST', message: err.message });
            setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 2000);
        }
    }, [refreshCart]);

    const toggleCart = useCallback((open?: boolean) => {
        dispatch({ type: 'TOGGLE_CART', open });
    }, []);

    const clearCart = useCallback(() => {
        dispatch({ type: 'CLEAR_CART' });
    }, []);

    const showToast = useCallback((message: string) => {
        dispatch({ type: 'SHOW_TOAST', message });
        setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 1500);
    }, []);

    const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <StoreContext.Provider value={{ state, userId: USER_ID, itemCount, addToCart, refreshCart, toggleCart, clearCart, showToast }}>
            {children}
        </StoreContext.Provider>
    );
}

export function useStore(): StoreContextValue {
    const ctx = useContext(StoreContext);
    if (!ctx) throw new Error('useStore must be used within StoreProvider');
    return ctx;
}
