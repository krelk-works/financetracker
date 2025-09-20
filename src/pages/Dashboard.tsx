import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { useTransactionsContext } from '@/contexts/TransactionsContext';

export const Dashboard = () => {
    // Estados para almacenar los ingresos, gastos, y los totales
    const { currentMonthTransactions, incomeTotal, expenseTotal, balance } =
        useTransactionsContext();

    const [graphData, setGraphData] = useState<
        { day: number; balance: number }[]
    >([]);

    const [graphLoaded, setGraphLoaded] = useState<boolean>(false);

    useEffect(() => {
        if (currentMonthTransactions.length === 0) return;

        const now = new Date();
        const days = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0
        ).getDate();

        let lastBalance = 0;
        const temp: { day: number; balance: number }[] = [];

        for (let day = 1; day <= days; day++) {
            const dailyTransactions = currentMonthTransactions.filter((tx) => {
                const d = new Date(tx.date);
                return d.getDate() === day;
            });

            const dailyBalance = dailyTransactions.reduce((acc, tx) => {
                return tx.type === 'income' ? acc + tx.amount : acc - tx.amount;
            }, lastBalance);

            lastBalance = dailyBalance;
            temp.push({ day, balance: dailyBalance });
        }

        // Hacer una espera artificial para simular carga
        setGraphData(temp);
        setGraphLoaded(true);
    }, [currentMonthTransactions]);

    return (
        <div className='p-4'>
            {/** Card con el mes actual y el año */}
            <div className='bg-white shadow-md rounded-lg p-4 mb-4'>
                <h2 className='text-xl font-semibold mb-2'>
                    Resumen de{' '}
                    {new Date().toLocaleString('es-ES', {
                        month: 'long',
                        year: 'numeric',
                    })}
                </h2>
            </div>
            {/** Tarjeta de Rendimiento del Mes actual */}
            {graphData.length > 0 && (
                <div className='bg-white shadow-md rounded-lg p-4 mb-4'>
                    <h2 className='text-xl font-semibold mb-2'>
                        Rendimiento del Mes
                    </h2>

                    {graphLoaded ? (
                        <div className='w-full' style={{ height: 200 }}>
                            <ResponsiveContainer width='100%' height='100%'>
                                <LineChart
                                    data={graphData}
                                    margin={{
                                        top: 8,
                                        right: 16,
                                        bottom: 8,
                                        left: 0,
                                    }}
                                >
                                    <XAxis dataKey='day' />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray='3 3' />
                                    <Tooltip />
                                    <Line
                                        type='monotone'
                                        dataKey='balance'
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <Skeleton
                            height={200}
                            style={{ margin: '8px 0px 8px 0' }}
                        />
                    )}
                </div>
            )}

            {/** Tarjeta de KPI de Ingresos  */}
            <div className='bg-white shadow-md rounded-lg p-4 mb-4'>
                <h2 className='text-xl font-semibold mb-2'>Total Ingresos</h2>
                <p className='text-3xl font-bold text-green-500'>
                    {incomeTotal.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                    })}
                </p>
            </div>
            {/** Tarjeta de KPI de Gastos  */}
            <div className='bg-white shadow-md rounded-lg p-4 mb-4'>
                <h2 className='text-xl font-semibold mb-2'>Total Gastos</h2>
                <p className='text-3xl font-bold text-red-500'>
                    {expenseTotal.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                    })}
                </p>
            </div>
            {/** Tarjeta de KPI de Balance  */}
            <div className='bg-white shadow-md rounded-lg p-4 mb-4'>
                <h2 className='text-xl font-semibold mb-2'>Balance</h2>
                <p className='text-3xl font-bold text-blue-500'>
                    {balance.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                    })}
                </p>
            </div>
        </div>
    );
};
