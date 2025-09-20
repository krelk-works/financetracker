import { useEffect, useState } from 'react';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { useTransactionsContext } from '@/contexts/TransactionsContext';
import { exportData } from '@/services/exports';
import type {
    BackupCustomPeriod,
    BackupFormat,
    BackupPeriod,
    BackupType,
} from '@/types/backup';

export const Backup = () => {
    const { transactions } = useTransactionsContext();

    const [transactionsType, setTransactionsType] = useState<BackupType>('all');
    const [transactionsPeriod, setTransactionsPeriod] =
        useState<BackupPeriod>('all_time');
    const [transactionsCustomPeriod, setTransactionsCustomPeriod] =
        useState<BackupCustomPeriod | null>(null);
    const [transactionsFormat, setTransactionsFormat] =
        useState<BackupFormat>('csv');

    const [errors, setErrors] = useState<string | null>(null);

    const [findedTransactions, setFindedTransactions] = useState(0);

    const handleTypeChange = (newType: string) => {
        setTransactionsType(newType as BackupType);
    };

    const handlePeriodChange = (newPeriod: string) => {
        setTransactionsPeriod(newPeriod as BackupPeriod);
    };

    const handleFormatChange = (newFormat: string) => {
        setTransactionsFormat(newFormat as BackupFormat);
    };

    const filterTransactionsByType = (type: BackupType) => {
        if (type === 'all') return transactions;
        return transactions.filter(
            (transaction) => transaction.type === type.slice(0, -1)
        ); // 'incomes' -> 'income', 'expenses' -> 'expense'
    };

    const filterTransactionsByPeriod = (
        period: BackupPeriod,
        data: typeof transactions
    ) => {
        const now = new Date();
        let startDate: Date;

        switch (period) {
            case 'last_week':
                startDate = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate() - 7
                );
                break;
            case 'last_month':
                startDate = new Date(
                    now.getFullYear(),
                    now.getMonth() - 1,
                    now.getDate()
                );
                break;
            case 'last_year':
                startDate = new Date(
                    now.getFullYear() - 1,
                    now.getMonth(),
                    now.getDate()
                );
                break;
            case 'custom':
                if (transactionsCustomPeriod) {
                    startDate = transactionsCustomPeriod.startDate;
                    const endDate = transactionsCustomPeriod.endDate;
                    return data.filter((transaction) => {
                        const transactionDate = new Date(transaction.date);
                        return (
                            transactionDate >= startDate &&
                            transactionDate <= endDate
                        );
                    });
                }
                return data; // Si no hay periodo personalizado, no filtramos
            case 'all_time':
            default:
                return data; // No filtramos
        }

        return data.filter(
            (transaction) => new Date(transaction.date) >= startDate
        );
    };

    const handleExport = () => {
        if (findedTransactions === 0) return;
        if (transactionsPeriod === 'custom' && !transactionsCustomPeriod) {
            setErrors('Por favor, selecciona un periodo personalizado válido.');
            return;
        }
        setErrors(null);
        const filteredByType = filterTransactionsByType(transactionsType);
        const filteredByPeriod = filterTransactionsByPeriod(
            transactionsPeriod,
            filteredByType
        );
        exportData(filteredByPeriod, transactionsFormat);
    };

    const handleSearchTransactions = () => {
        const filteredByType = filterTransactionsByType(transactionsType);
        const filteredByPeriod = filterTransactionsByPeriod(
            transactionsPeriod,
            filteredByType
        );
        setFindedTransactions(filteredByPeriod.length);
    };

    useEffect(() => {
        handleSearchTransactions();
    }, [transactionsType, transactionsPeriod, transactionsCustomPeriod]);

    return (
        <div className='p-4'>
            <h1 className='text-2xl font-bold mb-4'>Backup</h1>
            <p>Aqui podrás exportar tus datos a CSV.</p>

            <div className='mt-4 flex space-x-2 mb-4'>
                <select
                    className='mr-1 border p-2 rounded'
                    onChange={(e) => handleTypeChange(e.target.value)}
                >
                    <option value='all'>Todo</option>
                    <option value='incomes'>Ingresos</option>
                    <option value='expenses'>Gastos</option>
                </select>
                <select
                    className='mr-1 border p-2 rounded'
                    onChange={(e) => handlePeriodChange(e.target.value)}
                >
                    <option value='all_time'>Todo el tiempo</option>
                    <option value='last_week'>Última semana</option>
                    <option value='last_month'>Último mes</option>
                    <option value='last_year'>Último año</option>
                    <option value='custom'>Personalizado</option>
                </select>
                <select
                    className='mr-1 border p-2 rounded'
                    onChange={(e) => handleFormatChange(e.target.value)}
                >
                    <option value='csv'>CSV</option>
                    <option value='json'>JSON</option>
                </select>
            </div>
            {transactionsPeriod === 'custom' && (
                <div className='mt-4 flex space-x-2 mb-4'>
                    <input
                        type='date'
                        className='border p-2 rounded'
                        onChange={(e) => {
                            const startDate = new Date(e.target.value);
                            setTransactionsCustomPeriod((prev) => ({
                                startDate,
                                endDate: prev ? prev.endDate : startDate,
                            }));
                        }}
                    />
                    <input
                        type='date'
                        className='border p-2 rounded'
                        onChange={(e) => {
                            const endDate = new Date(e.target.value);
                            setTransactionsCustomPeriod((prev) => ({
                                startDate: prev ? prev.startDate : endDate,
                                endDate,
                            }));
                        }}
                    />
                </div>
            )}

            {errors && <p className='text-red-500 mb-4'>{errors}</p>}
            <button
                className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
                onClick={handleExport}
            >
                <DownloadForOfflineIcon
                    fontSize='small'
                    style={{ marginTop: '-4px', marginRight: '4px' }}
                />
                Exportar
            </button>
            {findedTransactions > 0 ? (
                <p className='text-gray-500 p-2'>
                    Se han encontrado{' '}
                    <span className='font-semibold'>{findedTransactions}</span>{' '}
                    transacciones.
                </p>
            ) : (
                <p className='text-red-500 p-2'>
                    No se han encontrado transacciones.
                </p>
            )}
        </div>
    );
};
