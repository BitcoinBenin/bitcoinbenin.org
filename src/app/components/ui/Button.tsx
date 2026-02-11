import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
    className?: string;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    ...props
}: ButtonProps) {

    const baseStyles = 'inline-flex items-center justify-center font-display font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-green/50 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-full';

    const variants = {
        primary: 'bg-gradient-to-r from-brand-green to-brand-accent text-white shadow-glow hover:shadow-glow-hover hover:scale-105',
        secondary: 'bg-brand-charcoal text-white hover:bg-white/10 shadow-glass border border-white/5',
        outline: 'border border-brand-green/50 text-brand-green hover:bg-brand-green/10 hover:border-brand-green',
        ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
    };

    const sizes = {
        sm: 'px-5 py-2 text-xs',
        md: 'px-7 py-3 text-sm',
        lg: 'px-9 py-4 text-base',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
