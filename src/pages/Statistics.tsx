import {
    Bar,
    BarChart,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { useTransactionsContext } from '@/contexts/TransactionsContext';

export const Statistics = () => {
    const {
        totalBalance,
        incomePercentageChange,
        expensePercentageChange,
        currentMonthBalance,
        previousMonthBalance,
        hasIncomeLastMonth,
        hasExpenseLastMonth,
    } = useTransactionsContext();

    const currentMonthLabel = new Date().toLocaleString('es-ES', {
        month: 'long',
    });
    const lastMonthLabel = new Date(
        new Date().setMonth(new Date().getMonth() - 1)
    ).toLocaleString('es-ES', { month: 'long' });

    return (
        <div className='p-4'>
            <h1 className='text-2xl font-bold mb-4'>Estadísticas</h1>

            <div className='bg-white shadow-md rounded-lg p-4 mb-4'>
                <h2 className='text-xl font-semibold mb-0'>
                    Balance total{' '}
                    <span
                        className={`text-lg font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                        {totalBalance >= 0 ? `+` : `-`}
                        {totalBalance.toLocaleString('es-ES', {
                            style: 'currency',
                            currency: 'EUR',
                        })}
                    </span>
                </h2>
            </div>

            <div className='bg-white shadow-md rounded-lg p-4 mb-4'>
                <h2 className='text-md font-semibold mb-0 text-gray-800'>
                    Comparativas con el mes anterior
                </h2>

                <div className='text-gray-600 mt-2'>
                    {hasIncomeLastMonth ? (
                        <p
                            className={`${incomePercentageChange > 0 ? 'text-green-600' : 'text-red-600'} border-b mb-2 pb-1`}
                        >
                            {incomePercentageChange > 0
                                ? `+${incomePercentageChange.toFixed(2)}%`
                                : `${incomePercentageChange.toFixed(2)}%`}{' '}
                            en ingresos
                        </p>
                    ) : (
                        <p className='mb-2 pb-1 text-sm'>
                            <li>
                                No hay suficientes datos para calcular el cambio
                                en ingresos
                            </li>
                        </p>
                    )}

                    {hasExpenseLastMonth ? (
                        <p
                            className={`${expensePercentageChange > 0 ? 'text-red-600' : 'text-green-600'} border-b mb-2 pb-1`}
                        >
                            {expensePercentageChange > 0
                                ? `+${expensePercentageChange.toFixed(2)}%`
                                : `${expensePercentageChange.toFixed(2)}%`}{' '}
                            en gastos
                        </p>
                    ) : (
                        <p className='mb-2 pb-1 text-sm'>
                            <li>
                                No hay suficientes datos para calcular el cambio
                                en gastos
                            </li>
                        </p>
                    )}
                    {hasIncomeLastMonth && hasExpenseLastMonth && (
                        <ResponsiveContainer
                            width='100%'
                            height={250}
                            className='mt-4'
                        >
                            <BarChart
                                data={[
                                    {
                                        name: lastMonthLabel,
                                        Balance: previousMonthBalance,
                                    },
                                    {
                                        name: currentMonthLabel,
                                        Balance: currentMonthBalance,
                                    },
                                ]}
                                margin={{
                                    top: 20,
                                    right: 0,
                                    left: -40,
                                    bottom: 0,
                                }}
                            >
                                <XAxis dataKey='name' />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey='Balance' fill='#0166fdff' />
                                <Line
                                    type='monotone'
                                    dataKey='Tendencia'
                                    stroke={
                                        currentMonthBalance >=
                                        previousMonthBalance
                                            ? '#82ca9d'
                                            : '#ff1100ff'
                                    }
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
};
