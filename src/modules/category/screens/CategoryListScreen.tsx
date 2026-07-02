import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, StatusBar, Pressable, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, Trash2 } from 'lucide-react-native';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { TYPOGRAPHY } from '../../../constants/typography';
import { getCategories, deleteCategory } from '../services/categoryService';
import { Category } from '../category.types';
import { getCurrentUser } from '../../auth';
import { useLoading } from '../../../contexts/LoadingContext';

export default function CategoryListScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { setIsLoading } = useLoading();
    const [categories, setCategories] = useState<Category[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = useCallback(async () => {
        const user = getCurrentUser();
        if (user) {
            const cats = await getCategories(user.uid);
            setCategories(cats);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }, [loadData]);

    const handleDelete = async (category: Category) => {
        Alert.alert(
            'Delete Category',
            `Are you sure you want to delete "${category.title}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const user = getCurrentUser();
                        if (!user) return;
                        
                        setIsLoading(true);
                        try {
                            await deleteCategory(user.uid, category.id);
                            await loadData();
                        } catch (err: any) {
                            if (err.message === 'CATEGORY_IN_USE') {
                                Alert.alert('Cannot Delete', 'This category is used by existing transactions. Please delete or reassign them first.');
                            } else {
                                Alert.alert('Error', 'Failed to delete category.');
                            }
                        } finally {
                            setIsLoading(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} translucent={false} />
            
            <View style={styles.header}>
                <Text style={styles.title}>Categories</Text>
                <Pressable onPress={() => router.push('/(app)/(tabs)/category?action=add')} style={styles.addButton}>
                    <Plus color={COLORS.primary} size={24} />
                </Pressable>
            </View>

            <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <View style={styles.details}>
                            <Text style={styles.categoryTitle}>{item.title}</Text>
                            <Text style={[styles.categoryType, { color: item.type === 'income' ? COLORS.success : COLORS.error }]}>
                                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            </Text>
                        </View>
                        <Pressable 
                            onPress={() => handleDelete(item)}
                            style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.5 }]}
                            hitSlop={10}
                        >
                            <Trash2 size={20} color={COLORS.error} />
                        </Pressable>
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: insets.bottom + SPACING.xl * 3 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No categories found.</Text>
                    </View>
                }
            />
            
            {/* Floating Action Button */}
            <Pressable 
                style={[styles.fab, { bottom: insets.bottom + 80 }]}
                onPress={() => router.push('/(app)/(tabs)/category?action=add')}
            >
                <Plus color="#FFF" size={24} />
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    title: {
        fontSize: TYPOGRAPHY.sizes.xl,
        fontWeight: '800',
        color: COLORS.text,
        fontFamily: TYPOGRAPHY.fonts.heading,
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(37, 133, 240, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    details: {
        flex: 1,
    },
    categoryTitle: {
        fontSize: TYPOGRAPHY.sizes.md,
        fontWeight: '600',
        color: COLORS.text,
        fontFamily: TYPOGRAPHY.fonts.body,
        marginBottom: 4,
    },
    categoryType: {
        fontSize: TYPOGRAPHY.sizes.xs,
        fontFamily: TYPOGRAPHY.fonts.body,
        fontWeight: '600',
    },
    deleteBtn: {
        padding: 8,
    },
    emptyContainer: {
        padding: SPACING.xl,
        alignItems: 'center',
    },
    emptyText: {
        color: COLORS['text-light'],
        fontSize: TYPOGRAPHY.sizes.sm,
        fontFamily: TYPOGRAPHY.fonts.body,
    },
    fab: {
        position: 'absolute',
        right: SPACING.lg,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    }
});
