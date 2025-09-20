import { useCallback, useEffect, useState } from 'react';
import {
    getConfigFromLocalStorage,
    saveConfigToLocalStorage,
} from '@/services/localStorage';
import { type Config, DEFAULT_CONFIG } from '../types/config';

export const useConfig = () => {
    const [config, setConfig] = useState<Config | null>(null);

    useEffect(() => {
        const storedConfig = getConfigFromLocalStorage();
        if (storedConfig) {
            setConfig(storedConfig);
        } else {
            const defaultConfig: Config = DEFAULT_CONFIG;
            setConfig(defaultConfig);
            saveConfigToLocalStorage(defaultConfig);
        }
    }, []);

    const updateConfig = useCallback((newConfig: Config) => {
        setConfig(newConfig);
        saveConfigToLocalStorage(newConfig);
    }, []);

    if (config === null) return { config: DEFAULT_CONFIG, updateConfig };

    return { config, updateConfig };
};
