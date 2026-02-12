import { createContext } from 'react';
import { PlatformConfig, Platform } from '@shared/types';

export interface ConfigContextType {
    settings: Record<string, string>;
    platforms: Record<Platform, PlatformConfig>;
    translations: Record<string, { umkm: string; pro: string }>;
    isLoading: boolean;
    refreshConfigs: () => Promise<void>;
}

export const ConfigContext = createContext<ConfigContextType | undefined>(undefined);
