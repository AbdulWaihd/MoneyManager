import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { DashboardSummary } from '../home.types';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { TYPOGRAPHY } from '../../../constants/typography';

type Props = {
    summary: DashboardSummary;
};

export default function SpendingChart({ summary }: Props) {
    const data = [
        {
            name: 'Income',
            amount: summary.totalIncome,
            color: COLORS.success || '#10B981',
            legendFontColor: COLORS.text,
            legendFontSize: 12,
        },
        {
            name: 'Expense',
            amount: summary.totalExpense,
            color: COLORS.error || '#EF4444',
            legendFontColor: COLORS.text,
            legendFontSize: 12,
        },
    ].filter((item) => item.amount > 0);

    const screenWidth = Dimensions.get('window').width;

    if (data.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No data to chart for this period.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cash Flow</Text>
            <PieChart
                data={data}
                width={screenWidth - SPACING.xl * 2}
                height={180}
                chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor={"amount"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                absolute
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.surface,
        borderRadius: SPACING.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    title: {
        fontSize: TYPOGRAPHY.sizes.md,
        fontWeight: '700',
        color: COLORS.text,
        fontFamily: TYPOGRAPHY.fonts.heading,
        marginBottom: SPACING.md,
    },
    emptyContainer: {
        backgroundColor: COLORS.surface,
        borderRadius: SPACING.lg,
        padding: SPACING.xl,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xl,
    },
    emptyText: {
        color: COLORS['text-light'],
        fontSize: TYPOGRAPHY.sizes.sm,
        fontFamily: TYPOGRAPHY.fonts.body,
    }
});
