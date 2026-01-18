import React from 'react';
import { MerchantProfile as MerchantProfileComponent } from '../../components/features/profile/MerchantProfile';
import { AppSettings, BusinessProfile } from '@shared/types';

interface MerchantProfileProps {
  credits: number;
  // setCredits removed
  transactionHistory: { id: string; name: string; price: number; date: number }[];
  settings: AppSettings;
  toggleLanguage: () => void;
  isEditingProfile: boolean;
  setIsEditingProfile: (val: boolean) => void;
  onTopUpClick?: () => void;
  businesses: BusinessProfile[];
  activeBusinessId: string;
  activeBusiness: BusinessProfile;
  addBusiness: (b: BusinessProfile) => void;
  switchBusiness: (id: string) => void;
  updateBusiness: (id: string, updates: Partial<BusinessProfile>) => void;
  deleteBusiness: (id: string) => void;
  initialTab?: 'outlets' | 'account' | 'ledger';
  onLogout?: () => void; // New prop
}

export const MerchantProfile: React.FC<MerchantProfileProps> = (props) => {
  return <MerchantProfileComponent {...props} />;
};