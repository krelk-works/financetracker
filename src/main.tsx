// main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from './App';
import './index.css';
import { appRoutes } from './routes';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />}>
                    <Route
                        index
                        element={<Navigate to='dashboard' replace />}
                    />
                    {appRoutes.map((r) => (
                        <Route key={r.path} path={r.path} element={r.element} />
                    ))}
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
