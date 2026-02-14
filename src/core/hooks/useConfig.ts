import { useContext } from 'react';
import { ConfigContext } from '@/core/context/ConfigContext';

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) throw new Error("useConfig must be used within a ConfigProvider");
    return context;
};
