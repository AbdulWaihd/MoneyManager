import React, { useState } from 'react';
import {
    TextInput as RNTextInput,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';

interface TextInputProps {
    // existing props
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    onBlur?: (e: any) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'decimal-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    error?: string;
    editable?: boolean;

    // new props
    label?: string;
    touched?: boolean;
    icon?: React.ReactNode;
    multiline?: boolean;
    numberOfLines?: number;
    style?: any;
}

export default function TextInput({
    placeholder,
    value,
    onChangeText,
    onBlur,
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'none',
    error,
    editable = true,
    label,
    touched,
    icon,
    multiline,
    numberOfLines,
    style,
}: TextInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // if secureTextEntry — toggle visibility
    const isSecure = secureTextEntry && !isPasswordVisible;

    // only show error if field has been touched
    const showError = touched && error;

    return (
        <View style={{ marginBottom: SPACING.md }}>

            {/* Label */}
            {label && (
                <Text
                    style={{
                        fontSize: TYPOGRAPHY.sizes.sm,
                        fontFamily: TYPOGRAPHY.fonts.body,
                        color: COLORS['text-light'],
                        marginBottom: SPACING.xs,
                    }}
                >
                    {label}
                </Text>
            )}

            {/* Input wrapper — holds icon + input + password toggle */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: showError
                        ? COLORS.error        // red border if error
                        : isFocused
                            ? COLORS.primary      // blue border if focused
                            : COLORS.border,      // gray border default
                    borderRadius: SPACING.sm,
                    backgroundColor: editable ? COLORS.surface : COLORS.background,
                    paddingHorizontal: SPACING.md,
                }}
            >
                {/* Left icon — optional */}
                {icon && (
                    <View style={{ marginRight: SPACING.sm }}>
                        {icon}
                    </View>
                )}

                {/* Actual input */}
                <RNTextInput
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={isSecure}
                    keyboardType={keyboardType}
                    editable={editable}
                    autoCapitalize={autoCapitalize}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    onFocus={() => setIsFocused(true)}
                    onBlur={(e) => {
                        setIsFocused(false);
                        if (onBlur) onBlur(e);
                    }}
                    placeholderTextColor={COLORS['text-light']}
                    style={[{
                        flex: 1,
                        paddingVertical: SPACING.sm,
                        color: COLORS.text,
                        fontSize: TYPOGRAPHY.sizes.base,
                        fontFamily: TYPOGRAPHY.fonts.body,
                    }, style]}
                />

                {/* Password show/hide toggle — only for secure fields */}
                {secureTextEntry && (
                    <TouchableOpacity
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        style={{ marginLeft: SPACING.sm }}
                    >
                        <Text
                            style={{
                                fontSize: TYPOGRAPHY.sizes.sm,
                                color: COLORS['text-light'],
                                fontFamily: TYPOGRAPHY.fonts.body,
                            }}
                        >
                            {isPasswordVisible ? 'Hide' : 'Show'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Error message — only shows when touched */}
            {showError && (
                <Text
                    style={{
                        color: COLORS.error,
                        fontSize: TYPOGRAPHY.sizes.sm,
                        marginTop: SPACING.xs,
                        fontFamily: TYPOGRAPHY.fonts.body,
                    }}
                >
                    {error}
                </Text>
            )}
        </View>
    );
}