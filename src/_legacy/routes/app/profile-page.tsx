import React from 'react';
import { MerchantProfile } from './profile';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useSettings } from '@/hooks/useSettings';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/context/toast-context';
import { useNavigate } from 'react-router-dom';
import { BusinessProfile, User } from '@shared/types';

interface ProfilePageProps {
    businesses: BusinessProfile[];
    activeBusiness: BusinessProfile | undefined;
    activeBusinessId: string;
    addBusiness: (b: BusinessProfile) => void;
    switchBusiness: (id: string) => void;
    updateBusiness: (id: string, u: Partial<BusinessProfile>) => void;
    deleteBusiness: (id: string) => void;
    onTopUpClick: () => void;
    initialTab: 'outlets' | 'account' | 'ledger';
    isEditingProfile: boolean;
    setIsEditingProfile: (val: boolean) => void;
    user: User | null;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
    businesses, activeBusiness, activeBusinessId, addBusiness, switchBusiness, updateBusiness, deleteBusiness, onTopUpClick, initialTab, isEditingProfile, setIsEditingProfile, user
}) => {
    const { credits, transactionHistory } = useMarketplace();
    const { settings, toggleLanguage } = useSettings();
    const { logout } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout(); // Single call, handles API and state cleanup
        localStorage.removeItem('margins_pro_is_demo');
        showToast("Anda telah keluar sesi.", "info");
        navigate('/auth'); // Consistent redirect to auth page
    };

    return (
        <MerchantProfile
            credits={credits}
            transactionHistory={transactionHistory}
            settings={settings}
            toggleLanguage={toggleLanguage}
            isEditingProfile={isEditingProfile}
            setIsEditingProfile={setIsEditingProfile}
            onTopUpClick={onTopUpClick}
            businesses={businesses}
            activeBusinessId={activeBusinessId}
            activeBusiness={activeBusiness}
            addBusiness={addBusiness}
            switchBusiness={switchBusiness}
            updateBusiness={updateBusiness}
            deleteBusiness={deleteBusiness}
            initialTab={initialTab}
            onLogout={handleLogout}
            user={user || undefined}
        />
    );
}
