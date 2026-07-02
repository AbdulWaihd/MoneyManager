import { useState, useEffect, useCallback } from 'react';
import { getTransactions } from '../../transaction/services/transactionService';
import { Transaction } from '../../transaction/transaction.types';
import { DashboardSummary } from '../home.types';
import { getCurrentUser } from '../../auth';
import { useLoading } from '../../../contexts/LoadingContext';

export function useDashboardData(period: DashboardSummary['period'] = 'this_month') {
    const [summary, setSummary] = useState<DashboardSummary>({
        totalBalance: 0,
        totalIncome: 0,
        totalExpense: 0,
        period,
    });
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        const user = getCurrentUser();
        if (!user) {
            setError('User not authenticated');
            setIsLoadingData(false);
            return;
        }

        try {
            setIsLoadingData(true);
            setError(null);
            const allTxns = await getTransactions(user.uid);
            
            // Filter by period
            const now = new Date();
            const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
            
            let filteredTxns = allTxns;
            
            if (period === 'this_month') {
                filteredTxns = allTxns.filter(t => t.date >= startOfThisMonth);
            } else if (period === 'last_month') {
                filteredTxns = allTxns.filter(t => t.date >= startOfLastMonth && t.date < startOfThisMonth);
            }

            // Aggregate
            let income = 0;
            let expense = 0;
            
            filteredTxns.forEach(t => {
                if (t.type === 'income') income += t.amount;
                if (t.type === 'expense') expense += t.amount;
            });
            
            setSummary({
                totalBalance: income - expense,
                totalIncome: income,
                totalExpense: expense,
                period
            });
            
            // Recent transactions (top 5 from filtered)
            setRecentTransactions(filteredTxns.slice(0, 5));
            
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data');
        } finally {
            setIsLoadingData(false);
        }
    }, [period]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { summary, recentTransactions, isLoadingData, error, refetch: fetchData };
}
