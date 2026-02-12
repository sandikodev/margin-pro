
import type { LoaderFunctionArgs } from 'react-router';
import { FinancialData, MarketplaceBalance } from '@shared/types';

/**
 * 🏔️ Zenith Dashboard Loader
 * Pre-fetches Finance and Marketplace data.
 * Zero-Flicker means we load this *before* rendering the dashboard.
 */
export const loader = async (args: LoaderFunctionArgs) => {
    const { request } = args;
    const url = new URL(request.url);
    const origin = url.origin;
    const headers = request.headers;

    // 1. Determine Active Business ID
    let businessId = url.searchParams.get('bid') || url.searchParams.get('id');

    // If no ID in URL, we can't fetch finance data yet.
    // The client will handle redirection to default business if needed.
    // OR: We could fetch the list here again? No, too expensive.
    // We rely on the Layout Loader -> DashboardShell to redirect.
    // If we don't have an ID, we return empty data.
    
    // Note: If the user navigates to /app/dashboard directly, layout loader runs first (parallel),
    // but dashboard loader runs in parallel too.
    // If we don't know the ID, we can't fetch.
    // Strategy: Return null/empty. Client Dashboard will see empty and wait for Layout to redirect.
    
    if (!businessId) {
        return {
            finance: { liabilities: [], cashflow: [] },
            marketplace: { credits: 0, history: [] },
            financeSettings: null
        };
    }

    // 2. Fetch Data in Parallel
    const [liabilitiesRes, cashflowRes, balanceRes, bizRes] = await Promise.all([
        fetch(`${origin}/api/finance/liabilities?businessId=${businessId}`, { headers }),
        fetch(`${origin}/api/finance/cashflow?businessId=${businessId}`, { headers }),
        fetch(`${origin}/api/marketplace/balance`, { headers }), // Balance is User-scoped, not Biz-scoped?
        fetch(`${origin}/api/businesses/${businessId}`, { headers }) // For settings
    ]);

    let finance = {
        liabilities: [] as any[],
        cashflow: [] as any[]
    };
    
    let financeSettings = {
        monthlyFixedCost: 0,
        currentSavings: 0
    };

    let marketplace: MarketplaceBalance = {
        credits: 0,
        history: []
    };

    if (liabilitiesRes.ok) finance.liabilities = await liabilitiesRes.json();
    if (cashflowRes.ok) finance.cashflow = await cashflowRes.json();
    
    if (balanceRes.ok) {
        marketplace = await balanceRes.json();
    }
    
    if (bizRes.ok) {
         const biz = await bizRes.json();
         financeSettings.monthlyFixedCost = biz.monthlyFixedCost || 0;
         financeSettings.currentSavings = biz.currentSavings || 0;
    }

    return {
        finance,
        financeSettings,
        marketplace
    };
};
