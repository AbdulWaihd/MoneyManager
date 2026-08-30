import { Transaction } from '../modules/transaction/transaction.types';
import { Category } from '../modules/category/category.types';

export type TransactionWithCategory = Transaction & {
    categoryTitle: string;
    categoryColor?: string;
    categoryIcon?: string;
};

export type DateGroup = {
    title: string;
    data: TransactionWithCategory[];
};

export const formatMoney = (amount: number, showSign = false, type?: Transaction['type']) => {
    const sign = showSign ? (type === 'income' ? '+' : '-') : amount < 0 ? '-' : '';
    const absoluteAmount = Math.abs(amount) / 100;

    return `${sign}$${absoluteAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

export const parseAmountToCents = (amount: string) => {
    const normalized = amount.replace(/,/g, '').trim();
    return Math.round(Number(normalized) * 100);
};

export const formatAmountInput = (value: string) => {
    const cleaned = value.replace(/[^\d.]/g, '');
    const [whole, decimal] = cleaned.split('.');

    if (decimal === undefined) return whole;
    return `${whole}.${decimal.slice(0, 2)}`;
};

export const startOfMonth = (date = new Date()) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getTime();

export const startOfPreviousMonth = (date = new Date()) =>
    new Date(date.getFullYear(), date.getMonth() - 1, 1).getTime();

export const isSameDay = (left: Date, right: Date) =>
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate();

export const getDateLabel = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (isSameDay(date, today)) return 'Today';
    if (isSameDay(date, yesterday)) return 'Yesterday';

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() === today.getFullYear() ? undefined : 'numeric',
    });
};

export const getTimeLabel = (timestamp: number) =>
    new Date(timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });

export const attachCategoryDetails = (
    transactions: Transaction[],
    categories: Category[]
): TransactionWithCategory[] => {
    return transactions.map((transaction) => {
        const category = categories.find((item) => item.id === transaction.category);

        return {
            ...transaction,
            categoryTitle: category?.title || 'Uncategorized',
            categoryColor: category?.color,
            categoryIcon: category?.icon,
        };
    });
};

export const groupTransactionsByDate = (transactions: TransactionWithCategory[]): DateGroup[] => {
    const groups = transactions.reduce<Record<string, TransactionWithCategory[]>>((acc, transaction) => {
        const label = getDateLabel(transaction.date);
        acc[label] = acc[label] || [];
        acc[label].push(transaction);
        return acc;
    }, {});

    return Object.entries(groups).map(([title, data]) => ({ title, data }));
};

export const summarizeTransactions = (transactions: Transaction[]) => {
    return transactions.reduce(
        (summary, transaction) => {
            if (transaction.type === 'income') {
                summary.income += transaction.amount;
            } else {
                summary.expense += transaction.amount;
            }

            summary.balance = summary.income - summary.expense;
            return summary;
        },
        { income: 0, expense: 0, balance: 0 }
    );
};
