/**
 * Monochrome Confetti — black & white particles on checkout success.
 * Uses Framer Motion for each particle's animation.
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    rotation: number;
    color: string;
    shape: 'circle' | 'square';
}

interface Props {
    trigger: boolean;
    onComplete?: () => void;
}

export default function Confetti({ trigger, onComplete }: Props) {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        if (!trigger) return;

        const newParticles: Particle[] = Array.from({ length: 40 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: -10,
            size: Math.random() * 8 + 4,
            rotation: Math.random() * 360,
            color: Math.random() > 0.5 ? '#000000' : '#cccccc',
            shape: Math.random() > 0.5 ? 'circle' : 'square',
        }));

        setParticles(newParticles);

        const timer = setTimeout(() => {
            setParticles([]);
            onComplete?.();
        }, 2500);

        return () => clearTimeout(timer);
    }, [trigger, onComplete]);

    return (
        <AnimatePresence>
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{
                        left: `${p.x}%`,
                        top: '-5%',
                        rotate: 0,
                        opacity: 1,
                    }}
                    animate={{
                        top: `${80 + Math.random() * 20}%`,
                        rotate: p.rotation + 360,
                        opacity: 0,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 1.5 + Math.random() * 1,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="fixed z-[200] pointer-events-none"
                    style={{
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        borderRadius: p.shape === 'circle' ? '50%' : '1px',
                    }}
                />
            ))}
        </AnimatePresence>
    );
}
