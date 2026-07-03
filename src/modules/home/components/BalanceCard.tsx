import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ArrowDown, ArrowUp, Plus, Sparkles } from 'lucide-react-native';
import { DashboardSummary } from '../home.types';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { TYPOGRAPHY } from '../../../constants/typography';
import GlassCard from '../../../components/common/GlassCard';

type Props = {
    summary: DashboardSummary;
    formatAmount: (amount: number) => string;
    onAddTransaction: () => void;
};

export default function BalanceCard({ summary, formatAmount, onAddTransaction }: Props) {
    return (
        <View style={styles.container}>
            <GlassCard style={styles.card} variant="strong">
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.label}>Total Balance</Text>
                        <Text style={styles.balance}>{formatAmount(summary.totalBalance)}</Text>
                    </View>
                    <View style={styles.sparkWrap}>
                        <Sparkles size={18} color="#fff" />
                    </View>
                </View>

                <View style={styles.actionRow}>
                    <Pressable style={styles.actionBtnAdd} onPress={onAddTransaction}>
                        <Plus color="#FFFFFF" size={16} strokeWidth={3} />
                        <Text style={styles.actionBtnAddText}>Add</Text>
                    </Pressable>
                    <Pressable style={styles.actionBtnGhost}>
                        <Text style={styles.actionBtnGhostText}>Insight</Text>
                    </Pressable>
                </View>
            </GlassCard>

            <View style={styles.summaryRow}>
                <GlassCard style={styles.summaryCard}>
                    <View style={styles.incomeIconBox}>
                        <ArrowDown color="#16a34a" size={18} strokeWidth={3} />
                    </View>
                    <Text style={styles.summaryLabel}>Income</Text>
                    <Text style={styles.summaryValue}>{formatAmount(summary.totalIncome)}</Text>
                </GlassCard>

                <GlassCard style={styles.summaryCard}>
                    <View style={styles.expenseIconBox}>
                        <ArrowUp color="#dc2626" size={18} strokeWidth={3} />
                    </View>
                    <Text style={styles.summaryLabel}>Expenses</Text>
                    <Text style={styles.summaryValue}>{formatAmount(summary.totalExpense)}</Text>
                </GlassCard>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.xl,
    },
    card: {
        backgroundColor: COLORS.primary,
        borderRadius: 32,
        padding: SPACING.xl,
        marginBottom: SPACING.lg,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.lg,
    },
    label: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: TYPOGRAPHY.sizes.sm,
        fontFamily: TYPOGRAPHY.fonts.body,
        fontWeight: '600',
        marginBottom: SPACING.xs,
    },
    balance: {
        color: '#FFFFFF',
        fontSize: 38,
        fontWeight: '800',
        fontFamily: TYPOGRAPHY.fonts.heading,
        marginBottom: SPACING.xl,
    },
    actionRow: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    actionBtnAdd: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingVertical: 14,
        borderRadius: 24,
    },
    actionBtnAddText: {
        color: '#FFFFFF',
        fontSize: TYPOGRAPHY.sizes.base,
        fontWeight: '600',
    },
    actionBtnGhost: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.18)',
        paddingVertical: 14,
        borderRadius: 24,
    },
    actionBtnGhostText: {
        color: '#FFFFFF',
        fontSize: TYPOGRAPHY.sizes.base,
        fontWeight: '600',
    },
    summaryRow: {
        flexDirection: 'row',
        gap: SPACING.lg,
    },
    summaryCard: {
        flex: 1,
        padding: SPACING.lg,
    },
    incomeIconBox: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#e6f4ea',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
    },
    expenseIconBox: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#fce8e6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
    },
    summaryLabel: {
        color: '#4b5563',
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: '700',
        marginBottom: 4,
    },
    summaryValue: {
        color: COLORS.text,
        fontSize: 22,
        fontWeight: '800',
    },
    sparkWrap: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
    }
});
