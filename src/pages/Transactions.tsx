import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { DeleteTransactionModal } from '@/components/DeleteTransactionModal';
import { useTransactionsContext } from '@/contexts/TransactionsContext';
import type { Transaction } from '@/types/transaction';

export const Transactions = () => {
    const [mode, setMode] = useState<
        'currentMonth' | 'previousMonth' | 'currentYear'
    >('currentMonth');
    const [filteredTransactions, setFilteredTransactions] = useState<
        Transaction[]
    >([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteModalId, setDeleteModalId] = useState<string>('');

    const {
        currentMonthTransactions,
        previousMonthTransactions,
        currentYearTransactions,
        removeTransaction,
    } = useTransactionsContext();

    useEffect(() => {
        setLoading(true);
        switch (mode) {
            case 'currentMonth':
                setFilteredTransactions(currentMonthTransactions);
                break;
            case 'previousMonth':
                setFilteredTransactions(previousMonthTransactions);
                break;
            case 'currentYear':
                setFilteredTransactions(currentYearTransactions);
                break;
        }
        setLoading(false);
    }, [
        mode,
        currentMonthTransactions,
        previousMonthTransactions,
        currentYearTransactions,
    ]);

    const handleDeleteModalOpen = (id: string) => {
        setDeleteModalId(id);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = (id: string) => {
        removeTransaction(id);
        setDeleteModalOpen(false);
    };

    return (
        <div className='p-4'>
            <h1 className='text-2xl font-bold mb-4'>Transacciones</h1>
            <div className='bg-white shadow-md rounded-lg p-4 mb-4'>
                <h2 className='text-xl font-semibold mb-2'>Período</h2>
                <div className='flex space-x-2 justify-between'>
                    <button
                        className={`text-sm px-4 py-2 rounded hover:bg-gray-300 ${mode === 'currentMonth' ? 'bg-blue-300' : 'bg-gray-200'}`}
                        onClick={() => setMode('currentMonth')}
                    >
                        Mes Actual
                    </button>
                    <button
                        className={`text-sm px-4 py-2 rounded hover:bg-gray-300 ${mode === 'previousMonth' ? 'bg-blue-300' : 'bg-gray-200'}`}
                        onClick={() => setMode('previousMonth')}
                    >
                        Mes Anterior
                    </button>
                    <button
                        className={`text-sm px-4 py-2 rounded hover:bg-gray-300 ${mode === 'currentYear' ? 'bg-blue-300' : 'bg-gray-200'}`}
                        onClick={() => setMode('currentYear')}
                    >
                        Año Actual
                    </button>
                </div>
            </div>
            <div className='bg-white shadow-md rounded-lg p-4'>
                <h2 className='text-xl font-semibold mb-2'>
                    Lista de Transacciones
                </h2>
                {loading ? (
                    <Skeleton count={5} />
                ) : (
                    <div className='mt-4'>
                        {/* Mapear las transacciones filtradas a componentes individuales */}
                        {filteredTransactions.length === 0 ? (
                            <p className='text-gray-500'>
                                No hay transacciones para este período.
                            </p>
                        ) : (
                            filteredTransactions.map((tx) => (
                                <div
                                    key={tx.id}
                                    className='border-b border-gray-200 py-2'
                                >
                                    <div className='flex justify-between'>
                                        <div>
                                            <p className='font-medium'>
                                                {tx.category}
                                            </p>
                                            <p className='text-sm text-gray-500'>
                                                {new Date(
                                                    tx.date
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className='text-right'>
                                            <p
                                                className={`font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}
                                            >
                                                {tx.type === 'income'
                                                    ? '+'
                                                    : '-'}
                                                {tx.amount.toLocaleString(
                                                    'es-ES',
                                                    {
                                                        style: 'currency',
                                                        currency: 'EUR',
                                                    }
                                                )}
                                            </p>
                                            <button
                                                className='ml-2 text-xs text-gray-500 hover:text-gray-800 bg-red-500 rounded pl-4 pr-4 pt-1 pb-1 text-white cursor-pointer'
                                                onClick={() =>
                                                    handleDeleteModalOpen(tx.id)
                                                }
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                    {tx.note && (
                                        <p className='text-sm text-gray-600 mt-1'>
                                            {tx.note}
                                        </p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
            <DeleteTransactionModal
                isOpen={deleteModalOpen}
                id={deleteModalId}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={(id) => {
                    handleDeleteConfirm(id);
                }}
            />
        </div>
    );
};
