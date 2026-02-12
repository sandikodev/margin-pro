import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  tag?: string;
  tagColor?: string; // e.g. "bg-emerald-500"
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  tag, 
  tagColor = "bg-emerald-500", 
  action, 
  className 
}) => {
  return (
    <div className={cn("flex items-center justify-between px-5 lg:px-0 mb-3", className)}>
       <div className='flex items-center gap-1.5'>
          {tag && (
            <div className="flex items-center gap-1.5">
               {/* If tag is present but it's "recent nodes" style with a bar */}
               {tag === 'bar' ? (
                  <div className={cn("w-1 h-4 rounded-full", tagColor)}></div>
               ) : (
                  <>
                    <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", tagColor)}></div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{tag}</span>
                  </>
               )}
            </div>
          )}
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest" >
            <span className={cn("text-[11px] font-black uppercase tracking-widest", tag === 'bar' ? "text-slate-900 text-[12px]" : "text-slate-400")}>
              {title}
            </span>
          </h4>
       </div>
       {action && <div>{action}</div>}
    </div>
  );
};

export const DashboardSectionHeader: React.FC<{
  title: string;
  subtitle?: string; // For "Live Rates"
  indicatorColor?: string; // For the dot/bar color
  variant?: 'default' | 'accent'; // default = gray text, accent = dark text with bar
  action?: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}> = ({ title, subtitle, indicatorColor = 'bg-emerald-500', variant = 'default', action, icon: Icon, className }) => {
  return (
    <div className={cn("flex items-center justify-between px-5 lg:px-0 mb-3", className)}>
      <div className="flex items-center gap-2">
        {variant === 'accent' && (
           <div className={cn("w-1 h-4 rounded-full", indicatorColor)}></div>
        )}
        
        {Icon && <Icon className={cn("w-4 h-4", variant === 'default' ? "text-slate-400" : "text-slate-900")} />}

        <h4 className={cn(
          "font-black uppercase tracking-widest",
          variant === 'default' ? "text-[11px] text-slate-400" : "text-[12px] text-slate-900"
        )}>
          {title}
        </h4>

        {variant === 'default' && subtitle && (
           <div className="flex items-center gap-1.5 ml-auto md:ml-0">
              <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", indicatorColor)}></div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{subtitle}</span>
           </div>
        )}
      </div>
      {action}
    </div>
  );
}
