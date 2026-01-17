
import { useState, useEffect } from 'react';
import { AppSettings, LanguageMode } from '../types';
import { TERMINOLOGY } from '../lib/constants';

const SETTINGS_KEY = 'margins_pro_settings_v1';

const DEFAULT_SETTINGS: AppSettings = {
  languageMode: 'umkm' // Default to simple language
};

export const useSettings = () => {
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
  const t = (key: keyof typeof TERMINOLOGY) => {
    const term = TERMINOLOGY[key];
    return term ? term[settings.languageMode] : key;
  };

  return {
    settings,
    updateSettings,
    toggleLanguage,
    t
  };
};
