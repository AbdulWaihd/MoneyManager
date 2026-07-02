import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { CategoryListScreen, AddCategoryScreen } from '@/modules/category';

export default function CategoryRoute() {
    const params = useLocalSearchParams();
    
    if (params.action === 'add') {
        return <AddCategoryScreen />;
    }
    
    return <CategoryListScreen />;
}