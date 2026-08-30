import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';

type Option<T extends string> = {
    label: string;
    value: T;
};

type Props<T extends string> = {
    options: Option<T>[];
    value: T;
    onChange: (value: T) => void;
    variant?: 'default' | 'filled';
};

export default function SegmentedControl<T extends string>({ options, value, onChange, variant = 'default' }: Props<T>) {
    return (
        <View style={styles.container}>
            {options.map((option) => {
                const active = value === option.value;

                return (
                    <Pressable
                        key={option.value}
                        onPress={() => onChange(option.value)}
                        style={[
                            styles.option,
                            active && variant === 'default' && styles.activeOptionDefault,
                            active && variant === 'filled' && styles.activeOptionFilled,
                        ]}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                active && variant === 'default' && styles.activeOptionTextDefault,
                                active && variant === 'filled' && styles.activeOptionTextFilled,
                            ]}
                        >
                            {option.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        borderRadius: 28,
        backgroundColor: '#e8eefe',
    },
    option: {
        flex: 1,
        minHeight: 46,
        borderRadius: 23,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING.md,
    },
    activeOptionDefault: {
        backgroundColor: COLORS.surface,
        shadowColor: '#111c2d',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    activeOptionFilled: {
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 2,
    },
    optionText: {
        color: '#31384a',
        fontSize: TYPOGRAPHY.sizes.md,
        fontWeight: '600',
        fontFamily: TYPOGRAPHY.fonts.body,
    },
    activeOptionTextDefault: {
        color: COLORS.primary,
    },
    activeOptionTextFilled: {
        color: COLORS.surface,
    },
});
