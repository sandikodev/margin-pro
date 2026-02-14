
/**
 * 🛰️ Margins Pro Tracking Utility
 * Standardized tracking for Meta Ads (Facebook Pixel)
 */

declare global {
    interface Window {
        fbq: any;
    }
}

export const trackEvent = (eventName: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', eventName, params);
    }

    if (process.env.NODE_ENV === 'development') {
        console.log(`[Tracking] ${eventName}`, params);
    }
};

export const TRACKING_EVENTS = {
    VIEW_CONTENT: 'ViewContent',
    INITIATE_CHECKOUT: 'InitiateCheckout',
    LEAD: 'Lead', // For registration
    PURCHASE: 'Purchase', // For top-up
    COMPLETE_REGISTRATION: 'CompleteRegistration',
};
