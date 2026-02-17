import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Toast() {
    const { state } = useStore();

    return (
        <AnimatePresence>
            {state.toastMessage && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 bg-white border border-gray-200 shadow-lg px-4 py-2.5 rounded-lg text-sm"
                >
                    <Check size={14} className="text-green-600" />
                    {state.toastMessage}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
