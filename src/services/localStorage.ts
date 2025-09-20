import type { Transaction } from '../types/transaction';

const TRANSACTIONS_KEY = 'krelk-ft-transactions';
const CATEGORIES_KEY = 'krelk-ft-categories';
const CONFIG_KEY = 'krelk-ft-config';

export const saveTransactionsToLocalStorage = (transactions: Transaction[]) => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

export const saveCategoriesToLocalStorage = (categories: string[]) => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

/** TODO: Pendiente definir un tipo Config */
export const saveConfigToLocalStorage = (config: any) => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
};

export const getTransactionsFromLocalStorage = (): Transaction[] => {
    const transactions = localStorage.getItem(TRANSACTIONS_KEY);
    return transactions ? JSON.parse(transactions) : [];
};

export const getCategoriesFromLocalStorage = (): string[] => {
    const categories = localStorage.getItem(CATEGORIES_KEY);
    return categories ? JSON.parse(categories) : [];
};

/** TODO: Pendiente definir un tipo Config */
export const getConfigFromLocalStorage = (): any => {
    const config = localStorage.getItem(CONFIG_KEY);
    return config ? JSON.parse(config) : {};
};
