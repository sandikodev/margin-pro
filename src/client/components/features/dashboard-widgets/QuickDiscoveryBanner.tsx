import React from 'react';
import { ArrowRight, BookOpen, GraduationCap } from 'lucide-react';
import { GradientCard } from '@koda/core/ui';

interface QuickDiscoveryBannerProps {
   setActiveTab: (tab: string) => void;
   className?: string;
}

export const QuickDiscoveryBanner: React.FC<QuickDiscoveryBannerProps> = ({ setActiveTab, className }) => {
   return (
      <div className={`px-2 lg:px-0 ${className}`}>
         <GradientCard
            onClick={() => setActiveTab('edu')}
            className="flex flex-col gap-6 cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/30 group p-8"
         >
            <div className="relative z-10 flex justify-between items-start">
               <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-[1.25rem] flex items-center justify-center border border-white/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <BookOpen className="w-7 h-7 text-white" />
               </div>
               <div className="px-3 py-1 bg-emerald-500/20 backdrop-blur-md rounded-full border border-emerald-500/20">
                  <span className="text-[8px] font-black uppercase text-emerald-300 tracking-[0.2em]">Live Academy</span>
               </div>
            </div>

            <div className="relative z-10 space-y-3">
               <div className="space-y-1">
                  <h2 className="text-xl font-black uppercase tracking-tight leading-none text-white italic">Margin Academy</h2>
                  <p className="text-[10px] text-indigo-100 font-bold opacity-90 leading-relaxed uppercase tracking-widest">Mastering your business profit.</p>
               </div>

               <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex -space-x-2">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="w-7 h-7 rounded-full border-2 border-indigo-600 bg-indigo-400 flex items-center justify-center overflow-hidden">
                           <div className="text-[6px] font-black">USER</div>
                        </div>
                     ))}
                     <div className="w-7 h-7 rounded-full border-2 border-indigo-600 bg-white/10 backdrop-blur-md flex items-center justify-center text-[7px] font-black">
                        +85
                     </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white group-hover:gap-3 transition-all">
                     Pelajari <ArrowRight className="w-3.5 h-3.5" />
                  </div>
               </div>
            </div>

            {/* Background Decorative Icon */}
            <GraduationCap className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 -rotate-12 pointer-events-none group-hover:scale-110 group-hover:rotate-0 transition-all duration-700" />
         </GradientCard>
      </div>
   );
};
