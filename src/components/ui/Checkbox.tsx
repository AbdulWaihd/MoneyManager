// src/components/ui/Checkbox.tsx
// ============================================
// RESPONSIBILITY: Checkbox with label
// - Remember Me checkbox
// - Controlled component
// ============================================

import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';

interface CheckboxProps {
    label: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
}

export default function Checkbox({ label, value, onValueChange }: CheckboxProps) {
    return (
        <TouchableOpacity
            onPress={() => onValueChange(!value)}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: SPACING.md,
            }}
        >
            <View
                style={{
                    width: 20,
                    height: 20,
                    borderWidth: 1,
                    borderColor: COLORS.primary,
                    borderRadius: 4,
                    backgroundColor: value ? COLORS.primary : 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: SPACING.sm,
                }}
            >
                {value && (
                    <MaterialCommunityIcons name="check" size={16} color={COLORS.surface} />
                )}
            </View>
            <Text
                style={{
                    fontSize: TYPOGRAPHY.sizes.base,
                    color: COLORS.text,
                    fontFamily: TYPOGRAPHY.fonts.body,
                }}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}