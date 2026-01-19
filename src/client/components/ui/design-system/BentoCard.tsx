import React from 'react';
import { cn } from '@/lib/utils';

interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noPadding?: boolean;
}

export const BentoCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
  ({ className, children, noPadding = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden",
          !noPadding && "p-7",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
BentoCard.displayName = 'BentoCard';
