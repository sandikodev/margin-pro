import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// 1. Primitive: Spinner
export const Spinner: React.FC<{ className?: string }> = ({ className }) => (
  <Loader2 className={cn("animate-spin text-indigo-600", className)} />
);

// 2. Primitive: Skeleton
export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("animate-pulse rounded-md bg-slate-200/80", className)} />
);

// 3. Widget Skeleton (Matches BentoCard)
export const WidgetSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("bg-white rounded-[2.5rem] border border-slate-100 p-6 space-y-4", className)}>
     <div className="flex items-center gap-4">
        <Skeleton className="w-10 h-10 rounded-2xl" />
        <div className="space-y-2">
           <Skeleton className="h-3 w-24" />
           <Skeleton className="h-2 w-16" />
        </div>
     </div>
     <Skeleton className="h-20 w-full rounded-xl" />
  </div>
);

// 4. Full Page Loader (Premium)
export const FullPageLoader: React.FC<{ text?: string }> = ({ text = "Loading Experience..." }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
       {/* Background Decoration */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
       
       <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="relative">
             <div className="w-16 h-16 border-4 border-slate-200 rounded-full"></div>
             <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
             {/* Inner Dot */}
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
             </div>
          </div>
          
          <div className="flex flex-col items-center gap-1">
             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{text}</h3>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] animate-pulse">Please Wait</p>
          </div>
       </div>
    </div>
  );
};
