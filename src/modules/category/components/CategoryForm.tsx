import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { TYPOGRAPHY } from '../../../constants/typography';
import TextInput from '../../../components/ui/TextInput';
import Button from '../../../components/ui/Button';
import { useForm } from '../../../hooks/useForm';
import { categorySchema, CategoryFormData } from '../categorySchemas';

type Props = {
    initialValues?: Partial<CategoryFormData>;
    onSubmit: (data: CategoryFormData) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
};

export default function CategoryForm({ initialValues, onSubmit, onCancel, isSubmitting }: Props) {
    const form = useForm<CategoryFormData>(categorySchema, {
        type: initialValues?.type || 'expense',
        title: initialValues?.title || '',
    });

    const isFormFilled = form.values.title.trim() !== '';

    return (
        <View style={styles.container}>
            {/* Type Toggle */}
            <View style={styles.typeToggle}>
                <Pressable
                    style={[styles.typeButton, form.values.type === 'income' && styles.typeButtonActiveIncome]}
                    onPress={() => form.handleChange('type')('income')}
                >
                    <Text style={[styles.typeText, form.values.type === 'income' && styles.typeTextActive]}>Income</Text>
                </Pressable>
                <Pressable
                    style={[styles.typeButton, form.values.type === 'expense' && styles.typeButtonActiveExpense]}
                    onPress={() => form.handleChange('type')('expense')}
                >
                    <Text style={[styles.typeText, form.values.type === 'expense' && styles.typeTextActive]}>Expense</Text>
                </Pressable>
            </View>

            {/* Title */}
            <View style={styles.field}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                    placeholder="e.g. Groceries"
                    value={form.values.title}
                    onChangeText={form.handleChange('title')}
                    onBlur={form.handleBlur('title')}
                />
                {form.touched.title && form.errors.title && (
                    <Text style={styles.errorText}>{form.errors.title}</Text>
                )}
            </View>

            <View style={styles.actions}>
                <Button
                    label="Cancel"
                    variant="secondary"
                    onPress={onCancel}
                    disabled={isSubmitting}
                    style={{ flex: 1, marginRight: SPACING.md }}
                />
                <Button
                    label="Save"
                    onPress={() => {
                        if (form.validateAll()) {
                            onSubmit(form.values);
                        }
                    }}
                    loading={isSubmitting}
                    disabled={!isFormFilled || isSubmitting}
                    style={{ flex: 2 }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: SPACING.lg,
    },
    typeToggle: {
        flexDirection: 'row',
        backgroundColor: COLORS.border,
        borderRadius: SPACING.md,
        padding: 4,
    },
    typeButton: {
        flex: 1,
        paddingVertical: SPACING.sm,
        alignItems: 'center',
        borderRadius: SPACING.sm - 2,
    },
    typeButtonActiveIncome: {
        backgroundColor: COLORS.success,
    },
    typeButtonActiveExpense: {
        backgroundColor: COLORS.error,
    },
    typeText: {
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: '600',
        color: COLORS.text,
        fontFamily: TYPOGRAPHY.fonts.body,
    },
    typeTextActive: {
        color: '#FFFFFF',
    },
    field: {
        gap: SPACING.xs,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.text,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 12,
        marginTop: SPACING.xs,
    },
    actions: {
        flexDirection: 'row',
        marginTop: SPACING.xl,
    }
});
