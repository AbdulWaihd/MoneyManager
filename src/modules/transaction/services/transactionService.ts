import { ref, get, push, set, remove, query, orderByChild } from 'firebase/database';
import { database } from '../../../lib/firebase';
import { Transaction, TransactionInput } from '../transaction.types';

// Add Transaction
export const addTransaction = async (uid: string, transaction: TransactionInput): Promise<Transaction> => {
    const transactionsRef = ref(database, `transactions/${uid}`);
    const newTxnRef = push(transactionsRef);
    const newTxn = { id: newTxnRef.key!, ...transaction };
    await set(newTxnRef, newTxn);
    return newTxn;
};

// Get Transactions (ordered by date, which requires client-side sorting since Realtime DB orderByChild doesn't strictly sort numerically for all clients the same without indexing, but we'll fetch all and sort)
export const getTransactions = async (uid: string): Promise<Transaction[]> => {
    const transactionsRef = ref(database, `transactions/${uid}`);
    const q = query(transactionsRef, orderByChild('date'));
    const snapshot = await get(q);
    
    if (!snapshot.exists()) return [];
    
    const transactions: Transaction[] = [];
    snapshot.forEach((childSnapshot) => {
        transactions.push(childSnapshot.val() as Transaction);
    });
    
    // Ensure descending order by date (newest first)
    return transactions.sort((a, b) => b.date - a.date);
};

// Update Transaction
export const updateTransaction = async (uid: string, txnId: string, updates: Partial<TransactionInput>): Promise<void> => {
    const txnRef = ref(database, `transactions/${uid}/${txnId}`);
    const snapshot = await get(txnRef);
    if (snapshot.exists()) {
        const currentData = snapshot.val();
        await set(txnRef, { ...currentData, ...updates });
    }
};

// Delete Transaction
export const deleteTransaction = async (uid: string, txnId: string): Promise<void> => {
    const txnRef = ref(database, `transactions/${uid}/${txnId}`);
    await remove(txnRef);
};
