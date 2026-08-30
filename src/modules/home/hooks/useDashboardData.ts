import { useState, useEffect, useCallback } from 'react';
import { getTransactions } from '../../transaction/services/transactionService';
import { Transaction } from '../../transaction/transaction.types';
import { DashboardSummary } from '../home.types';
import { getCurrentUser } from '../../auth';
import { getCategories } from '../../category/services/categoryService';
import { Category } from '../../category/category.types';
import { attachCategoryDetails, TransactionWithCategory } from '../../../utils/finance';
import { useLoading } from '../../../contexts/LoadingContext';

export function useDashboardData(period: DashboardSummary['period'] = 'this_month') {
    const [summary, setSummary] = useState<DashboardSummary>({
        totalBalance: 0,
        totalIncome: 0,
        totalExpense: 0,
        period,
    });
    const [recentTransactions, setRecentTransactions] = useState<TransactionWithCategory[]>([]);
    const [expenseBreakdown, setExpenseBreakdown] = useState<any[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
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
            
            const [allTxns, allCategories] = await Promise.all([
                getTransactions(user.uid),
                getCategories(user.uid)
            ]);
            setCategories(allCategories);
            
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
            const top5 = filteredTxns.slice(0, 5);
            setRecentTransactions(attachCategoryDetails(top5, allCategories));

            // Expense Breakdown
            const expenses = filteredTxns.filter(t => t.type === 'expense');
            const totalExp = expenses.reduce((sum, t) => sum + t.amount, 0);
            
            if (totalExp > 0) {
                const breakdownMap = new Map<string, number>();
                expenses.forEach(t => {
                    breakdownMap.set(t.category, (breakdownMap.get(t.category) || 0) + t.amount);
                });
                
                const breakdown = Array.from(breakdownMap.entries())
                    .map(([catId, amount]) => {
                        const cat = allCategories.find(c => c.id === catId);
                        return {
                            categoryId: catId,
                            title: cat?.title || 'Unknown',
                            color: cat?.color || '#ccc',
                            amount,
                            percentage: Math.round((amount / totalExp) * 100)
                        };
                    })
                    .sort((a, b) => b.amount - a.amount);
                setExpenseBreakdown(breakdown);
            } else {
                setExpenseBreakdown([]);
            }
            
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

    return { summary, recentTransactions, expenseBreakdown, categories, isLoadingData, error, refetch: fetchData };
}
