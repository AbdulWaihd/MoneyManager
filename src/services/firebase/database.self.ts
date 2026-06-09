import {
    ref,
    set,
    get,
    update,
    remove,
    push,
    query,
    orderByChild,
    limitToLast,
} from 'firebase/database';
import { database } from './config';
import { Transaction, TransactionInput } from '../../types/transaction.types';
import { Category, CategoryInput } from '../../types/category.types';

// transaction 

// Add transaction

export const addTransaction = async (uid: string, transaction: TransactionInput): Promise<string | null> => {
    const transactionRef = ref(database, `transaction/${uid}`);
    // newRef is a full Firebase reference object. It holds a lot of internal stuff:
    const newRef = push(transactionRef);
    await set(newRef, transaction);

    return newRef.key;
}

// get all transaction


export const getTransactions = async (uid: string): Promise<Transaction[]> => {
    const transactionRef = ref(database, `transactions/${uid}`);
    const snapshot = await get(transactionRef);

    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    return Object.entries(data).map(([key, value]) => ({
        ...(value as Transaction),
        id: key,
    }));
};

// update transaction

export const updateTransaction=async(uid:string,transactionId:string,transaction:Partial<Transaction>)=>{
    const 
}