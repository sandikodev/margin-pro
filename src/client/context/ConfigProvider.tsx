import React, { useState, useEffect } from 'react';
import { api } from '../lib/client';
import { PlatformConfig, Platform } from '@shared/types';
import { ConfigContext } from './ConfigContext';

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
            console.error("Failed to fetch configs", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchConfigs();
    }, []);

    // Non-blocking provider (Public pages render instantly)
    // Consumers must check `isLoading` if they depend on strict config
    // if (isLoading) { return <Loading /> } <--- Removed for Performance

    return (
        <ConfigContext.Provider value={{ settings, platforms, translations, isLoading, refreshConfigs: fetchConfigs }}>
            {children}
        </ConfigContext.Provider>
    );
};
