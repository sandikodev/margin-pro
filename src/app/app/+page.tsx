import React from 'react';
import { useOutletContext } from '@koda/runtime';
import { DashboardView } from './dashboard/_components/DashboardView';
import { DashboardOutletContext } from '@/components/layout/DashboardShell';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useFinance } from '@/hooks/useFinance';
import { INITIAL_MARKETPLACE } from '@/lib/constants';

/**
 * 🏔️ Zenith App Root (+page)
 * Maps to /app
 */
export default function AppRootPage() {
  const ctx = useOutletContext<DashboardOutletContext>();
  const { topUpCredits } = useMarketplace();
  const { monthlyFixedCost, currentSavings } = useFinance(ctx.activeBusiness?.id);

  return (
    <DashboardView
      {...ctx}
      setCredits={topUpCredits}
      marketItemsCount={INITIAL_MARKETPLACE.length}
      monthlyFixedCost={monthlyFixedCost}
      currentSavings={currentSavings}
    />
  );
}
