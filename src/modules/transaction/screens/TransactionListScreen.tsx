import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SectionList,
    RefreshControl,
    StatusBar,
    Pressable,
    TextInput,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { TYPOGRAPHY } from '../../../constants/typography';
import { getTransactions } from '../services/transactionService';
import { Transaction } from '../transaction.types';
import { getCurrentUser } from '../../auth';
import { getCategories } from '../../category/services/categoryService';
import { Category } from '../../category/category.types';
import AppHeader from '../../../components/common/AppHeader';
import TransactionModal from '../components/TransactionModal';
import {
    attachCategoryDetails,
    formatMoney,
    getTimeLabel,
    groupTransactionsByDate,
    startOfMonth,
    startOfPreviousMonth,
    TransactionWithCategory,
} from '../../../utils/finance';
import { getCategoryPresentation } from '../../../utils/categoryPresentation';

type FilterKey = 'this_month' | 'last_month' | 'income' | 'expense' | 'all';

const FILTERS: Array<{ key: FilterKey; label: string }> = [
    { key: 'this_month', label: 'This Month' },
    { key: 'last_month', label: 'Last Month' },
    { key: 'income', label: 'Income' },
    { key: 'expense', label: 'Expense' },
    { key: 'all', label: 'All' },
];

export default function TransactionListScreen() {
    const insets = useSafeAreaInsets();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<FilterKey>('this_month');
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    const loadData = useCallback(async () => {
        const user = getCurrentUser();
        if (user) {
            const [txns, cats] = await Promise.all([
                getTransactions(user.uid),
                getCategories(user.uid),
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

    const sectionData = useMemo(() => {
        const now = new Date();
        const thisMonth = startOfMonth(now);
        const lastMonth = startOfPreviousMonth(now);
        const query = search.trim().toLowerCase();

        const enriched = attachCategoryDetails(transactions, categories).filter((transaction) => {
            if (filter === 'income' && transaction.type !== 'income') return false;
            if (filter === 'expense' && transaction.type !== 'expense') return false;
            if (filter === 'this_month' && transaction.date < thisMonth) return false;
            if (filter === 'last_month' && (transaction.date < lastMonth || transaction.date >= thisMonth)) return false;

            if (!query) return true;

            return (
                transaction.description.toLowerCase().includes(query) ||
                transaction.categoryTitle.toLowerCase().includes(query)
            );
        });

        return groupTransactionsByDate(enriched);
    }, [categories, filter, search, transactions]);

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} translucent={false} />
            <AppHeader />

            <SectionList
                sections={sectionData}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[
                    styles.content,
                    { paddingBottom: insets.bottom + 120 },
                    sectionData.length === 0 && styles.emptyContent,
                ]}
                ListHeaderComponent={
                    <View style={styles.headerContent}>
                        <View style={styles.searchBox}>
                            <Search color="#6b7280" size={30} />
                            <TextInput
                                value={search}
                                onChangeText={setSearch}
                                placeholder="Search transactions..."
                                placeholderTextColor="#4b5563"
                                style={styles.searchInput}
                            />
                        </View>

                        <View style={styles.filterRow}>
                            {FILTERS.map((item) => {
                                const active = item.key === filter;
                                return (
                                    <Pressable
                                        key={item.key}
                                        onPress={() => setFilter(item.key)}
                                        style={[styles.filterChip, active && styles.activeFilterChip]}
                                    >
                                        <Text style={[styles.filterText, active && styles.activeFilterText]}>
                                            {item.label}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                }
                renderSectionHeader={({ section }) => (
                    <Text style={styles.sectionHeader}>{section.title}</Text>
                )}
                renderItem={({ item }) => <HistoryRow transaction={item} />}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyTitle}>No transactions found</Text>
                        <Text style={styles.emptyText}>Try another filter or add your first transaction.</Text>
                    </View>
                }
            />

            <Pressable
                onPress={() => setIsAddModalVisible(true)}
                style={({ pressed }) => [
                    styles.fab,
                    pressed && styles.pressed,
                ]}
            >
                <Text style={styles.fabText}>+</Text>
            </Pressable>

            <TransactionModal
                visible={isAddModalVisible}
                categories={categories}
                onClose={() => setIsAddModalVisible(false)}
                onCreated={loadData}
            />
        </SafeAreaView>
    );
}

function HistoryRow({ transaction }: { transaction: TransactionWithCategory }) {
    const presentation = getCategoryPresentation({
        title: transaction.categoryTitle,
        type: transaction.type,
        icon: transaction.categoryIcon,
        color: transaction.categoryColor,
    });
    const Icon = presentation.Icon;

    return (
        <View style={styles.transactionRow}>
            <View style={[styles.rowIcon, { backgroundColor: presentation.backgroundColor }]}>
                <Icon color={presentation.color} size={24} strokeWidth={2.2} />
            </View>
            <View style={styles.rowDetails}>
                <Text style={styles.rowTitle} numberOfLines={1}>
                    {transaction.description || transaction.categoryTitle}
                </Text>
                <Text style={styles.rowSubtitle} numberOfLines={1}>
                    {transaction.categoryTitle} • {getTimeLabel(transaction.date)}
                </Text>
            </View>
            <Text style={[styles.rowAmount, transaction.type === 'income' && styles.incomeAmount]}>
                {formatMoney(transaction.amount, true, transaction.type)}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING['2xl'],
        gap: SPACING.md,
    },
    emptyContent: {
        flexGrow: 1,
    },
    headerContent: {
        gap: SPACING.xl,
        marginBottom: SPACING.xl,
    },
    searchBox: {
        height: 72,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        paddingHorizontal: SPACING.xl,
        borderRadius: 36,
        backgroundColor: '#e9efff',
        shadowColor: '#111c2d',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        color: COLORS.text,
        fontSize: 23,
        fontFamily: TYPOGRAPHY.fonts.body,
        paddingVertical: 0,
    },
    filterRow: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginRight: -SPACING.xl,
    },
    filterChip: {
        minHeight: 46,
        paddingHorizontal: SPACING.lg,
        borderRadius: 23,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    activeFilterChip: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterText: {
        color: '#4b5563',
        fontSize: 15,
        fontWeight: '600',
    },
    activeFilterText: {
        color: '#FFFFFF',
    },
    sectionHeader: {
        color: COLORS.text,
        fontSize: 22,
        fontWeight: '800',
        fontFamily: TYPOGRAPHY.fonts.heading,
        marginTop: SPACING.lg,
        marginBottom: SPACING.sm,
        paddingHorizontal: SPACING.xl,
        backgroundColor: COLORS.background,
    },
    transactionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.lg,
        paddingHorizontal: SPACING.xl,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f3fb',
    },
    rowIcon: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    rowDetails: {
        flex: 1,
        marginRight: SPACING.sm,
    },
    rowTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 2,
    },
    rowSubtitle: {
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: '600',
        color: '#6b7280',
    },
    rowAmount: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.text,
    },
    incomeAmount: {
        color: COLORS.primary,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING.xl,
    },
    emptyTitle: {
        color: COLORS.text,
        fontSize: TYPOGRAPHY.sizes.lg,
        fontWeight: '800',
        marginBottom: SPACING.sm,
    },
    emptyText: {
        color: COLORS['text-light'],
        fontSize: TYPOGRAPHY.sizes.base,
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        right: SPACING.xl,
        bottom: SPACING.xl,
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.24,
        shadowRadius: 10,
        elevation: 8,
    },
    fabText: {
        color: COLORS.surface,
        fontSize: 34,
        lineHeight: 38,
        fontWeight: '300',
    },
    pressed: {
        opacity: 0.7,
    },
});
