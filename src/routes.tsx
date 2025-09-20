// src/routes.tsx
import { type JSX } from 'react';
import { Backup } from '@/pages/Backup';
import { Categories } from '@/pages/Categories';
// paginas
import { Dashboard } from '@/pages/Dashboard';
// import { Settings } from '@/pages/Settings';
import { Statistics } from '@/pages/Statistics';
import { Transactions } from '@/pages/Transactions';

export type AppRoute = {
    path: string; // ruta relativa a "/"
    label: string; // texto visible en menú
    element: JSX.Element;
    icon?: JSX.Element; // opcional, si quieres añadir un icono en el menú
};

export const appRoutes: AppRoute[] = [
    { path: 'dashboard', label: 'Dashboard', element: <Dashboard /> },
    { path: 'transactions', label: 'Transactions', element: <Transactions /> },
    { path: 'statistics', label: 'Statistics', element: <Statistics /> },
    { path: 'categories', label: 'Categories', element: <Categories /> },
    { path: 'backup', label: 'Backup', element: <Backup /> },
    // { path: 'settings', label: 'Settings', element: <Settings /> },
];
