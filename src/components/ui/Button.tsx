import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}) => {
  const variants = {
    primary: 'bg-green-700 text-white hover:bg-green-800 shadow-lg shadow-green-100',
    outline: 'bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
    link: 'bg-transparent text-green-700 hover:underline p-0 h-auto'
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
    icon: 'p-2'
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
