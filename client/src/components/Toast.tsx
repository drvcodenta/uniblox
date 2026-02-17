/**
 * Toast — ghost notification that fades in at bottom-center.
 * Auto-dismisses after 1.5s (controlled by StoreContext).
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/StoreContext';

export default function Toast() {
    const { state } = useStore();

    return (
        <AnimatePresence>
            {state.toastMessage && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-primary text-bg px-5 py-2.5 text-sm font-medium rounded-full shadow-lg"
                >
                    {state.toastMessage}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
