// import React from 'react'
import { useState } from 'react';
import { DeleteCategoryModal } from '@/components/DeleteCategoryModal';
import { useCategories } from '@/hooks/useCategories';

export const Categories = () => {
    const { categories, removeCategory, addCategory } = useCategories();
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState('');

    const openDeleteModal = (category: string) => {
        setCategoryToDelete(category);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setCategoryToDelete('');
        setDeleteModalOpen(false);
    };

    const handleConfirmDelete = (category: string) => {
        removeCategory(category);
        closeDeleteModal();
    };

    const handleAddCategory = () => {
        const input = document.getElementById(
            'new-category'
        ) as HTMLInputElement;
        const newCategory = input.value.trim();
        if (newCategory && !categories.includes(newCategory)) {
            addCategory(newCategory);
            input.value = '';
        }
    };

    return (
        <div className='p-4'>
            <h1 className='text-2xl font-bold mb-4'>Categorías</h1>

            <div className='mb-4'>
                <label htmlFor='new-category' className='block mb-2'>
                    Nueva categoría
                </label>
                <input
                    id='new-category'
                    type='text'
                    className='border p-2 w-full rounded'
                />
                <button
                    className='mt-2 bg-blue-500 text-white px-4 py-2 rounded'
                    onClick={handleAddCategory}
                >
                    Añadir Categoría
                </button>
            </div>

            {/* Lista de categorías */}
            <ul className='mb-4'>
                {categories.map((cat) => (
                    <li
                        key={cat}
                        className='flex justify-between items-center border-b py-2'
                    >
                        <span>{cat}</span>
                        <button
                            onClick={() => openDeleteModal(cat)}
                            className='ml-2 text-xs text-gray-500 hover:text-gray-800 bg-red-500 rounded pl-4 pr-4 pt-1 pb-1 text-white cursor-pointer'
                        >
                            Eliminar
                        </button>
                    </li>
                ))}
            </ul>
            <DeleteCategoryModal
                isOpen={isDeleteModalOpen}
                category={categoryToDelete}
                onClose={() => {
                    closeDeleteModal();
                }}
                onConfirm={() => {
                    handleConfirmDelete(categoryToDelete);
                }}
            />
        </div>
    );
};
