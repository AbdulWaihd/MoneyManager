import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, StatusBar, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { TYPOGRAPHY } from '../../../constants/typography';
import { getTransactions } from '../services/transactionService';
import { Transaction } from '../transaction.types';
import TransactionRow from '../components/TransactionRow';
import TransactionFilterBar, { FilterState } from '../components/TransactionFilterBar';
import { getCurrentUser } from '../../auth';
import { getCategories } from '../../category/services/categoryService';
import { Category } from '../../category/category.types';

export default function TransactionListScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState<FilterState>({ type: 'all' });

    const loadData = useCallback(async () => {
        const user = getCurrentUser();
        if (user) {
            const [txns, cats] = await Promise.all([
                getTransactions(user.uid),
                getCategories(user.uid)
            ]);
            setTransactions(txns);
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

    const formatAmount = (amount: number) => {
        return `₹${(amount / 100).toFixed(2)}`;
    };

    // Replace category IDs with category titles for display
    const transactionsWithCategoryTitle = transactions.map(txn => {
        const cat = categories.find(c => c.id === txn.category);
        return {
            ...txn,
            category: cat ? cat.title : 'Unknown'
        };
    });

    const filteredTransactions = transactionsWithCategoryTitle.filter(txn => {
        if (filter.type !== 'all' && txn.type !== filter.type) return false;
        return true;
    });

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} translucent={false} />
            
            <View style={styles.header}>
                <Text style={styles.title}>Transactions</Text>
                <Pressable onPress={() => router.push('/(app)/(tabs)/transactions')} style={styles.addButton}>
                    <Plus color={COLORS.primary} size={24} />
                </Pressable>
            </View>

            <TransactionFilterBar filter={filter} onChange={setFilter} />

            <FlatList
                data={filteredTransactions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TransactionRow transaction={item} formatAmount={formatAmount} />
                )}
                contentContainerStyle={{ paddingBottom: insets.bottom + SPACING.xl * 3 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No transactions found.</Text>
                    </View>
                }
            />

            {/* Floating Action Button (Alternative to header button) */}
            <Pressable 
                style={[styles.fab, { bottom: insets.bottom + 80 }]}
                onPress={() => router.push('/(app)/(tabs)/transactions?action=add')}
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
