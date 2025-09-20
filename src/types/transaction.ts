export type Transaction = {
    id: string;
    amount: number;
    category: string;
    date: string; // ISO string
    note?: string;
    type: 'income' | 'expense';
};
