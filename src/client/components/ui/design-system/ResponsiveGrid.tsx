import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  columns?: '2' | '3' | '4' | 2 | 3 | 4;
}

export const ResponsiveGrid = React.forwardRef<HTMLDivElement, ResponsiveGridProps>(
  ({ className, children, columns = '3', ...props }, ref) => {
    const colStr = columns.toString();
    return (
      <div
        ref={ref}
        className={cn(
          "grid grid-cols-1 gap-4",
          colStr === '2' && "md:grid-cols-2",
          colStr === '3' && "md:grid-cols-2 lg:grid-cols-3",
          colStr === '4' && "md:grid-cols-2 lg:grid-cols-4",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ResponsiveGrid.displayName = 'ResponsiveGrid';
