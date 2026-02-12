import React from 'react';
import { MerchantProfile } from './profile';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useSettings } from '@/hooks/useSettings';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/context/toast-context';
import { useNavigate, useOutletContext } from '@koda/runtime';
import { DashboardOutletContext } from '@/components/layout/DashboardShell';

export const ProfilePage: React.FC = () => {
    const ctx = useOutletContext<DashboardOutletContext>();
    const {
        businesses, activeBusiness, activeBusinessId, addBusiness,
        switchBusiness, updateBusiness, deleteBusiness, setActiveTab,
        isProfileEditing, setIsProfileEditing, user, credits
    } = ctx;

    const { transactionHistory } = useMarketplace();
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
            initialTab="outlets"
            onLogout={handleLogout}
            user={user || undefined}
        />
    );
}

export default ProfilePage;
