import React from 'react';
import { cn } from '../../lib/utils';
import { CheckCircle2 } from 'lucide-react';

export const Badge = ({ children, variant = 'default', className }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-secondary-light text-secondary',
    verified: 'bg-blue-50 text-primary border border-blue-100',
    warning: 'bg-yellow-50 text-yellow-700'
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
      variants[variant],
      className
    )}>
      {variant === 'verified' && <CheckCircle2 className="w-3 h-3" />}
      {children}
    </span>
  );
};
