import React, { useState, useEffect } from 'react';
import {
   History, Store, ShieldCheck
} from 'lucide-react';
import { AppSettings, BusinessProfile, BusinessType, User as UserType } from '@shared/types';
import { NotificationModal } from '@/components/modals/NotificationModal';
import { TabNavigation, TabItem } from '@/components/ui/TabNavigation';

// Modular Components
import { BusinessEditForm } from './components/BusinessEditForm';
import { MerchantHeader } from './components/MerchantHeader';
import { BusinessList } from './components/BusinessList';
import { AccountSettingsForm } from './components/AccountSettingsForm';
import { TransactionLedger } from './components/TransactionLedger';

interface MerchantProfileProps {
   credits: number;
   // setCredits removed as unused
   transactionHistory: { name: string; date: string | number; price: number }[];
   settings: AppSettings;
   toggleLanguage: () => void;
   isEditingProfile: boolean;
   setIsEditingProfile: (val: boolean) => void;
   onTopUpClick?: () => void;
   businesses: BusinessProfile[];
   activeBusinessId: string;
   activeBusiness: BusinessProfile | undefined;
   addBusiness: (b: BusinessProfile) => void;
   switchBusiness: (id: string) => void;
   updateBusiness: (id: string, updates: Partial<BusinessProfile>) => void;
   deleteBusiness: (id: string) => void;
   initialTab?: 'outlets' | 'account' | 'ledger';
   onLogout?: () => void;
   user?: UserType; // New prop
}

export const MerchantProfile: React.FC<MerchantProfileProps> = ({
   credits, transactionHistory, settings, toggleLanguage,
   isEditingProfile, setIsEditingProfile, onTopUpClick,
   businesses, activeBusinessId, activeBusiness, addBusiness, switchBusiness, updateBusiness, deleteBusiness,
   initialTab = 'outlets',
   onLogout,
   user
}) => {
   const [activeTab, setActiveTab] = useState<'outlets' | 'account' | 'ledger'>(initialTab);
   const [editForm, setEditForm] = useState<Partial<BusinessProfile>>({});
   const [isSaved, setIsSaved] = useState(false);
   const [showNotifications, setShowNotifications] = useState(false);


   useEffect(() => {
      setActiveTab(initialTab);
   }, [initialTab]);

   const [accountForm, setAccountForm] = useState({
      ownerName: user?.name || activeBusiness?.ownerName || '',
      email: user?.email || activeBusiness?.email || '',
      phone: activeBusiness?.phone || '',
   });

   useEffect(() => {
      if (activeBusiness) {
         setAccountForm({
            ownerName: activeBusiness.ownerName || '',
            email: activeBusiness.email || '',
            phone: activeBusiness.phone || '',
         });
      }
   }, [activeBusiness]);

   const startEdit = (b: BusinessProfile) => {
      setEditForm(b);
      setIsEditingProfile(true);
      setIsSaved(false);
   };

   const startNew = () => {
      const newData: BusinessProfile = {
         id: Math.random().toString(36).substr(2, 9),
         name: '',
         type: 'fnb_offline' as BusinessType,
         initialCapital: 0,
         currentAssetValue: 0,
         cashOnHand: 0,
         themeColor: 'indigo',
         establishedDate: Date.now(),
         address: '',
         gmapsLink: ''
      };
      setEditForm(newData);
      setIsEditingProfile(true);
      setIsSaved(false);
   };

   const handleSaveBusiness = () => {
      if (!editForm.id) return;
      const exists = businesses.find(b => b.id === editForm.id);
      if (exists) {
         updateBusiness(editForm.id, editForm);
      } else {
         addBusiness(editForm as BusinessProfile);
      }
      setIsSaved(true);
      setTimeout(() => {
         setIsSaved(false);
         setIsEditingProfile(false);
      }, 1000);
   };

   const handleSaveAccount = () => {
      if (activeBusiness) {
         updateBusiness(activeBusiness.id, accountForm);
         setIsSaved(true);
         setTimeout(() => setIsSaved(false), 2000);
      }
   };

   const handleSignOut = () => {
      if (confirm("Apakah Anda yakin ingin keluar dari sesi ini?")) {
         if (onLogout) {
            onLogout();
         } else {
            // Fallback if prop not provided
            window.location.reload();
         }
      }
   };

   const formatIDR = (val: number) => {
      if (val >= 1000000000) return (val / 1000000000).toFixed(1) + 'M';
      if (val >= 1000000) return (val / 1000000).toFixed(1) + 'jt';
      return (val / 1000).toFixed(0) + 'rb';
   };


   const tabs: TabItem[] = [
      { id: 'outlets', label: 'Unit Cabang', icon: Store },
      { id: 'account', label: 'Identitas & Akun', icon: ShieldCheck },
      { id: 'ledger', label: 'Buku Kas', icon: History }
   ];

   if (isEditingProfile) {
      return (
         <BusinessEditForm
            editForm={editForm}
            setEditForm={setEditForm}
            isSaved={isSaved}
            handleSaveBusiness={handleSaveBusiness}
            businesses={businesses}
            deleteBusiness={deleteBusiness}
            setIsEditingProfile={setIsEditingProfile}
         />
      );
   }

   return (
      <div className="space-y-10 animate-in fade-in duration-700">
         <MerchantHeader
            activeBusiness={activeBusiness}
            user={user}
            credits={credits}
            onTopUpClick={onTopUpClick}
            businesses={businesses}
            settings={settings}
            toggleLanguage={toggleLanguage}
            formatIDR={formatIDR}
         />

         {/* Modular Tab Navigation */}
         <TabNavigation
            variant="sticky"
            tabs={tabs}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as 'outlets' | 'account' | 'ledger')}
         />

         <div className="animate-in slide-in-from-bottom-4 duration-500 min-h-[400px]">
            {activeTab === 'outlets' && (
               <BusinessList
                  businesses={businesses}
                  activeBusinessId={activeBusinessId}
                  switchBusiness={switchBusiness}
                  startNew={startNew}
                  startEdit={startEdit}
                  formatIDR={formatIDR}
               />
            )}

            {activeTab === 'account' && (
               <AccountSettingsForm
                  accountForm={accountForm}
                  setAccountForm={setAccountForm}
                  handleSaveAccount={handleSaveAccount}
                  isSaved={isSaved}
                  setShowNotifications={setShowNotifications}
                  setActiveTab={setActiveTab}
                  handleSignOut={handleSignOut}
               />
            )}

            {activeTab === 'ledger' && (
               <TransactionLedger
                  transactionHistory={transactionHistory}
               />
            )}
         </div>

         <NotificationModal
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
         />
      </div>
   );
};
