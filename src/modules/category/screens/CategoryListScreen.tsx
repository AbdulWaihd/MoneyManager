import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, StatusBar, Pressable, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { TYPOGRAPHY } from '../../../constants/typography';
import { getCategories, deleteCategory } from '../services/categoryService';
import { Category } from '../category.types';
import { getCurrentUser } from '../../auth';
import { useLoading } from '../../../contexts/LoadingContext';
import { getTransactions } from '../../transaction/services/transactionService';
import AppHeader from '../../../components/common/AppHeader';
import SegmentedControl from '../../../components/common/SegmentedControl';
import CategoryModal from '../components/CategoryModal';
import { getCategoryPresentation } from '../../../utils/categoryPresentation';

export default function CategoryListScreen() {
    const insets = useSafeAreaInsets();
    const { setIsLoading } = useLoading();
    const [categories, setCategories] = useState<Category[]>([]);
    const [transactionCounts, setTransactionCounts] = useState<Record<string, number>>({});
    const [selectedType, setSelectedType] = useState<Category['type']>('expense');
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = useCallback(async () => {
        const user = getCurrentUser();
        if (user) {
            const [cats, txns] = await Promise.all([
                getCategories(user.uid),
                getTransactions(user.uid),
            ]);
            const counts = txns.reduce<Record<string, number>>((acc, txn) => {
                acc[txn.category] = (acc[txn.category] || 0) + 1;
                return acc;
            }, {});

            setCategories(cats);
            setTransactionCounts(counts);
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

    const filteredCategories = categories.filter((category) => category.type === selectedType);

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} translucent={false} />

            <AppHeader />

            <FlatList
                data={filteredCategories}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.categoryRow}
                renderItem={({ item }) => (
                    <CategoryTile
                        category={item}
                        count={transactionCounts[item.id] || 0}
                        onLongPress={() => handleDelete(item)}
                    />
                )}
                contentContainerStyle={[
                    styles.listContent,
                    { flexGrow: 1, paddingBottom: insets.bottom + SPACING.md },
                ]}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListHeaderComponent={
                    <View style={styles.contentHeader}>
                        <Text style={styles.title}>Categories</Text>
                        <Text style={styles.subtitle}>Manage your spending and earning tags</Text>

                        <View style={styles.controlsRow}>
                            <View style={styles.segmentedWrap}>
                                <SegmentedControl
                                    value={selectedType}
                                    onChange={setSelectedType}
                                    variant="filled"
                                    options={[
                                        { label: 'Expense', value: 'expense' },
                                        { label: 'Income', value: 'income' },
                                    ]}
                                />
                            </View>

                            <Pressable
                                onPress={() => setIsAddModalVisible(true)}
                                style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
                            >
                                <Plus color={COLORS.surface} size={24} strokeWidth={2} />
                            </Pressable>
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No {selectedType} categories yet.</Text>
                    </View>
                }
            />

            <CategoryModal
                visible={isAddModalVisible}
                onClose={() => setIsAddModalVisible(false)}
                onCreated={loadData}
            />
        </SafeAreaView>
    );
}

type CategoryTileProps = {
    category: Category;
    count: number;
    onLongPress: () => void;
};

function CategoryTile({ category, count, onLongPress }: CategoryTileProps) {
    const presentation = getCategoryPresentation(category);
    const Icon = presentation.Icon;
    const itemLabel = count === 1 ? 'item' : 'items';

    return (
        <Pressable
            onLongPress={onLongPress}
            delayLongPress={350}
            style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
        >
            <View style={[styles.iconBubble, { backgroundColor: presentation.backgroundColor }]}>
                <Icon color={presentation.color} size={24} strokeWidth={2.2} />
            </View>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <Text style={styles.categoryMeta}>{count > 0 ? `${count} ${itemLabel}` : 'No transactions yet'}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: COLORS.surface,
    },
    listContent: {
        flexGrow: 1,
        paddingHorizontal: SPACING.xl,
        backgroundColor: COLORS.surface,
    },
    contentHeader: {
        paddingTop: SPACING['2xl'],
        paddingBottom: SPACING.xl,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.text,
        fontFamily: TYPOGRAPHY.fonts.heading,
    },
    subtitle: {
        marginTop: SPACING.xs,
        fontSize: TYPOGRAPHY.sizes.sm,
        color: '#6b7280',
        fontFamily: TYPOGRAPHY.fonts.body,
    },
    controlsRow: {
        marginTop: SPACING.xl,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.lg,
    },
    segmentedWrap: {
        width: 200,
    },
    addButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    categoryRow: {
        justifyContent: 'space-between',
    },
    tile: {
        width: '47%',
        marginBottom: SPACING.xl,
    },
    iconBubble: {
        width: 58,
        height: 58,
        borderRadius: 29,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.sm,
    },
    categoryTitle: {
        fontSize: 19,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 2,
    },
    categoryMeta: {
        color: '#6b7280',
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: '600',
    },
    pressed: {
        opacity: 0.65,
    },
    emptyContainer: {
        paddingTop: SPACING['2xl'],
        alignItems: 'center',
    },
    emptyText: {
        color: COLORS['text-light'],
        fontSize: TYPOGRAPHY.sizes.md,
        fontFamily: TYPOGRAPHY.fonts.body,
    },
});
