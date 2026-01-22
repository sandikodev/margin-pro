import React from 'react';
import { Building2, TrendingUp, Wallet, Settings, Gem } from 'lucide-react';
import { BusinessProfile, AppSettings, User as UserType } from '@shared/types';
import { ProfileIdentity } from '../ProfileIdentity';
import { ProfileFinancials } from '../ProfileFinancials';
import { BentoCard } from '@/components/ui/design-system/BentoCard';

interface MerchantHeaderProps {
    activeBusiness: BusinessProfile | undefined;
    user?: UserType;
    credits: number;
    onTopUpClick?: () => void;
    businesses: BusinessProfile[];
    settings: AppSettings;
    toggleLanguage: () => void;
    formatIDR: (val: number) => string;
}

export const MerchantHeader: React.FC<MerchantHeaderProps> = ({
    activeBusiness,
    user,
    credits,
    onTopUpClick,
    businesses,
    settings,
    toggleLanguage,
    formatIDR
}) => {
    const totalAssets = businesses.reduce((a, b) => a + (b.currentAssetValue || 0), 0);
    const totalCash = businesses.reduce((a, b) => a + (b.cashOnHand || 0), 0);

    return (
        <div className="space-y-10">
            {/* Header wrapped in BentoCard style but dark */}
            <BentoCard noPadding className="bg-slate-950 shadow-2xl border-white/5 relative">
                <div className="p-8 sm:p-12 lg:p-16 text-white relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
                    <ProfileIdentity business={activeBusiness} ownerName={user?.name || activeBusiness?.ownerName || ''} />
                    <ProfileFinancials credits={credits} onTopUp={onTopUpClick || (() => { })} />
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
            </BentoCard>

            <section aria-label="Business Statistics" className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-1">
                <BentoCard className="flex flex-col justify-between h-32 p-6">
                    <dt className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <Building2 className="w-4 h-4 text-indigo-500" /> Total Outlets
                    </dt>
                    <dd className="text-3xl font-black text-slate-900">{businesses.length}</dd>
                </BentoCard>
                <BentoCard className="flex flex-col justify-between h-32 p-6">
                    <dt className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <TrendingUp className="w-4 h-4 text-emerald-500" /> Asset Value
                    </dt>
                    <dd className="text-3xl font-black text-slate-900 tracking-tight">{formatIDR(totalAssets)}</dd>
                </BentoCard>
                <BentoCard className="flex flex-col justify-between h-32 p-6">
                    <dt className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <Wallet className="w-4 h-4 text-rose-500" /> Liquid Cash
                    </dt>
                    <dd className="text-3xl font-black text-slate-900 tracking-tight">{formatIDR(totalCash)}</dd>
                </BentoCard>
                <BentoCard noPadding className="bg-indigo-600 p-6 shadow-lg text-white flex flex-col justify-between h-32 relative overflow-hidden group cursor-pointer" onClick={toggleLanguage}>
                    <div className="relative z-10 space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-70">System Mode</span>
                        <p className="text-lg font-black leading-tight">
                            {settings.languageMode === 'umkm' ? 'Bahasa Santai' : 'Professional'}
                        </p>
                    </div>
                    <div className="relative z-10 flex items-center gap-2 text-[9px] font-bold bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                        <Settings className="w-3 h-3" /> Switch
                    </div>
                    <Gem className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                </BentoCard>
            </section>
        </div>
    );
};
