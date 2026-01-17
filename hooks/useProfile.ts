
import { useState, useEffect, useMemo } from 'react';
import { BusinessProfile } from '../types';

const BUSINESS_KEY = 'margins_pro_businesses_v3'; 
const ACTIVE_BUSINESS_KEY = 'margins_pro_active_business_id_v3';

const MOCK_BUSINESSES: BusinessProfile[] = [
  {
    id: 'fiera-food-001',
    name: 'Fiera Food Mangiran',
    type: 'fnb_offline',
    ownerName: 'sandikodev',
    email: 'sandiko@konxc.space',
    phone: '0882007952010',
    address: 'Jl. Raya Mangiran No. 45, Bantul, Yogyakarta',
    gmapsLink: 'https://maps.app.goo.gl/example1',
    linkGofood: 'https://gofood.link/a/fiera-food-mangiran',
    linkGrab: 'https://grab.com/food/fiera-food-mangiran',
    linkShopee: 'https://shopee.co.id/fiera-food-mangiran',
    initialCapital: 15000000,
    currentAssetValue: 12500000,
    cashOnHand: 2500000,
    establishedDate: Date.now() - 1000 * 60 * 60 * 24 * 365,
    themeColor: 'indigo'
  },
  {
    id: 'fiera-snack-002',
    name: 'Fiera Snack Paseban',
    type: 'retail',
    ownerName: 'sandikodev',
    email: 'sandiko@konxc.space',
    phone: '0882007952010',
    address: 'Kios Paseban Lt. 1, Jetis, Bantul',
    gmapsLink: 'https://maps.app.goo.gl/example2',
    linkGofood: '',
    linkGrab: '',
    linkShopee: 'https://shopee.co.id/fiera-snack-paseban',
    initialCapital: 5000000,
    currentAssetValue: 4200000,
    cashOnHand: 1500000,
    establishedDate: Date.now() - 1000 * 60 * 60 * 24 * 90,
    themeColor: 'emerald'
  }
];

export const useProfile = () => {
  const [businesses, setBusinesses] = useState<BusinessProfile[]>(() => {
    const saved = localStorage.getItem(BUSINESS_KEY);
    return saved ? JSON.parse(saved) : MOCK_BUSINESSES;
  });

  const [activeBusinessId, setActiveBusinessId] = useState<string>(() => {
    return localStorage.getItem(ACTIVE_BUSINESS_KEY) || businesses[0]?.id || MOCK_BUSINESSES[0].id;
  });

  const activeBusiness = useMemo(() => {
    return businesses.find(b => b.id === activeBusinessId) || businesses[0];
  }, [businesses, activeBusinessId]);

  useEffect(() => {
    localStorage.setItem(BUSINESS_KEY, JSON.stringify(businesses));
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_BUSINESS_KEY, activeBusinessId);
  }, [activeBusinessId]);

  const addBusiness = (newBusiness: BusinessProfile) => {
    setBusinesses(prev => [...prev, newBusiness]);
    setActiveBusinessId(newBusiness.id);
  };

  const updateBusiness = (id: string, updates: Partial<BusinessProfile>) => {
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBusiness = (id: string) => {
    if (businesses.length <= 1) {
      alert("Minimal harus ada satu profil bisnis.");
      return;
    }
    const newBus = businesses.filter(b => b.id !== id);
    setBusinesses(newBus);
    if (activeBusinessId === id) {
      setActiveBusinessId(newBus[0].id);
    }
  };

  const switchBusiness = (id: string) => {
    setActiveBusinessId(id);
  };

  return {
    businesses,
    activeBusiness,
    activeBusinessId,
    addBusiness,
    updateBusiness,
    deleteBusiness,
    switchBusiness
  };
};
