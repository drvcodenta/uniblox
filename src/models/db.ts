/**
 * In-memory data store for the ecommerce application.
 *
 * Design Decision: Using a simple in-memory object instead of a database.
 * This keeps setup minimal and is sufficient for the assignment scope.
 * Trade-off: Data is lost on server restart, but that's acceptable here.
 *
 * The store is exported as a singleton object so all services share
 * the same state. A resetStore() function is provided for unit tests
 * to ensure a clean state between test runs.
 */

import { Product, CartItem, Order, DiscountCode, StoreConfig } from './types';

interface Store {
    products: Product[];
    carts: Map<string, CartItem[]>;  // userId -> CartItem[]
    orders: Order[];
    discountCodes: DiscountCode[];
    orderCount: number;              // Global order counter for nth-order logic
    config: StoreConfig;
}

// Seed some sample products so the store is usable out of the box
const SEED_PRODUCTS: Product[] = [
    { id: 'p1', name: 'Wireless Mouse', price: 2999 },       // $29.99
    { id: 'p2', name: 'Mechanical Keyboard', price: 7999 },   // $79.99
    { id: 'p3', name: 'USB-C Hub', price: 4999 },             // $49.99
    { id: 'p4', name: 'Monitor Stand', price: 3499 },         // $34.99
    { id: 'p5', name: 'Webcam HD', price: 5999 },             // $59.99
];

/**
 * The global store instance, initialized with seed data.
 * Default config: every 5th order gets a 10% discount code.
 */
export const store: Store = {
    products: [...SEED_PRODUCTS],
    carts: new Map(),
    orders: [],
    discountCodes: [],
    orderCount: 0,
    config: {
        nthOrder: 5,
        discountPercent: 10,
    },
};

/**
 * Reset the store to its initial state.
 * Used in unit tests to ensure isolation between test cases.
 */
export function resetStore(): void {
    store.products = [...SEED_PRODUCTS];
    store.carts = new Map();
    store.orders = [];
    store.discountCodes = [];
    store.orderCount = 0;
    store.config = {
        nthOrder: 5,
        discountPercent: 10,
    };
}
