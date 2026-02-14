/**
 * Centralized Query Key Factory
 * 
 * Ensures consistent cache management across the application.
 * Follows the pattern: [resource, { ...filters }]
 */

export const queryKeys = {
    // --- AUTH ---
    auth: {
        all: ['auth'] as const,
        me: () => [...queryKeys.auth.all, 'me'] as const,
    },

    // --- BUSINESSES ---
    businesses: {
        all: ['businesses'] as const,
        lists: () => [...queryKeys.businesses.all, 'list'] as const,
        detail: (id: string) => [...queryKeys.businesses.all, 'detail', id] as const,
    },

    // --- PROJECTS ---
    projects: {
        all: ['projects'] as const,
        byBusiness: (businessId: string | undefined) => [...queryKeys.projects.all, { businessId }] as const,
        detail: (id: string) => [...queryKeys.projects.all, 'detail', id] as const,
    },

    // --- ANALYTICS / FINANCE ---
    finance: {
        all: ['finance'] as const,
        cashflow: (businessId: string | undefined) => [...queryKeys.finance.all, 'cashflow', { businessId }] as const,
        liabilities: (businessId: string | undefined) => [...queryKeys.finance.all, 'liabilities', { businessId }] as const,
        stats: (businessId: string | undefined) => [...queryKeys.finance.all, 'stats', { businessId }] as const,
    },

    // --- SYSTEM / ADMIN ---
    admin: {
        all: ['admin'] as const,
        users: () => [...queryKeys.admin.all, 'users'] as const,
        invoices: () => [...queryKeys.admin.all, 'invoices'] as const,
        settings: () => [...queryKeys.admin.all, 'settings'] as const,
        auditLogs: () => [...queryKeys.admin.all, 'audit-logs'] as const,
    },

    // --- MARKETPLACE ---
    marketplace: {
        all: ['marketplace'] as const,
        balance: () => [...queryKeys.marketplace.all, 'balance'] as const,
    },
} as const;
