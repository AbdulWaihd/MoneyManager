import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DashboardSummary } from '../home.types';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { TYPOGRAPHY } from '../../../constants/typography';

type Props = {
    summary: DashboardSummary;
    formatAmount: (amount: number) => string;
};

export default function BalanceCard({ summary, formatAmount }: Props) {
    return (
        <View style={styles.card}>
            <Text style={styles.label}>Total Balance</Text>
            <Text style={styles.balance}>{formatAmount(summary.totalBalance)}</Text>

            <View style={styles.row}>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Income</Text>
                    <Text style={[styles.statValue, { color: COLORS.success }]}>
                        +{formatAmount(summary.totalIncome)}
                    </Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Expense</Text>
                    <Text style={[styles.statValue, { color: COLORS.error }]}>
                        -{formatAmount(summary.totalExpense)}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.primary,
        borderRadius: SPACING.lg,
        padding: SPACING.xl,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
        marginBottom: SPACING.xl,
    },
    label: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: TYPOGRAPHY.sizes.sm,
        fontFamily: TYPOGRAPHY.fonts.body,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: SPACING.xs,
    },
    balance: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: '800',
        fontFamily: TYPOGRAPHY.fonts.heading,
        marginBottom: SPACING.lg,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: SPACING.md,
        padding: SPACING.md,
    },
    statBox: {
        flex: 1,
    },
    statLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: TYPOGRAPHY.sizes.xs,
        fontFamily: TYPOGRAPHY.fonts.body,
        marginBottom: 2,
    },
    statValue: {
        fontSize: TYPOGRAPHY.sizes.base,
        fontWeight: '700',
        fontFamily: TYPOGRAPHY.fonts.body,
    },
    divider: {
        width: 1,
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginHorizontal: SPACING.md,
    }
});
