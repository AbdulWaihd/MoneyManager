import { ref, get, push, set, remove, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../../../lib/firebase';
import { Category, CategoryInput } from '../category.types';

// Add Category
export const addCategory = async (uid: string, category: CategoryInput): Promise<Category> => {
    const categoriesRef = ref(database, `categories/${uid}`);
    const newCategoryRef = push(categoriesRef);
    const newCategory = { id: newCategoryRef.key!, ...category };
    await set(newCategoryRef, newCategory);
    return newCategory;
};

// Get Categories
export const getCategories = async (uid: string): Promise<Category[]> => {
    const categoriesRef = ref(database, `categories/${uid}`);
    const snapshot = await get(categoriesRef);
    if (!snapshot.exists()) return [];
    
    const categories: Category[] = [];
    snapshot.forEach((childSnapshot) => {
        categories.push(childSnapshot.val() as Category);
    });
    return categories;
};

// Update Category
export const updateCategory = async (uid: string, categoryId: string, updates: Partial<CategoryInput>): Promise<void> => {
    const categoryRef = ref(database, `categories/${uid}/${categoryId}`);
    const snapshot = await get(categoryRef);
    if (snapshot.exists()) {
        const currentData = snapshot.val();
        await set(categoryRef, { ...currentData, ...updates });
    }
};

// Delete Category
export const deleteCategory = async (uid: string, categoryId: string): Promise<void> => {
    // Guard delete: check if any transactions use this category
    const transactionsRef = ref(database, `transactions/${uid}`);
    const q = query(transactionsRef, orderByChild('category'), equalTo(categoryId));
    const snapshot = await get(q);
    
    if (snapshot.exists()) {
        throw new Error('CATEGORY_IN_USE');
    }
    
    const categoryRef = ref(database, `categories/${uid}/${categoryId}`);
    await remove(categoryRef);
};
