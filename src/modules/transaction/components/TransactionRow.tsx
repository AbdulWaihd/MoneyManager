import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Transaction } from '../transaction.types';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { TYPOGRAPHY } from '../../../constants/typography';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react-native';

type Props = {
    transaction: Transaction;
    formatAmount: (amount: number) => string;
    onPress?: (transaction: Transaction) => void;
};

export default function TransactionRow({ transaction, formatAmount, onPress }: Props) {
    return (
        <Pressable 
            style={({ pressed }) => [
                styles.container,
                pressed && styles.pressed
            ]}
            onPress={() => onPress && onPress(transaction)}
        >
            <View style={[styles.iconBox, { backgroundColor: transaction.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
                {transaction.type === 'income' ? (
                    <ArrowUpRight size={20} color={COLORS.success || '#10B981'} />
                ) : (
                    <ArrowDownRight size={20} color={COLORS.error || '#EF4444'} />
                )}
            </View>
            
            <View style={styles.details}>
                <Text style={styles.category} numberOfLines={1}>{transaction.category}</Text>
                {transaction.description ? (
                    <Text style={styles.description} numberOfLines={1}>{transaction.description}</Text>
                ) : null}
                <Text style={styles.date}>{new Date(transaction.date).toLocaleDateString()}</Text>
            </View>

            <Text style={[styles.amount, { color: transaction.type === 'income' ? COLORS.success : COLORS.text }]}>
                {transaction.type === 'income' ? '+' : '-'}{formatAmount(transaction.amount)}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    pressed: {
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    details: {
        flex: 1,
        marginRight: SPACING.sm,
        justifyContent: 'center',
    },
    category: {
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: '600',
        color: COLORS.text,
        fontFamily: TYPOGRAPHY.fonts.body,
        marginBottom: 2,
    },
    description: {
        fontSize: TYPOGRAPHY.sizes.xs,
        color: COLORS['text-light'],
        fontFamily: TYPOGRAPHY.fonts.body,
        marginBottom: 2,
    },
    date: {
        fontSize: TYPOGRAPHY.sizes.xs,
        color: COLORS['text-light'],
        fontFamily: TYPOGRAPHY.fonts.body,
    },
    amount: {
        fontSize: TYPOGRAPHY.sizes.md,
        fontWeight: '700',
        fontFamily: TYPOGRAPHY.fonts.body,
    },
});
