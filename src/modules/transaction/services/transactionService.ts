import { ref, get, push, set, remove } from 'firebase/database';
import { database } from '../../../lib/firebase';
import { Transaction, TransactionInput } from '../transaction.types';

const isPermissionError = (error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    return message.includes('Permission denied') || message.includes('permission-denied') || message.includes('PERMISSION_DENIED');
};

// Add Transaction
export const addTransaction = async (uid: string, transaction: TransactionInput): Promise<Transaction> => {
    try {
        const transactionsRef = ref(database, `transactions/${uid}`);
        const newTxnRef = push(transactionsRef);
        const newTxn = { id: newTxnRef.key!, ...transaction };
        await set(newTxnRef, newTxn);
        return newTxn;
    } catch (error) {
        if (isPermissionError(error)) {
            throw new Error('DB_PERMISSION_DENIED');
        }
        throw error;
    }
};

// Get Transactions (fetch all and sort client-side to avoid requiring database indexes)
export const getTransactions = async (uid: string): Promise<Transaction[]> => {
    try {
        const transactionsRef = ref(database, `transactions/${uid}`);
        const snapshot = await get(transactionsRef);

        if (!snapshot.exists()) return [];

        const transactions: Transaction[] = [];
        snapshot.forEach((childSnapshot) => {
            transactions.push(childSnapshot.val() as Transaction);
        });

        return transactions.sort((a, b) => b.date - a.date);
    } catch (error) {
        if (isPermissionError(error)) {
            return [];
        }
        throw error;
    }
};

// Update Transaction
export const updateTransaction = async (uid: string, txnId: string, updates: Partial<TransactionInput>): Promise<void> => {
    try {
        const txnRef = ref(database, `transactions/${uid}/${txnId}`);
        const snapshot = await get(txnRef);
        if (snapshot.exists()) {
            const currentData = snapshot.val();
            await set(txnRef, { ...currentData, ...updates });
        }
    } catch (error) {
        if (isPermissionError(error)) {
            throw new Error('DB_PERMISSION_DENIED');
        }
        throw error;
    }
};

// Delete Transaction
export const deleteTransaction = async (uid: string, txnId: string): Promise<void> => {
    try {
        const txnRef = ref(database, `transactions/${uid}/${txnId}`);
        await remove(txnRef);
    } catch (error) {
        if (isPermissionError(error)) {
            throw new Error('DB_PERMISSION_DENIED');
        }
        throw error;
    }
};
