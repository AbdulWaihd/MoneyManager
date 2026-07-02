import React, { useState, useCallback } from 'react';
import { View, ScrollView, RefreshControl, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { useDashboardData } from '../hooks/useDashboardData';
import BalanceCard from '../components/BalanceCard';
import SpendingChart from '../components/SpendingChart';
import RecentTransactionsList from '../components/RecentTransactionsList';

export default function DashboardScreen() {
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);
    const { summary, recentTransactions, refetch, isLoadingData } = useDashboardData('this_month');

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }, [refetch]);

    const formatAmount = (amount: number) => {
        // Amount is stored in paise/cents, so divide by 100 for display
        return `₹${(amount / 100).toFixed(2)}`;
    };

    return (
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
            <LinearGradient
                colors={[COLORS.background, 'rgba(207,230,255,0.1)']}
                style={{ flex: 1 }}
            >
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor={COLORS.background}
                    translucent={false}
                />
                
                <ScrollView
                    contentContainerStyle={[
                        styles.container,
                        {
                            paddingTop: SPACING.md,
                            paddingBottom: insets.bottom + SPACING.xl,
                        },
                    ]}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <BalanceCard summary={summary} formatAmount={formatAmount} />
                    <SpendingChart summary={summary} />
                    <RecentTransactionsList transactions={recentTransactions} formatAmount={formatAmount} />
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        paddingHorizontal: SPACING.lg,
    },
});
