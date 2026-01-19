import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noPadding?: boolean;
}

export const GradientCard = React.forwardRef<HTMLDivElement, GradientCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden active:scale-[0.98] transition-all",
          className
        )}
        {...props}
      >
        <Sparkles className="absolute top-0 right-0 w-24 h-24 text-white/5 pointer-events-none" />
        <div className="relative z-10 w-full">
            {children}
        </div>
      </div>
    );
  }
);
GradientCard.displayName = 'GradientCard';
