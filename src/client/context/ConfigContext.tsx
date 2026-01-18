import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/client';
import { PlatformConfig, Platform } from '@shared/types';

interface ConfigContextType {
    settings: Record<string, string>;
    platforms: Record<Platform, PlatformConfig>;
    translations: Record<string, { umkm: string; pro: string }>;
    isLoading: boolean;
    refreshConfigs: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [platforms, setPlatforms] = useState<Record<Platform, PlatformConfig>>({} as any);
    const [translations, setTranslations] = useState<Record<string, { umkm: string; pro: string }>>({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchConfigs = async () => {
        try {
            const res = await api.configs.$get();
            const data = await res.json();
            
            setSettings(data.settings);
            
            // Transform platform array to record
            const platformRecord = {} as Record<Platform, PlatformConfig>;
            data.platforms.forEach((p: any) => {
                platformRecord[p.id as Platform] = {
                    defaultCommission: p.defaultCommission,
                    defaultFixedFee: p.defaultFixedFee,
                    withdrawalFee: p.withdrawalFee,
                    color: p.color,
                    officialTermsUrl: p.officialTermsUrl,
                    category: p.category as any
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

    return (
        <ConfigContext.Provider value={{ settings, platforms, translations, isLoading, refreshConfigs: fetchConfigs }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) throw new Error("useConfig must be used within a ConfigProvider");
    return context;
};
