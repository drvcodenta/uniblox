/**
 * Admin Dashboard — store analytics + discount code management.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Zap } from 'lucide-react';
import { fetchStats, generateDiscount, formatPrice, type StoreStats } from '../lib/api';

/* ── Reusable Tailwind class groups ─────────────── */

const tw = {
    page: 'max-w-6xl mx-auto px-6 py-8',
    heading: 'text-3xl font-semibold',
    subheading: 'text-lg font-semibold tracking-tight',
    muted: 'text-muted text-sm',
    mutedXs: 'text-muted text-xs',
    label: 'text-xs font-medium uppercase tracking-wider text-muted',
    bigNumber: 'text-3xl font-semibold tracking-tighter',
    card: 'border border-border rounded-sm p-5',
    row: 'flex items-center justify-between',
    grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
    tableBox: 'border border-border rounded-sm overflow-hidden',
    tableHeader: 'border-b border-border bg-surface',
    thCell: 'text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted',
    tdCell: 'px-4 py-3',
    btnIcon: 'btn-press p-2 border border-border rounded-sm hover:bg-surface transition-colors',
    btnPrimary: 'btn-press inline-flex items-center gap-2 bg-primary text-bg px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50',
};

/* ── Component ──────────────────────────────────── */

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
            await loadStats();
            setTimeout(() => setGenMessage(''), 3000);
        } catch {
            setGenMessage('Failed to generate discount code');
        } finally {
            setGenerating(false);
        }
    };

    /* Loading skeleton */
    if (loading) {
        return (
            <div className={tw.page}>
                <div className="animate-pulse space-y-8">
                    <div className="h-8 bg-surface rounded w-48" />
                    <div className={tw.grid}>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-28 bg-surface rounded-sm" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    /* Error state */
    if (!stats) {
        return (
            <div className={`${tw.page} py-24 text-center`}>
                <p className={tw.muted}>Failed to load stats. Is the backend running?</p>
            </div>
        );
    }

    const metrics = [
        { label: 'Revenue', value: formatPrice(stats.totalRevenue), sub: 'Total earnings' },
        { label: 'Items Sold', value: stats.totalItemsPurchased.toString(), sub: 'Across all orders' },
        { label: 'Orders', value: stats.totalOrders.toString(), sub: 'Completed checkouts' },
        { label: 'Total Discounts', value: formatPrice(stats.totalDiscountAmount), sub: `${stats.discountCodes.used} codes used` },
    ];

    const springIn = (i: number) => ({
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: i * 0.05, type: 'spring', stiffness: 400, damping: 30 },
    });

    return (
        <div className={tw.page}>
            {/* Header */}
            <div className={`${tw.row} mb-8`}>
                <div>
                    <h1 className={tw.heading}>Admin Console</h1>
                    <p className={`${tw.muted} mt-1`}>Store analytics and discount management</p>
                </div>
                <button onClick={loadStats} className={tw.btnIcon} aria-label="Refresh stats">
                    <RefreshCw size={16} strokeWidth={1.5} />
                </button>
            </div>

            {/* Metric Cards */}
            <div className={`${tw.grid} mb-12`}>
                {metrics.map((m, i) => (
                    <motion.div key={m.label} {...springIn(i)} className={tw.card}>
                        <p className={`${tw.label} mb-2`}>{m.label}</p>
                        <p className={tw.bigNumber}>{m.value}</p>
                        <p className="text-xs text-muted/60 mt-1">{m.sub}</p>
                    </motion.div>
                ))}
            </div>

            {/* Discount Codes */}
            <div className="mb-8">
                <div className={`${tw.row} mb-4`}>
                    <h2 className={tw.subheading}>Discount Codes</h2>
                    <button onClick={handleGenerate} disabled={generating} className={tw.btnPrimary}>
                        <Zap size={12} />
                        {generating ? 'Generating...' : 'Generate Code'}
                    </button>
                </div>

                {genMessage && (
                    <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-muted mb-4 bg-surface px-3 py-2 border border-border rounded-sm"
                    >
                        {genMessage}
                    </motion.p>
                )}

                {stats.discountCodes.codes.length === 0 ? (
                    <div className="border border-border rounded-sm p-8 text-center">
                        <p className={tw.muted}>No discount codes generated yet.</p>
                        <p className="text-muted/60 text-xs mt-1">
                            Codes are generated when total orders reach a multiple of 5.
                        </p>
                    </div>
                ) : (
                    <div className={tw.tableBox}>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className={tw.tableHeader}>
                                    <th className={tw.thCell}>Status</th>
                                    <th className={tw.thCell}>Code</th>
                                    <th className={tw.thCell}>Discount</th>
                                    <th className={tw.thCell}>Created</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {stats.discountCodes.codes.map((code) => (
                                    <tr key={code.code} className="hover:bg-surface/50 transition-colors">
                                        <td className={tw.tdCell}>
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${code.status === 'unused' ? 'bg-primary' : 'bg-muted/40'}`} />
                                                <span className="text-xs capitalize">{code.status}</span>
                                            </div>
                                        </td>
                                        <td className={`${tw.tdCell} font-mono text-xs font-medium`}>{code.code}</td>
                                        <td className={tw.tdCell}>{code.discountPercent}%</td>
                                        <td className={`${tw.tdCell} ${tw.mutedXs}`}>
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
