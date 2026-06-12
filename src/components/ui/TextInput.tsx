import React, { useState } from 'react';
import { TextInput as RNTextInput, View, Text } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';


interface TextInputProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    error?: string;
    editable?: boolean;
}

export default function TextInput({
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'none',
    error,
    editable = true,
}: TextInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (

        <View
            style={{
                marginBottom: SPACING.md,
            }}
        >
            <RNTextInput
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                editable={editable}
                autoCapitalize={autoCapitalize}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholderTextColor={COLORS['text-light']}
                style={{
                    paddingHorizontal: SPACING.md,
                    paddingVertical: SPACING.sm,
                    borderWidth: 1,
                    borderColor: isFocused ? COLORS.primary : COLORS.border,
                    borderRadius: SPACING.sm,
                    color: COLORS.text,
                    fontSize: TYPOGRAPHY.sizes.base,
                    fontFamily: TYPOGRAPHY.fonts.body,
                    // backgroundColor:editable?COLORS.surface:COLORS['surface-light'],
                }}
            />

            {error && (
                <Text style={{
                    color: COLORS.error,
                    fontSize: TYPOGRAPHY.sizes.sm,
                    marginTop: SPACING.xs,
                    fontFamily: TYPOGRAPHY.fonts.body,
                }}>
                    {error}
                </Text>
            )}
        </View>
    );
}