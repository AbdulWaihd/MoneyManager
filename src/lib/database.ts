// src/services/firebase/database.ts
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
import { database } from './firebase';
import { Transaction, TransactionInput } from '../modules/transaction/transaction.types';
import { Category, CategoryInput } from '../modules/category/category.types';

// TRANSACTIONS

// auth is  Firebase service object.

// Add transaction
export const addTransaction = async (uid: string, transaction: TransactionInput): Promise<string | null> => {
    // Creates a pointer to the location transactions/userId in your database. 
    const transactionRef = ref(database, `transactions/${uid}`);
    // push() creates a new child node under that location with a unique key, and returns a reference to it.
    const newRef = push(transactionRef);
    // set() takes that new reference and writes the transaction data to it.
    await set(newRef, transaction);
    // Returns the unique key of the new transaction, which can be used for future updates or deletions.
    return newRef.key;
};

// Get all transactions

export const getTransactions = async (uid: string): Promise<Transaction[]> => {
    // Creates a reference to transactions/userId in the database, then retrieves the data at that location. If no data exists, it returns an empty array.
    const transactionRef = ref(database, `transactions/${uid}`);

    // get() reads the data at the specified reference. If it exists, we take the snapshot of that data, convert it from an object to an array (since Firebase stores lists as objects with unique keys), and return it. Each transaction in the array also includes its unique id for easy reference.
    const snapshot = await get(transactionRef);

    // If snapshot.exists() is false, it means there are no transactions for that user, so we return an empty array. Otherwise, we take the data (which is an object where each key is a transaction ID and the value is the transaction data), convert it to an array of transactions, and include the transaction ID as part of each transaction object.
    if (!snapshot.exists()) return [];

    // snapshot.val() returns the raw data object from Firebase. We then use Object.keys() to get an array of transaction IDs, and map over that array to create a new array of transaction objects. Each transaction object includes all the original data (using the spread operator) plus an 'id' field that contains the transaction ID (the key from Firebase).
    const data = snapshot.val();
    return Object.entries(data).map(([key, value]) => ({
        //assert that value is a Transaction type,
        ...(value as Transaction),
        id: key,
    }));
};

// Update transaction
// Partial<Transaction> means every field becomes optional: you can pass just the fields you want to update, and the rest will stay the same.
export const updateTransaction = async (uid: string, transactionId: string, transaction: Partial<Transaction>) => {
    const transactionRef = ref(database, `transactions/${uid}/${transactionId}`);
    await update(transactionRef, transaction);
};

// Delete transaction
export const deleteTransaction = async (uid: string, transactionId: string) => {
    const transactionRef = ref(database, `transactions/${uid}/${transactionId}`);
    await remove(transactionRef);
};


//  CATEGORIES

// Add category
export const addCategory = async (uid: string, category: CategoryInput): Promise<string | null> => {
    const categoryRef = ref(database, `categories/${uid}`);
    const newRef = push(categoryRef);
    await set(newRef, category);
    return newRef.key;
};

// Get all categories
export const getCategories = async (uid: string): Promise<Category[]> => {
    const categoryRef = ref(database, `categories/${uid}`);
    const snapshot = await get(categoryRef);
    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    return Object.entries(data).map(([key, value]) => ({
        ...(value as Category),
        id: key,
    }));
};

// Update category
export const updateCategory = async (uid: string, categoryId: string, category: Partial<Category>) => {
    const categoryRef = ref(database, `categories/${uid}/${categoryId}`);
    await update(categoryRef, category);
};

// Delete category
export const deleteCategory = async (uid: string, categoryId: string) => {
    const categoryRef = ref(database, `categories/${uid}/${categoryId}`);
    await remove(categoryRef);
};


// USER DATA 
// Create user profile after signup
export const createUserProfile = async (
    uid: string,
    data: {
        displayName: string;
        email: string;
        preferredCurrency: string;
    }
) => {
    const userRef = ref(database, `users/${uid}/profile`);
    await set(userRef, data);
};

// Get user profile
export const getUserProfile = async (uid: string) => {
    const userRef = ref(database, `users/${uid}/profile`);
    const snapshot = await get(userRef);
    if (!snapshot.exists()) return null;
    return snapshot.val();
};

// Delete all user data (called on account deletion)

export const deleteUserData = async (uid: string) => {
    await remove(ref(database, `users/${uid}`));
    await remove(ref(database, `transactions/${uid}`));
    await remove(ref(database, `categories/${uid}`));
};