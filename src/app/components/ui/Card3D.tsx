'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Card3DProps {
    children: ReactNode;
    className?: string;
    variant?: 'default' | 'glass' | 'hover' | 'premium';
}

export default function Card3D({
    children,
    className = '',
    variant = 'default'
}: Card3DProps) {
    const baseStyles = 'rounded-3xl transition-all duration-500 overflow-hidden preserve-3d';

    const variants = {
        default: 'bg-brand-charcoal/50 backdrop-blur-md border border-white/5 shadow-lg',
        glass: 'bg-brand-glass border border-white/10 shadow-glass backdrop-blur-xl',
        hover: 'bg-brand-charcoal/50 border border-white/5 hover:border-brand-green/30 hover:shadow-card-3d hover:-translate-y-2',
        premium: 'bg-gradient-to-br from-brand-charcoal/80 to-brand-dark/80 border border-white/10 shadow-card-3d hover:shadow-glow-electric hover:-translate-y-3',
    };

    return (
        <motion.div
            className={`${baseStyles} ${variants[variant]} ${className}`}
            initial={{ opacity: 0, y: 20, rotateY: -5 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            whileHover={{ 
                scale: 1.02, 
                rotateY: 5, 
                rotateX: 5,
                transition: { duration: 0.3 }
            }}
            style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px'
            }}
        >
            <div className="relative h-full">
                {/* Front face */}
                <div className="relative z-10">
                    {children}
                </div>
                
                {/* Subtle overlay for depth */}
                {variant === 'premium' && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-green/5 to-brand-electric/5 pointer-events-none rounded-3xl"></div>
                )}
            </div>
        </motion.div>
    );
}
