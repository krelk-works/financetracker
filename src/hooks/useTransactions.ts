// src/hooks/useTransactions.ts
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type Transaction } from '@/types/transaction';

/**
 * Opciones configurables del hook.
 * - storageKey: permite cambiar la clave de Local Storage para no colisionar con otros módulos.
 * - initial: datos iniciales si localStorage está vacío (útil para seeds o demo).
 * - sort: cómo quieres ordenar en memoria (por fecha descendente por defecto).
 */
type UseTransactionsOptions = {
    storageKey?: string;
    initial?: Transaction[];
    sort?: (a: Transaction, b: Transaction) => number;
};

/**
 * Utilidad: parsea de forma segura una cadena JSON.
 * - Si hay error, devuelve `fallback`.
 */
function safeParseJSON<T>(value: string | null, fallback: T): T {
    if (!value) return fallback;
    try {
        const parsed = JSON.parse(value);
        return parsed as T;
    } catch {
        return fallback;
    }
}

/**
 * Utilidad: devuelve una copia ordenada según el comparador indicado.
 * - No muta el array original.
 */
function sorted<T>(arr: T[], compareFn?: (a: T, b: T) => number): T[] {
    if (!compareFn) return [...arr];
    return [...arr].sort(compareFn);
}

/**
 * Hook principal: gestiona un estado reactivo de transacciones y
 * lo sincroniza con localStorage de forma transparente.
 *
 * Características:
 * - Carga inicial desde localStorage (si existe).
 * - Si no hay nada en localStorage, usa `initial` (si fue provisto) o [].
 * - Persistencia automática de cada cambio a localStorage.
 * - CRUD básico: add, remove, update, clear, replaceAll.
 * - Helpers de agregación: totales de ingresos, gastos y balance.
 */
export function useTransactions(options?: UseTransactionsOptions) {
    const storageKey = options?.storageKey ?? 'transactions';
    const sortFn =
        options?.sort ??
        // Orden por fecha descendente (más recientes primero) por defecto
        ((a: Transaction, b: Transaction) => {
            // Comparamos ISO strings como fechas (válido porque ISO ordena lexicográficamente)
            if (a.date > b.date) return -1;
            if (a.date < b.date) return 1;
            return 0;
        });

    // Guardamos una referencia a `mounted` para evitar persistir antes de tiempo (hidratar → persistir inmediatamente no es deseable)
    const mountedRef = useRef(false);

    /**
     * Carga inicial:
     * - Intentamos leer localStorage[storageKey].
     * - Si existe, lo parseamos; si falla o no existe, usamos `options.initial` o [].
     *
     * NOTA: Comprobamos window para evitar problemas en SSR (Next.js, etc.).
     */
    const [transactions, setTransactions] = useState<Transaction[]>(() => {
        if (typeof window === 'undefined') {
            // En SSR no hay localStorage; devolvemos initial/[] y más tarde el efecto hidratará si hace falta (en CSR).
            return sorted(options?.initial ?? [], sortFn);
        }
        const raw = window.localStorage.getItem(storageKey);
        const loaded = safeParseJSON<Transaction[]>(
            raw,
            options?.initial ?? []
        );
        return sorted(loaded, sortFn);
    });

    /**
     * Persistencia:
     * - Cada vez que `transactions` cambie y el componente ya esté montado,
     *   guardamos el array en localStorage (stringificado).
     *
     * - Usamos `mountedRef` para saltarnos la primera ejecución después del mount,
     *   ya que el estado inicial ya viene de localStorage; volver a escribir sería redundante.
     */
    useEffect(() => {
        if (!mountedRef.current) {
            mountedRef.current = true;
            return;
        }
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(
                storageKey,
                JSON.stringify(transactions)
            );
        }
    }, [transactions, storageKey]);

    /**
     * Rehidratar manualmente (opcional):
     * - Si cambias `storageKey` dinámicamente o quieres forzar una recarga desde localStorage.
     */
    const reloadFromStorage = useCallback(() => {
        if (typeof window === 'undefined') return;
        const raw = window.localStorage.getItem(storageKey);
        const loaded = safeParseJSON<Transaction[]>(
            raw,
            options?.initial ?? []
        );
        setTransactions(sorted(loaded, sortFn));
    }, [storageKey, options?.initial, sortFn]);

    /**
     * Generador de ID:
     * - Usa crypto.randomUUID() si existe; si no, un fallback simple.
     * - Lo exponemos para que puedas crear IDs fuera del hook si quieres.
     */
    const generateId = useCallback(() => {
        if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
            return crypto.randomUUID() as string;
        }
        // Fallback (suficiente para localStorage)
        return `tx_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    }, []);

    /**
     * ADD:
     * - Añade una nueva transacción.
     * - Si no trae `id`, se lo generamos.
     * - Ordena el array con el comparador configurado.
     */
    const addTransaction = useCallback(
        (tx: Omit<Transaction, 'id'> & Partial<Pick<Transaction, 'id'>>) => {
            const id = tx.id ?? generateId();
            const next: Transaction = { ...tx, id } as Transaction;
            setTransactions((prev) => sorted([...prev, next], sortFn));
            return id; // devolvemos el id final por si el llamador quiere usarlo
        },
        [generateId, sortFn]
    );

    /**
     * REMOVE:
     * - Elimina por id.
     */
    const removeTransaction = useCallback((id: string) => {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
    }, []);

    /**
     * UPDATE:
     * - Actualiza campos puntuales de una transacción por id.
     * - Si cambian campos que afectan al orden (ej. date), re-ordenamos.
     */
    const updateTransaction = useCallback(
        (id: string, patch: Partial<Omit<Transaction, 'id'>>) => {
            setTransactions((prev) => {
                const next = prev.map((t) =>
                    t.id === id ? { ...t, ...patch } : t
                );
                return sorted(next, sortFn);
            });
        },
        [sortFn]
    );

    /**
     * CLEAR:
     * - Vacía todas las transacciones y limpia localStorage para esta clave.
     */
    const clearTransactions = useCallback(() => {
        setTransactions([]);
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem(storageKey);
        }
    }, [storageKey]);

    /**
     * REPLACE ALL:
     * - Reemplaza el array completo (útil para importaciones masivas).
     * - Re-ordena según `sortFn`.
     */
    const replaceAll = useCallback(
        (items: Transaction[]) => {
            setTransactions(sorted(items, sortFn));
        },
        [sortFn]
    );

    /**
     * EXPORT JSON:
     * - Devuelve un string JSON con todas las transacciones actuales (para descargar/respaldar).
     */
    const exportJSON = useCallback(() => {
        return JSON.stringify(transactions, null, 2);
    }, [transactions]);

    /**
     * IMPORT JSON:
     * - Recibe un string JSON, lo parsea y si es válido, reemplaza todas las transacciones.
     * - Devuelve true/false según éxito.
     */
    const importJSON = useCallback(
        (json: string) => {
            try {
                const data = JSON.parse(json) as unknown;
                if (!Array.isArray(data)) return false;

                // Validación mínima de estructura (opcional; ajusta a tus necesidades)
                const valid = (data as any[]).every((t) => {
                    return (
                        typeof t?.id === 'string' &&
                        typeof t?.amount === 'number' &&
                        typeof t?.category === 'string' &&
                        typeof t?.date === 'string' &&
                        (t?.type === 'income' || t?.type === 'expense')
                    );
                });
                if (!valid) return false;

                replaceAll(data as Transaction[]);
                return true;
            } catch {
                return false;
            }
        },
        [replaceAll]
    );

    /**
     * SELECTORS / AGREGADOS:
     * - Cálculos derivados memorizados para no recalcular en cada render.
     */
    const { incomeTotal, expenseTotal, balance } = useMemo(() => {
        let income = 0;
        let expense = 0;
        for (const t of transactions) {
            if (t.type === 'income') income += t.amount;
            else expense += t.amount;
        }
        // expenseTotal en negativo para que balance = income + expense (si expense es negativo)
        // Si prefieres positivo, ajusta el cálculo de balance.
        const expTotal = transactions
            .filter((t) => t.type === 'expense')
            .reduce((acc, t) => acc + t.amount, 0);

        return {
            incomeTotal: income,
            expenseTotal: expTotal, // típico: cantidades de gastos suelen venir como negativas
            balance: income - expTotal,
        };
    }, [transactions]);

    /**
     * Helper: filtrar por mes y año actuales (útil para dashboards).
     * - Devuelve todas las transacciones del mes/año actual (según la zona horaria del sistema).
     */
    const currentMonthTransactions = useMemo(() => {
        const now = new Date();
        const y = now.getFullYear();
        const m = now.getMonth(); // 0..11

        return transactions.filter((t) => {
            const d = new Date(t.date);
            return d.getFullYear() === y && d.getMonth() === m;
        });
    }, [transactions]);

    /**
     * Helper: filtrar por mes anterior (útil para comparativas).
     * - Devuelve todas las transacciones del mes/año anterior (según la zona horaria del sistema).
     */
    const previousMonthTransactions = useMemo(() => {
        const now = new Date();
        const y = now.getFullYear();
        const m = now.getMonth(); // 0..11

        return transactions.filter((t) => {
            const d = new Date(t.date);
            return d.getFullYear() === y && d.getMonth() === m - 1;
        });
    }, [transactions]);

    /** Helper: filtrar por todo el año actual (útil para comparativas).
     * - Devuelve todas las transacciones del año actual (según la zona horaria del sistema).
     */
    const currentYearTransactions = useMemo(() => {
        const now = new Date();
        const y = now.getFullYear();

        return transactions.filter((t) => {
            const d = new Date(t.date);
            return d.getFullYear() === y;
        });
    }, [transactions]);

    /** Balance total de todos los ingresos y gastos */
    const totalBalance = useMemo(() => {
        return transactions.reduce((acc, t) => {
            return acc + (t.type === 'income' ? t.amount : -t.amount);
        }, 0);
    }, [transactions]);

    /** Porcentaje de ingresos respecto al mes pasado */
    const incomePercentageChange = useMemo(() => {
        const currentMonth = currentMonthTransactions.reduce(
            (acc, t) => acc + (t.type === 'income' ? t.amount : 0),
            0
        );
        const previousMonth = previousMonthTransactions.reduce(
            (acc, t) => acc + (t.type === 'income' ? t.amount : 0),
            0
        );
        if (previousMonth === 0) return currentMonth > 0 ? 100 : -100;
        return ((currentMonth - previousMonth) / previousMonth) * 100;
    }, [currentMonthTransactions, previousMonthTransactions]);
    /** Porcentaje de gastos respecto al mes pasado */
    const expensePercentageChange = useMemo(() => {
        const currentMonth = currentMonthTransactions.reduce(
            (acc, t) => acc + (t.type === 'expense' ? t.amount : 0),
            0
        );
        const previousMonth = previousMonthTransactions.reduce(
            (acc, t) => acc + (t.type === 'expense' ? t.amount : 0),
            0
        );
        if (previousMonth === 0) return currentMonth > 0 ? 100 : -100;
        return ((currentMonth - previousMonth) / previousMonth) * 100;
    }, [currentMonthTransactions, previousMonthTransactions]);

    /** Balance total del mes actual */
    const currentMonthBalance = useMemo(() => {
        return currentMonthTransactions.reduce((acc, t) => {
            return acc + (t.type === 'income' ? t.amount : -t.amount);
        }, 0);
    }, [currentMonthTransactions]);

    /** Balance total del mes anterior */
    const previousMonthBalance = useMemo(() => {
        return previousMonthTransactions.reduce((acc, t) => {
            return acc + (t.type === 'income' ? t.amount : -t.amount);
        }, 0);
    }, [previousMonthTransactions]);

    /** Existen ingresos el mes pasado? */
    const hasIncomeLastMonth = useMemo(() => {
        return previousMonthTransactions.some((t) => t.type === 'income');
    }, [previousMonthTransactions]);

    /** Existen gastos el mes pasado? */
    const hasExpenseLastMonth = useMemo(() => {
        return previousMonthTransactions.some((t) => t.type === 'expense');
    }, [previousMonthTransactions]);

    return {
        // Estado principal
        transactions,

        // CRUD
        addTransaction,
        removeTransaction,
        updateTransaction,
        clearTransactions,
        replaceAll,

        // Persistencia y utilidades
        reloadFromStorage,
        exportJSON,
        importJSON,
        generateId,

        // Agregados/selectores
        incomeTotal,
        expenseTotal,
        balance,
        currentMonthTransactions,
        previousMonthTransactions,
        currentYearTransactions,
        totalBalance,
        incomePercentageChange,
        expensePercentageChange,
        currentMonthBalance,
        previousMonthBalance,
        hasIncomeLastMonth,
        hasExpenseLastMonth,
    };
}
