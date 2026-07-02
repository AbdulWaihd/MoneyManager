export type DashboardSummary = {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  period: 'all' | 'this_month' | 'last_month';
};
