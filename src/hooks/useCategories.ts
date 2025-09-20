import { useCallback, useEffect, useState } from 'react';
import {
    getCategoriesFromLocalStorage,
    saveCategoriesToLocalStorage,
} from '../services/localStorage';

const DEFAULT_CATEGORIES = [
    'salario',
    'freelance',
    'comida',
    'transporte',
    'entretenimiento',
    'servicios',
    'salud',
    'otros',
];

export const useCategories = () => {
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        const stored = getCategoriesFromLocalStorage();

        if (stored.length === 0) {
            // No había nada guardado → inicializamos con default
            setCategories(DEFAULT_CATEGORIES);
            saveCategoriesToLocalStorage(DEFAULT_CATEGORIES);
        } else {
            // Sí había algo guardado → usamos eso
            setCategories(stored);
        }
    }, []);

    const addCategory = useCallback((category: string) => {
        setCategories((prev) => {
            const updated = [...prev, category];
            saveCategoriesToLocalStorage(updated);
            return updated;
        });
    }, []);

    const removeCategory = useCallback((category: string) => {
        setCategories((prev) => {
            const updated = prev.filter((c) => c !== category);
            saveCategoriesToLocalStorage(updated);
            return updated;
        });
    }, []);

    return { categories, addCategory, removeCategory };
};
