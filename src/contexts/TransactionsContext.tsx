import React, { createContext, useContext, useMemo } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
// tu hook
import type { Transaction } from '@/types/transaction';

/**
 * Qué expone el contexto: exactamente lo que devuelve tu hook,
 * para que no haya diferencias entre “usar el hook” vs “usar el contexto”.
 */
type TransactionsContextValue = ReturnType<typeof useTransactions>;

/**
 * Opcional: props para configurar el provider (storageKey/initial/sort…)
 * y así poder reusar el provider en tests u otras apps.
 */
type TransactionsProviderProps = React.PropsWithChildren<{
    storageKey?: string;
    initial?: Transaction[];
    sort?: (a: Transaction, b: Transaction) => number;
}>;

// Creamos el contexto (inicialmente undefined para poder detectar mal uso)
const TransactionsContext = createContext<TransactionsContextValue | undefined>(
    undefined
);

/**
 * Provider: aquí es donde se crea **UNA ÚNICA INSTANCIA** del hook.
 * Todo lo que esté envuelto por este provider compartirá ese estado.
 */
export function TransactionsProvider({
    children,
    storageKey,
    initial,
    sort,
}: TransactionsProviderProps) {
    // 1) Creamos la instancia del hook una sola vez (por provider)
    const tx = useTransactions({ storageKey, initial, sort });

    // 2) Memoizamos el value para evitar renders inutiles en consumidores
    const value = useMemo(() => tx, [tx]);

    return (
        <TransactionsContext.Provider value={value}>
            {children}
        </TransactionsContext.Provider>
    );
}

/**
 * Hook de consumo: lo usarás en cualquier componente que necesite
 * leer o mutar transacciones. Lanza error si se usa fuera del provider.
 */
export function useTransactionsContext() {
    const ctx = useContext(TransactionsContext);
    if (!ctx) {
        throw new Error(
            'useTransactionsContext debe usarse dentro de <TransactionsProvider>.'
        );
    }
    return ctx;
}
