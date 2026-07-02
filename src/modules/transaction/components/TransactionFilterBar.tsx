import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { TYPOGRAPHY } from '../../../constants/typography';

export type FilterState = {
    type: 'all' | 'income' | 'expense';
};

type Props = {
    filter: FilterState;
    onChange: (filter: FilterState) => void;
};

export default function TransactionFilterBar({ filter, onChange }: Props) {
    const tabs = [
        { key: 'all', label: 'All' },
        { key: 'income', label: 'Income' },
        { key: 'expense', label: 'Expense' },
    ];

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {tabs.map((tab) => {
                    const isActive = filter.type === tab.key;
                    return (
                        <Pressable
                            key={tab.key}
                            style={[styles.tab, isActive && styles.tabActive]}
                            onPress={() => onChange({ ...filter, type: tab.key as FilterState['type'] })}
                        >
                            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                                {tab.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
    },
    scroll: {
        paddingHorizontal: SPACING.lg,
        gap: SPACING.sm,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: COLORS.border,
    },
    tabActive: {
        backgroundColor: COLORS.primary,
    },
    tabText: {
        fontSize: TYPOGRAPHY.sizes.sm,
        fontFamily: TYPOGRAPHY.fonts.body,
        fontWeight: '600',
        color: COLORS.text,
    },
    tabTextActive: {
        color: '#FFFFFF',
    }
});
