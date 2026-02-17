/**
 * Admin Dashboard — high-density data visualization.
 * Metric cards with bold typography + discount codes list with status dots.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Zap } from 'lucide-react';
import { fetchStats, generateDiscount, formatPrice, type StoreStats } from '../lib/api';

export default function Admin() {
    const [stats, setStats] = useState<StoreStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [genMessage, setGenMessage] = useState('');

    const loadStats = async () => {
        setLoading(true);
        try {
            const data = await fetchStats();
            setStats(data);
        } catch {
            // Handle error silently
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const result = await generateDiscount();
            setGenMessage(result.message);
            await loadStats(); // Refresh after generating
            setTimeout(() => setGenMessage(''), 3000);
        } catch {
            setGenMessage('Failed to generate discount code');
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="animate-pulse space-y-8">
                    <div className="h-8 bg-surface rounded w-48" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-28 bg-surface rounded-sm" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-24 text-center">
                <p className="text-muted">Failed to load stats. Is the backend running?</p>
            </div>
        );
    }

    const metrics = [
        { label: 'Revenue', value: formatPrice(stats.totalRevenue), sub: 'Total earnings' },
        { label: 'Items Sold', value: stats.totalItemsPurchased.toString(), sub: 'Across all orders' },
        { label: 'Orders', value: stats.totalOrders.toString(), sub: 'Completed checkouts' },
        { label: 'Total Discounts', value: formatPrice(stats.totalDiscountAmount), sub: `${stats.discountCodes.used} codes used` },
    ];

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tighter">Admin Console</h1>
                    <p className="text-muted text-sm mt-1">Store analytics and discount management</p>
                </div>
                <button
                    onClick={loadStats}
                    className="btn-press p-2 border border-border rounded-sm hover:bg-surface transition-colors"
                    aria-label="Refresh stats"
                >
                    <RefreshCw size={16} strokeWidth={1.5} />
                </button>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                {metrics.map((metric, i) => (
                    <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, type: 'spring', stiffness: 400, damping: 30 }}
                        className="border border-border rounded-sm p-5"
                    >
                        <p className="text-xs font-medium uppercase tracking-wider text-muted mb-2">
                            {metric.label}
                        </p>
                        <p className="text-3xl font-semibold tracking-tighter">{metric.value}</p>
                        <p className="text-xs text-muted/60 mt-1">{metric.sub}</p>
                    </motion.div>
                ))}
            </div>

            {/* Discount Management */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold tracking-tight">Discount Codes</h2>
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="btn-press inline-flex items-center gap-2 bg-primary text-bg px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        <Zap size={12} />
                        {generating ? 'Generating...' : 'Generate Code'}
                    </button>
                </div>

                {/* Generation message */}
                {genMessage && (
                    <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-muted mb-4 bg-surface px-3 py-2 border border-border rounded-sm"
                    >
                        {genMessage}
                    </motion.p>
                )}

                {/* Codes Table */}
                {stats.discountCodes.codes.length === 0 ? (
                    <div className="border border-border rounded-sm p-8 text-center">
                        <p className="text-muted text-sm">No discount codes generated yet.</p>
                        <p className="text-muted/60 text-xs mt-1">
                            Codes are generated when total orders reach a multiple of 5.
                        </p>
                    </div>
                ) : (
                    <div className="border border-border rounded-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-surface">
                                    <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted">Status</th>
                                    <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted">Code</th>
                                    <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted">Discount</th>
                                    <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted">Created</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {stats.discountCodes.codes.map((code) => (
                                    <tr key={code.code} className="hover:bg-surface/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`w-2 h-2 rounded-full ${code.status === 'unused' ? 'bg-primary' : 'bg-muted/40'
                                                        }`}
                                                />
                                                <span className="text-xs capitalize">{code.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs font-medium">{code.code}</td>
                                        <td className="px-4 py-3">{code.discountPercent}%</td>
                                        <td className="px-4 py-3 text-muted text-xs">
                                            {new Date(code.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
