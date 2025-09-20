import React from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { AddIncomeExpenseModal } from './AddIncomeExpenseModal';
import { Menu } from './Menu';

export const Cabecera = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <header className='bg-blue-600 text-white p-2 flex justify-between items-center shadow-md'>
                <div className='flex items-center w-1/3'>
                    <MenuIcon
                        className='cursor-pointer m-2 hover:text-green-200 mx-3 sm:font-size-sm'
                        onClick={() => {
                            handleMenuClick();
                        }}
                    />
                    <h1 className='sm:font-size-xs font-bold'>
                        Finance Tracker
                    </h1>
                </div>
                <div className='w-1/3 text-center'>
                    <h2 className='sm:font-size-xs md:text-lg font-medium'>
                        {/* título dinámico según la página */}
                    </h2>
                </div>
                <div className='w-1/3 text-right'>
                    <AddCircleIcon
                        className='cursor-pointer m-2 hover:text-green-200 mx-3 sm:font-size-sm'
                        onClick={() => {
                            setIsAddModalOpen(true);
                        }}
                    />
                </div>
                {isMenuOpen && <Menu onClose={() => setIsMenuOpen(false)} />}
                {isAddModalOpen && (
                    <AddIncomeExpenseModal
                        onClose={() => {
                            setIsAddModalOpen(false);
                        }}
                    />
                )}
            </header>
        </>
    );
};
