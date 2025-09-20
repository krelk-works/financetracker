/** Aqui manejaremos la logica de exportacion de datos en CSV y en JSON */
import type { BackupFormat } from '@/types/backup';
import type { Transaction } from '@/types/transaction';

export const exportData = (data: Transaction[], BackupFormat: BackupFormat) => {
    if (data.length === 0) {
        return;
    }

    if (BackupFormat === 'csv') {
        // Generamos el CSV pero sin el id de las transacciones.
        const headers = Object.keys(data[0]).filter(
            (header) => header !== 'id'
        );
        const csvRows = [
            headers.join(','), // Cabecera
            ...data.map((row) =>
                headers
                    .map((fieldName) => {
                        const escaped = (
                            '' + row[fieldName as keyof Transaction]
                        ).replace(/"/g, '\\"');
                        return `"${escaped}"`;
                    })
                    .join(',')
            ),
        ];
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'transactions.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else if (BackupFormat === 'json') {
        // Generamos el JSON pero sin el id de las transacciones.
        const dataWithoutId = data.map(({ id, ...rest }) => rest);
        const jsonContent = JSON.stringify(dataWithoutId, null, 2);
        const blob = new Blob([jsonContent], {
            type: 'application/json;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'transactions.json');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
