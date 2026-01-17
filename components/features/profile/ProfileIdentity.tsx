import React from 'react';
import { Store, User, Calendar, MapPin, BadgeCheck } from 'lucide-react';
import { BusinessProfile } from '../../../types';

interface ProfileIdentityProps {
  business: BusinessProfile;
  ownerName: string;
}

export const ProfileIdentity: React.FC<ProfileIdentityProps> = ({ business, ownerName }) => {
  const establishedYear = new Date(business.establishedDate).getFullYear();

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 lg:gap-10 text-center md:text-left group/id w-full">
      
      {/* Avatar Wrapper - Handles positioning and hover effects without clipping the floating badge */}
      <div className="relative shrink-0 transition-transform duration-500 group-hover/id:scale-105 group-hover/id:rotate-1">
        
        {/* Main Avatar Container - Clips the image to the shape */}
        <div 
          className="w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center text-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] border-4 border-white/10 relative overflow-hidden" 
          style={{ backgroundColor: business.themeColor === 'emerald' ? '#10b981' : business.themeColor === 'rose' ? '#f43f5e' : business.themeColor === 'orange' ? '#f97316' : '#6366f1' }}
        >
          {business.avatarUrl ? (
             <img src={business.avatarUrl} alt={business.name} className="w-full h-full object-cover" />
          ) : (
             <Store className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-2xl opacity-90" />
          )}
          
          {/* Glass Overlay for depth */}
          {!business.avatarUrl && <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/20 pointer-events-none"></div>}
        </div>

        {/* Verified Badge - Floating Outside to avoid clipping */}
        <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 z-20">
           <div className="relative flex items-center justify-center bg-white p-1.5 sm:p-2 rounded-full shadow-lg ring-4 ring-slate-950/80">
              <BadgeCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 fill-blue-500 stroke-white" strokeWidth={2.5} />
           </div>
        </div>

      </div>

      {/* Info Section */}
      <div className="space-y-4 flex-grow w-full overflow-hidden">
        <div className="space-y-2">
          {/* Badges Row */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="text-[8px] sm:text-[9px] font-black uppercase bg-indigo-500/20 px-3 py-1 rounded-full text-indigo-200 tracking-widest border border-indigo-500/30 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
               PRO MERCHANT
            </span>
            <span className="text-[8px] sm:text-[9px] font-black uppercase bg-white/10 px-3 py-1 rounded-full text-slate-300 tracking-widest border border-white/10 backdrop-blur-md">
               {business.type.replace('_', ' ')}
            </span>
          </div>
          
          {/* Business Name - Clean, no redundant badge */}
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter leading-none text-white drop-shadow-lg truncate py-1">
             {business.name}
          </h3>
          
          {/* Meta Data Row */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-5 text-indigo-200/60 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5 hover:text-indigo-100 transition-colors cursor-default">
               <User className="w-3.5 h-3.5" /> {ownerName}
            </span>
            <span className="w-1 h-1 rounded-full bg-indigo-500/50 hidden sm:block"></span>
            <span className="flex items-center gap-1.5 hover:text-indigo-100 transition-colors cursor-default">
               <Calendar className="w-3.5 h-3.5" /> Est. {establishedYear}
            </span>
            <span className="w-1 h-1 rounded-full bg-indigo-500/50 hidden sm:block"></span>
            <span className="flex items-center gap-1.5 hover:text-indigo-100 transition-colors cursor-default truncate max-w-[200px]">
               <MapPin className="w-3.5 h-3.5" /> {business.address?.split(',')[0] || 'Lokasi Belum Diatur'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};