// Menu.tsx
import React, { useEffect } from 'react';
// import { NavLink, useNavigate } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import { appRoutes } from '@/routes';

export function Menu({ onClose }: { onClose: () => void }) {
    // const navigate = useNavigate();

    // Cerrar al pulsar ESC
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    // Click fuera cierra el menú
    const handleClickOutside = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        if ((e.target as HTMLElement).id === 'menu-overlay') onClose();
    };

    // Navegación + cierre del menú
    //   const handleNavigate = (to: string) => {
    //     navigate(to); // como estamos dentro de "/" usamos rutas relativas tipo "dashboard"
    //     onClose();
    //   };

    const baseLink =
        'block w-full text-left px-4 py-3 border-b border-blue-700 hover:bg-blue-200 hover:border-blue-500';
    const activeClass = 'font-semibold underline';

    return (
        <div
            id='menu-overlay'
            className='fixed inset-0 bg-black/50 w-screen h-screen z-50'
            onClick={handleClickOutside}
            role='dialog'
            aria-modal='true'
            aria-label='Menú'
        >
            <div
                className='bg-blue-800 w-64 h-full shadow-xl'
                // evita que el scroll de fondo se mueva en móviles
                onWheel={(e) => e.stopPropagation()}
            >
                <h2 className='text-xl font-bold mb-4 p-4 text-white'>Menú</h2>

                <ul className='text-white'>
                    {appRoutes.map(({ path, label, icon }) => (
                        <li key={path}>
                            {/* Opción A: NavLink controlando activo y cerrando con onClick */}
                            <NavLink
                                to={path} // ruta relativa (porque estamos bajo "/")
                                className={({ isActive }) =>
                                    isActive
                                        ? `${baseLink} ${activeClass}`
                                        : baseLink
                                }
                                onClick={() => onClose()}
                            >
                                <span className='flex items-center gap-2'>
                                    {icon}
                                    {label}
                                </span>
                            </NavLink>

                            {/* Opción B (alternativa): botón que llama navigate() 
                  <button
                    className={baseLink}
                    onClick={() => handleNavigate(path)}
                  >
                    {label}
                  </button>
              */}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
