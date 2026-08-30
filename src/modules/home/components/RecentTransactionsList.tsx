import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { TransactionWithCategory, getTimeLabel } from '../../../utils/finance';
import { getCategoryPresentation } from '../../../utils/categoryPresentation';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { TYPOGRAPHY } from '../../../constants/typography';
import GlassCard from '../../../components/common/GlassCard';

type Props = {
    transactions: TransactionWithCategory[];
    formatAmount: (amount: number) => string;
};

export default function RecentTransactionsList({ transactions, formatAmount }: Props) {
    const router = useRouter();

    if (transactions.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Recent Transactions</Text>
                <GlassCard style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No transactions yet.</Text>
                </GlassCard>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Recent Transactions</Text>
                <Pressable onPress={() => router.push('/(app)/(tabs)/transactions')} hitSlop={8}>
                    <Text style={styles.seeAll}>See All</Text>
                </Pressable>
            </View>

            <GlassCard style={styles.list}>
                {transactions.map((txn, index) => {
                    const presentation = getCategoryPresentation({
                        title: txn.categoryTitle,
                        type: txn.type,
                        icon: txn.categoryIcon,
                        color: txn.categoryColor,
                    });
                    const Icon = presentation.Icon;

                    return (
                        <View key={txn.id} style={[styles.item, index === transactions.length - 1 && styles.lastItem]}>
                            <View style={[styles.iconBox, { backgroundColor: presentation.backgroundColor }]}>
                                <Icon color={presentation.color} size={24} strokeWidth={2.2} />
                            </View>
                            
                            <View style={styles.details}>
                                <Text style={styles.category} numberOfLines={1}>
                                    {txn.description || txn.categoryTitle}
                                </Text>
                                <Text style={styles.date}>
                                    {txn.categoryTitle} • {getTimeLabel(txn.date)}
                                </Text>
                            </View>

                            <Text style={[styles.amount, txn.type === 'income' && styles.incomeAmount]}>
                                {txn.type === 'income' ? '+' : '-'}{formatAmount(txn.amount)}
                            </Text>
                        </View>
                    );
                })}
            </GlassCard>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    title: {
        fontSize: TYPOGRAPHY.sizes.md,
        fontWeight: '700',
        color: COLORS.text,
        fontFamily: TYPOGRAPHY.fonts.heading,
    },
    seeAll: {
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: '600',
        color: COLORS.primary,
        fontFamily: TYPOGRAPHY.fonts.body,
    },
    emptyContainer: {
        padding: SPACING.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: COLORS['text-light'],
        fontSize: TYPOGRAPHY.sizes.sm,
        fontFamily: TYPOGRAPHY.fonts.body,
    },
    list: {
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f3fb',
    },
    lastItem: {
        borderBottomWidth: 0,
    },
    iconBox: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    details: {
        flex: 1,
        marginRight: SPACING.sm,
    },
    category: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 2,
    },
    date: {
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: '600',
        color: '#6b7280',
    },
    amount: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.text,
    },
    incomeAmount: {
        color: COLORS.primary,
    },
});
