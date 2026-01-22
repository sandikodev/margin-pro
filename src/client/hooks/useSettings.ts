import { useState, useEffect } from 'react';
import { AppSettings } from '@shared/types';
import { useConfig } from '@/hooks/useConfig';
import { STORAGE_KEYS } from '@shared/constants';

const SETTINGS_KEY = STORAGE_KEYS.SETTINGS;

const DEFAULT_SETTINGS: AppSettings = {
  languageMode: 'umkm' // Default to simple language
};

export const useSettings = () => {
  const { translations } = useConfig();
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const toggleLanguage = () => {
    setSettings(prev => ({
      ...prev,
      languageMode: prev.languageMode === 'umkm' ? 'pro' : 'umkm'
    }));
  };

  // Helper to translate key based on current mode
  const t = (key: string) => {
    const term = translations[key];
    return term ? term[settings.languageMode] : key;
  };

  return {
    settings,
    updateSettings,
    toggleLanguage,
    t
  };
};
