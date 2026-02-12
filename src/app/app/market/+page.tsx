import React from 'react';
import { MarketplaceView } from './market';
import { useMarketplace } from '@/hooks/useMarketplace';
import { INITIAL_MARKETPLACE } from '@/lib/constants';
import { Project, MarketplaceItem } from '@shared/types';
import { useToast } from '@/context/toast-context';
import { useOutletContext } from '@koda/runtime';
import { DashboardOutletContext } from '@/components/layout/DashboardShell';

export const MarketPage: React.FC = () => {
  const ctx = useOutletContext<DashboardOutletContext>();
  const { addProject, activeBusinessId, setActiveTab, setActiveProjectId, formatValue } = ctx;
  const { deductCredits } = useMarketplace();
  const { showToast } = useToast();

  const handleBuyItem = async (item: MarketplaceItem) => {
    const success = await deductCredits(item.price || 0, item.name);
    if (!success) return;

    const newProject: Project = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      businessId: activeBusinessId,
      name: `[NEW] ${item.name}`,
      lastModified: Date.now()
    };

    addProject(newProject);
    setActiveProjectId(newProject.id);
    setActiveTab('calc');
    showToast("Template berhasil dibeli", "success");
  };

  return (
    <MarketplaceView
      items={INITIAL_MARKETPLACE}
      handleBuyItem={handleBuyItem}
      formatValue={formatValue}
    />
  );
};

export default MarketPage;
