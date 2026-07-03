import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import { DashboardSummary } from '../home.types';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { TYPOGRAPHY } from '../../../constants/typography';
import GlassCard from '../../../components/common/GlassCard';

type BreakdownItem = {
    categoryId: string;
    title: string;
    color: string;
    amount: number;
    percentage: number;
};

type Props = {
    summary: DashboardSummary;
    breakdown?: BreakdownItem[];
};

export default function SpendingChart({ summary, breakdown = [] }: Props) {
    // Take top 4 categories, or top 3 + "Other"
    let displayData = [...breakdown];
    if (displayData.length > 4) {
        const top3 = displayData.slice(0, 3);
        const others = displayData.slice(3);
        const otherAmount = others.reduce((sum, item) => sum + item.amount, 0);
        const otherPercentage = others.reduce((sum, item) => sum + item.percentage, 0);
        displayData = [
            ...top3,
            { categoryId: 'other', title: 'Other', color: '#10b981', amount: otherAmount, percentage: otherPercentage }
        ];
    }

    if (displayData.length === 0) {
        return (
            <GlassCard style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No expense pulse yet</Text>
                <Text style={styles.emptyText}>Add a few transactions to unlock your spending breakdown.</Text>
            </GlassCard>
        );
    }

    const radius = 80;
    const strokeWidth = 24;
    const circumference = 2 * Math.PI * radius;
    let currentRotation = -90;

    const formatShortAmount = (amountCents: number) => {
        const d = amountCents / 100;
        if (d >= 1000) return `$${(d / 1000).toFixed(1)}k`;
        return `$${Math.round(d)}`;
    };

    return (
        <GlassCard style={styles.container}>
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.title}>Spending Flow</Text>
                    <Text style={styles.subtitle}>Where your money is going this month</Text>
                </View>
                <View style={styles.pill}>
                    <Text style={styles.pillText}>{summary.period === 'this_month' ? 'This month' : 'Selected'}</Text>
                </View>
            </View>

            <View style={styles.chartWrapper}>
                <Svg width={220} height={220} viewBox="0 0 220 220">
                    <G rotation={currentRotation} origin="110, 110">
                        {displayData.map((item) => {
                            const strokeDashoffset = circumference - (item.percentage / 100) * circumference;
                            const rotation = currentRotation;
                            currentRotation += (item.percentage / 100) * 360;
                            const offset = item.percentage === 100 ? 0 : strokeDashoffset - 1;

                            return (
                                <Circle
                                    key={item.categoryId}
                                    cx="110"
                                    cy="110"
                                    r={radius}
                                    stroke={item.color}
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={circumference}
                                    strokeDashoffset={offset}
                                    strokeLinecap="round"
                                    fill="none"
                                    rotation={rotation + 90}
                                    origin="110, 110"
                                />
                            );
                        })}
                    </G>
                    <SvgText
                        x="110"
                        y="110"
                        textAnchor="middle"
                        alignmentBaseline="central"
                        fontSize="22"
                        fontWeight="700"
                        fill={COLORS.primary}
                    >
                        {formatShortAmount(summary.totalExpense)}
                    </SvgText>
                </Svg>
            </View>

            <View style={styles.legendContainer}>
                {displayData.map((item) => (
                    <View key={item.categoryId} style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                        <Text style={styles.legendText} numberOfLines={1}>
                            {item.title} ({item.percentage}%)
                        </Text>
                    </View>
                ))}
            </View>
        </GlassCard>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: SPACING.xl,
        marginBottom: SPACING.lg,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        fontFamily: TYPOGRAPHY.fonts.heading,
    },
    subtitle: {
        marginTop: 2,
        color: '#6b7280',
        fontSize: TYPOGRAPHY.sizes.sm,
    },
    pill: {
        paddingHorizontal: SPACING.md,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: 'rgba(0,87,191,0.1)',
    },
    pillText: {
        color: COLORS.primary,
        fontSize: TYPOGRAPHY.sizes.xs,
        fontWeight: '700',
    },
    chartWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xl,
    },
    legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: SPACING.md,
        columnGap: SPACING.md,
    },
    legendItem: {
        width: '45%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendText: {
        color: '#4b5563',
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: '600',
        flexShrink: 1,
    },
    emptyContainer: {
        padding: SPACING.xl,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.lg,
    },
    emptyTitle: {
        color: COLORS.text,
        fontSize: TYPOGRAPHY.sizes.md,
        fontWeight: '700',
        marginBottom: SPACING.xs,
    },
    emptyText: {
        color: COLORS['text-light'],
        fontSize: TYPOGRAPHY.sizes.sm,
        fontFamily: TYPOGRAPHY.fonts.body,
        textAlign: 'center',
    }
});
