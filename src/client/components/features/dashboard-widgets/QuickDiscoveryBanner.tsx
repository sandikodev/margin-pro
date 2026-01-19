import React from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { GradientCard } from '@/components/ui/design-system/GradientCard';

interface QuickDiscoveryBannerProps {
    setActiveTab: (tab: string) => void;
    className?: string;
}

export const QuickDiscoveryBanner: React.FC<QuickDiscoveryBannerProps> = ({ setActiveTab, className }) => {
  return (
    <div className={`px-2 lg:px-0 ${className}`}>
       <GradientCard 
          onClick={() => setActiveTab('edu')}
          className="flex items-center justify-between cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/20"
       >
          <div className="relative z-10 flex items-center gap-4">
             <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <Star className="w-6 h-6 text-white fill-white animate-pulse" />
             </div>
             <div className="space-y-0.5">
                <h5 className="text-xs font-black uppercase tracking-widest leading-none">Margin Academy</h5>
                <p className="text-[10px] text-indigo-100 opacity-80 leading-tight">Pelajari trik jualan untung.</p>
             </div>
          </div>
          <div className="relative z-10 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
             <ArrowRight className="w-4 h-4" />
          </div>
       </GradientCard>
    </div>
  );
};
