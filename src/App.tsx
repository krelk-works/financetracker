// ----------------------------------------------
import { Outlet } from 'react-router-dom';
import { Cabecera } from './components/Cabecera';
import { Pie } from './components/Pie';
import { TransactionsProvider } from './contexts/TransactionsContext';

function App() {
    return (
        <>
            <TransactionsProvider storageKey='krelk-ft-transactions'>
                <div className='min-h-screen min-w-screen flex flex-col'>
                    {/* 100vh y columna */}
                    <Cabecera />
                    <main className='flex-1'>
                        {/* ocupa el hueco */}
                        <Outlet />
                    </main>
                    <Pie />
                </div>
            </TransactionsProvider>
        </>
    );
}

export default App;
