import React, { useState, useEffect } from 'react';
import { api } from '@/lib/client';
import { PlatformConfig, Platform } from '@shared/types';
import { ConfigContext } from './ConfigContext';

export function ConfigProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [platforms, setPlatforms] = useState<Record<Platform, PlatformConfig>>({} as Record<Platform, PlatformConfig>);
    const [translations, setTranslations] = useState<Record<string, { umkm: string; pro: string }>>({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchConfigs = async () => {
        try {
            const res = await api.configs.$get();
            const data = await res.json();

            setSettings(data.settings);

            // Transform platform array to record
            const platformRecord = {} as Record<Platform, PlatformConfig>;
            data.platforms.forEach((p: Record<string, unknown>) => {
                platformRecord[p.id as Platform] = {
                    defaultCommission: Number(p.defaultCommission),
                    defaultFixedFee: Number(p.defaultFixedFee),
                    withdrawalFee: Number(p.withdrawalFee),
                    color: String(p.color),
                    officialTermsUrl: String(p.officialTermsUrl),
                    category: p.category as PlatformConfig['category']
                };
            });
            setPlatforms(platformRecord);

            setTranslations(data.translations);
        } catch (error) {
            console.error('Failed to fetch configs', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchConfigs();
    }, []);

    return (
        <ConfigContext.Provider value={{ settings, platforms, translations, isLoading }}>
            {children}
        </ConfigContext.Provider>
    );
}
