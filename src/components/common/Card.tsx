import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div {...props} className={cn('bg-white rounded-3xl p-6 shadow-xl border border-gray-100', className)}>
      {children}
    </div>
  );
};

export default Card;
