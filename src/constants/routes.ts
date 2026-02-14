/**
 * Route Constants
 * Centralized route paths to avoid magic strings
 */

export const ROUTES = {
    // Public
    HOME: '/',
    AUTH: '/auth',
    DEMO: '/demo',
    PRICING: '/pricing',
    BLOG: '/blog',
    LEGAL: '/legal',
    INVITE: '/r',

    // App (Protected)
    APP: '/app',
    APP_DASHBOARD: '/app',
    APP_CALCULATOR: '/app/project',
    APP_INSIGHTS: '/app/insights',
    APP_MARKET: '/app/market',
    APP_FINANCE: '/app/finance',
    APP_PROFILE: '/app/profile',
    APP_ACADEMY: '/app/academia',
    APP_ABOUT: '/app/about',
    APP_CHANGELOG: '/app/changelog',
    APP_TOPUP: '/app/topup',

    // System (Admin)
    SYSTEM: '/system',
    SYSTEM_ADMIN: '/system/admin',

    // Onboarding
    ONBOARDING: '/onboarding',
} as const;

export const TAB_NAMES = {
    DASHBOARD: 'dash',
    CALCULATOR: 'calc',
    INSIGHTS: 'insights',
    MARKET: 'market',
    FINANCE: 'finance',
    PROFILE: 'profile',
    ACADEMY: 'academia',
    ABOUT: 'about',
    CHANGELOG: 'changelog',
    TOPUP: 'topup',
} as const;

export type RoutePath = typeof ROUTES[keyof typeof ROUTES];
export type TabName = typeof TAB_NAMES[keyof typeof TAB_NAMES];
