import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { DashboardOutletContext } from '@/core/ui/layout/DashboardShell';
import { useMarketplace } from '@/core/hooks/useMarketplace';
import { useSettings } from '@/core/hooks/useSettings';
import { useAuth } from '@/core/hooks/useAuth';
import { useToast } from '@/core/hooks/useToast';
import { MerchantProfile } from '@/core/ui/features/profile/MerchantProfile';

export default function ProfilePage() {
    const {
        businesses,
        activeBusiness,
        activeBusinessId,
        addBusiness,
        switchBusiness,
        updateBusiness,
        deleteBusiness,
        setActiveTab,
        isProfileEditing,
        setIsProfileEditing,
        user
    } = useOutletContext<DashboardOutletContext>();

    const { credits, transactionHistory } = useMarketplace();
    const { settings, toggleLanguage } = useSettings();
    const { logout } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        localStorage.removeItem('margins_pro_is_demo');
        showToast("Anda telah keluar sesi.", "info");
        navigate('/auth');
    };

    return (
        <MerchantProfile
            credits={credits}
            transactionHistory={transactionHistory}
            settings={settings}
            toggleLanguage={toggleLanguage}
            isEditingProfile={isProfileEditing}
            setIsEditingProfile={setIsProfileEditing}
            onTopUpClick={() => setActiveTab('topup')}
            businesses={businesses}
            activeBusinessId={activeBusinessId}
            activeBusiness={activeBusiness}
            addBusiness={addBusiness}
            switchBusiness={switchBusiness}
            updateBusiness={updateBusiness}
            deleteBusiness={deleteBusiness}
            initialTab={'outlets'}
            onLogout={handleLogout}
            user={user || undefined}
        />
    );
}
