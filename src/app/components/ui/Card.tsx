import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    variant?: 'default' | 'glass' | 'hover';
}

export default function Card({
    children,
    className = '',
    variant = 'default'
}: CardProps) {
    const baseStyles = 'rounded-3xl transition-all duration-500 overflow-hidden';

    const variants = {
        default: 'bg-brand-charcoal/50 backdrop-blur-md border border-white/5 shadow-lg',
        glass: 'bg-brand-glass border border-white/10 shadow-glass backdrop-blur-xl',
        hover: 'bg-brand-charcoal/50 border border-white/5 hover:border-brand-green/30 hover:shadow-glow hover:-translate-y-1',
    };

    return (
        <div className={`${baseStyles} ${variants[variant]} ${className}`}>
            {children}
        </div>
    );
}
