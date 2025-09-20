import { type FormEvent, type MouseEvent, useState } from 'react';
import { useTransactionsContext } from '@/contexts/TransactionsContext';
import { useCategories } from '@/hooks/useCategories';
import type { Transaction } from '@/types/transaction';

export const AddIncomeExpenseModal = ({ onClose }: { onClose: () => void }) => {
    const [errorMessage, setErrorMessage] = useState('');
    const { addTransaction } = useTransactionsContext();
    const { categories } = useCategories();

    const handleClickOutside = (e: MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleOnSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        const newTransaction: Transaction = {
            id: crypto.randomUUID(),
            type: (document.getElementById('type') as HTMLSelectElement)
                .value as 'income' | 'expense',
            amount: parseFloat(
                (document.getElementById('amount') as HTMLInputElement).value
            ),
            category: (document.getElementById('category') as HTMLSelectElement)
                .value,
            date: (document.getElementById('date') as HTMLInputElement).value,
            note: (document.getElementById('note') as HTMLInputElement).value,
        };
        addTransaction(newTransaction);
        // Llamamos a la función onClose para cerrar el modal
        onClose();
    };

    const validateForm = () => {
        const type = (document.getElementById('type') as HTMLSelectElement)
            .value;
        const amount = (document.getElementById('amount') as HTMLInputElement)
            .value;
        const category = (
            document.getElementById('category') as HTMLSelectElement
        ).value;
        const date = (document.getElementById('date') as HTMLInputElement)
            .value;

        if (!type || !amount || !category || !date) {
            setErrorMessage('Por favor, completa todos los campos.');
            return false;
        }
        if (new Date(date) > new Date()) {
            setErrorMessage('La fecha no puede ser en el futuro.');
            return false;
        }
        setErrorMessage('');
        return true;
    };

    // console.log('Categorías disponibles:', categories);

    return (
        <div
            className='fixed inset-0 z-50 w-screen h-screen bg-black/50 flex justify-center items-center'
            onClick={handleClickOutside}
        >
            <div className='bg-white p-6 rounded shadow-lg w-11/12 max-w-md text-gray-800'>
                <h2 className='text-xl font-bold mb-4'>Nueva transacción</h2>
                <form onSubmit={handleOnSubmit}>
                    <div className='mb-4'>
                        <label
                            htmlFor='type'
                            className='block text-sm font-medium text-gray-700 mb-1'
                        >
                            Tipo
                        </label>
                        <select
                            id='type'
                            className='w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-800'
                        >
                            <option value='income'>Ingreso</option>
                            <option value='expense'>Gasto</option>
                        </select>
                    </div>
                    <div className='mb-4'>
                        <label
                            htmlFor='amount'
                            className='block text-sm font-medium text-gray-700 mb-1'
                        >
                            Cantidad
                        </label>
                        <input
                            type='number'
                            id='amount'
                            className='w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800'
                            min={0}
                            step={0.01}
                        />
                    </div>
                    <div className='mb-4'>
                        <label
                            htmlFor='category'
                            className='block text-sm font-medium text-gray-700 mb-1'
                        >
                            Categoría
                        </label>
                        <select
                            id='category'
                            className='w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-800'
                        >
                            <option value=''>Selecciona una categoría</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='mb-4'>
                        <label
                            htmlFor='date'
                            className='block text-sm font-medium text-gray-700 mb-1'
                        >
                            Fecha
                        </label>
                        <input
                            type='date'
                            id='date'
                            className='w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800'
                            max={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    <div className='mb-4'>
                        <label
                            htmlFor='note'
                            className='block text-sm font-medium text-gray-700 mb-1'
                        >
                            Nota (opcional)
                        </label>
                        <input
                            type='text'
                            id='note'
                            className='w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800'
                        />
                    </div>
                    {errorMessage && (
                        <p className='text-red-500 text-sm mb-4'>
                            {errorMessage}
                        </p>
                    )}
                    <button
                        type='submit'
                        className='w-full bg-blue-500 text-white rounded py-2 hover:bg-blue-600'
                    >
                        Añadir
                    </button>
                </form>
            </div>
        </div>
    );
};
