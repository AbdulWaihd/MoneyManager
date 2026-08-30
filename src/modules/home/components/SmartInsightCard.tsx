import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sparkles, TrendingUp } from 'lucide-react-native';
import { DashboardSummary } from '../home.types';
import GlassCard from '../../../components/common/GlassCard';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { TYPOGRAPHY } from '../../../constants/typography';

type Props = {
  summary: DashboardSummary;
  breakdown?: Array<{ amount: number; percentage: number; title: string }>;
};

export default function SmartInsightCard({ summary, breakdown = [] }: Props) {
  const income = summary.totalIncome / 100;
  const expense = summary.totalExpense / 100;
  const savings = income - expense;
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;
  const topCategory = breakdown[0]?.title || 'your essentials';

  const headline = savings >= 0
    ? `You are saving ${Math.abs(savingsRate)}% of your income.`
    : `Your spending is ${Math.abs(Math.round(savingsRate))}% above income.`;

  const supporting = savings >= 0
    ? `A steady pace is building your cushion, with ${topCategory} leading your flow.`
    : `Trim one recurring expense to recover momentum and protect your balance.`;

  return (
    <GlassCard style={styles.card} variant="strong">
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Sparkles size={18} color={COLORS.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Cashflow Pulse</Text>
          <Text style={styles.subtitle}>AI-style insight from your latest activity</Text>
        </View>
      </View>

      <View style={styles.metricRow}>
        <View style={styles.metricBox}>
          <TrendingUp size={18} color={COLORS.success} />
          <Text style={styles.metricValue}>{savings >= 0 ? '+' : ''}${Math.abs(savings).toFixed(2)}</Text>
        </View>
        <Text style={styles.headline}>{headline}</Text>
      </View>

      <Text style={styles.supporting}>{supporting}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,87,191,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '800',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.fonts.heading,
  },
  subtitle: {
    marginTop: 2,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: '#6b7280',
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  metricBox: {
    backgroundColor: 'rgba(45,204,113,0.12)',
    borderRadius: 999,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  metricValue: {
    color: COLORS.success,
    fontWeight: '700',
  },
  headline: {
    flex: 1,
    color: COLORS.text,
    fontWeight: '700',
    fontSize: TYPOGRAPHY.sizes.sm,
  },
  supporting: {
    color: COLORS['text-light'],
    lineHeight: 20,
    fontSize: TYPOGRAPHY.sizes.sm,
  },
});
