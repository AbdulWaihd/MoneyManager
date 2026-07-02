import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { TransactionListScreen, AddTransactionScreen } from '@/modules/transaction';

export default function TransactionsRoute() {
    const params = useLocalSearchParams();
    
    if (params.action === 'add') {
        return <AddTransactionScreen />;
    }
    
    return <TransactionListScreen />;
}