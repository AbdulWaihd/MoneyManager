import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Transaction } from '../../transaction/transaction.types';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { TYPOGRAPHY } from '../../../constants/typography';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react-native';

type Props = {
    transactions: Transaction[];
    formatAmount: (amount: number) => string;
};

export default function RecentTransactionsList({ transactions, formatAmount }: Props) {
    const router = useRouter();

    if (transactions.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Recent Transactions</Text>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No transactions yet.</Text>
                </View>
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

            <View style={styles.list}>
                {transactions.map((txn, index) => (
                    <View key={txn.id} style={[styles.item, index === transactions.length - 1 && styles.lastItem]}>
                        <View style={[styles.iconBox, { backgroundColor: txn.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
                            {txn.type === 'income' ? (
                                <ArrowUpRight size={20} color={COLORS.success || '#10B981'} />
                            ) : (
                                <ArrowDownRight size={20} color={COLORS.error || '#EF4444'} />
                            )}
                        </View>
                        
                        <View style={styles.details}>
                            <Text style={styles.category} numberOfLines={1}>{txn.description || txn.category}</Text>
                            <Text style={styles.date}>{new Date(txn.date).toLocaleDateString()}</Text>
                        </View>

                        <Text style={[styles.amount, { color: txn.type === 'income' ? COLORS.success : COLORS.text }]}>
                            {txn.type === 'income' ? '+' : '-'}{formatAmount(txn.amount)}
                        </Text>
                    </View>
                ))}
            </View>
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
        backgroundColor: COLORS.surface,
        borderRadius: SPACING.lg,
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
        backgroundColor: COLORS.surface,
        borderRadius: SPACING.lg,
        paddingHorizontal: SPACING.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    lastItem: {
        borderBottomWidth: 0,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    details: {
        flex: 1,
        marginRight: SPACING.sm,
    },
    category: {
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: '600',
        color: COLORS.text,
        fontFamily: TYPOGRAPHY.fonts.body,
        marginBottom: 2,
    },
    date: {
        fontSize: TYPOGRAPHY.sizes.xs,
        color: COLORS['text-light'],
        fontFamily: TYPOGRAPHY.fonts.body,
    },
    amount: {
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: '700',
        fontFamily: TYPOGRAPHY.fonts.body,
    },
});
