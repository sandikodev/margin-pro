import { useEffect } from 'react';

export function useWebVitals() {
  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return;

    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      const sendToAnalytics = (metric: { name: string; value: number; rating: string }) => {
        if (window.fbq) {
          window.fbq('trackCustom', 'WebVitals', {
            metric: metric.name,
            value: Math.round(metric.value),
            rating: metric.rating,
          });
        }
      };

      onCLS(sendToAnalytics);
      onFID(sendToAnalytics);
      onFCP(sendToAnalytics);
      onLCP(sendToAnalytics);
      onTTFB(sendToAnalytics);
    });
  }, []);
}
