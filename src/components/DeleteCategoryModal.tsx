/** Modal para confirmar la eliminación de una transacción
 * Props:
 * - isOpen: boolean - Indica si el modal está abierto
 * - id: string - ID de la categoría a eliminar
 * - onClose: () => void - Función para cerrar el modal
 * - onConfirm: () => void - Función para confirmar la eliminación
 */
import { type MouseEvent } from 'react';

export const DeleteCategoryModal = ({
    isOpen,
    category,
    onClose,
    onConfirm,
}: {
    isOpen: boolean;
    category: string;
    onClose: () => void;
    onConfirm: (category: string) => void;
}) => {
    if (!isOpen) return null;
    const handleClickOutside = (e: MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    return (
        <div
            className='fixed inset-0 z-50 w-screen h-screen bg-black/50 flex justify-center items-center'
            onClick={(e) => handleClickOutside(e)}
        >
            <div className='bg-white p-6 rounded shadow-lg w-11/12 max-w-md'>
                <h2 className='text-lg font-semibold mb-4'>
                    Eliminar Categoría
                </h2>
                <p>
                    ¿Estás seguro de que deseas eliminar la categoría {category}
                    ?
                </p>
                <div className='mt-4 flex justify-end'>
                    <button
                        className='bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2'
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        className='bg-red-500 text-white px-4 py-2 rounded'
                        onClick={() => onConfirm(category)}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};
