import { ref, get, push, set, remove } from 'firebase/database';
import { database } from '../../../lib/firebase';
import { Category, CategoryInput } from '../category.types';

const isPermissionError = (error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    return message.includes('Permission denied') || message.includes('permission-denied') || message.includes('PERMISSION_DENIED');
};

// Add Category
export const addCategory = async (uid: string, category: CategoryInput): Promise<Category> => {
    try {
        const categoriesRef = ref(database, `categories/${uid}`);
        const existingCategories = await getCategories(uid);
        const duplicate = existingCategories.some((item) =>
            item.type === category.type &&
            item.title.trim().toLowerCase() === category.title.trim().toLowerCase()
        );

        if (duplicate) {
            throw new Error('CATEGORY_DUPLICATE');
        }

        const newCategoryRef = push(categoriesRef);
        const newCategory = {
            id: newCategoryRef.key!,
            ...category,
            title: category.title.trim(),
        };
        await set(newCategoryRef, newCategory);
        return newCategory;
    } catch (error) {
        if (isPermissionError(error)) {
            throw new Error('DB_PERMISSION_DENIED');
        }
        throw error;
    }
};

// Get Categories
export const getCategories = async (uid: string): Promise<Category[]> => {
    try {
        const categoriesRef = ref(database, `categories/${uid}`);
        const snapshot = await get(categoriesRef);
        if (!snapshot.exists()) return [];

        const categories: Category[] = [];
        snapshot.forEach((childSnapshot) => {
            categories.push(childSnapshot.val() as Category);
        });
        return categories;
    } catch (error) {
        if (isPermissionError(error)) {
            return [];
        }
        throw error;
    }
};

// Update Category
export const updateCategory = async (uid: string, categoryId: string, updates: Partial<CategoryInput>): Promise<void> => {
    try {
        const categoryRef = ref(database, `categories/${uid}/${categoryId}`);
        const snapshot = await get(categoryRef);
        if (snapshot.exists()) {
            const currentData = snapshot.val();
            await set(categoryRef, { ...currentData, ...updates });
        }
    } catch (error) {
        if (isPermissionError(error)) {
            throw new Error('DB_PERMISSION_DENIED');
        }
        throw error;
    }
};

// Delete Category
export const deleteCategory = async (uid: string, categoryId: string): Promise<void> => {
    try {
        const transactionsRef = ref(database, `transactions/${uid}`);
        const snapshot = await get(transactionsRef);

        if (snapshot.exists()) {
            const transactions = Object.values(snapshot.val() || {}) as Array<{ category?: string }>;
            const isInUse = transactions.some((transaction) => transaction.category === categoryId);
            if (isInUse) {
                throw new Error('CATEGORY_IN_USE');
            }
        }

        const categoryRef = ref(database, `categories/${uid}/${categoryId}`);
        await remove(categoryRef);
    } catch (error) {
        if (isPermissionError(error)) {
            throw new Error('DB_PERMISSION_DENIED');
        }
        throw error;
    }
};
