import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { TYPOGRAPHY } from '../../../constants/typography';
import TextInput from '../../../components/ui/TextInput';
import Button from '../../../components/ui/Button';
import { useForm } from '../../../hooks/useForm';
import { transactionSchema, TransactionFormData } from '../transactionSchemas';
import { Category } from '../../category/category.types';
import { getCategories } from '../../category/services/categoryService';
import { getCurrentUser } from '../../auth';

type Props = {
    initialValues?: Partial<TransactionFormData>;
    onSubmit: (data: TransactionFormData) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
};

export default function TransactionForm({ initialValues, onSubmit, onCancel, isSubmitting }: Props) {
    const [categories, setCategories] = useState<Category[]>([]);
    
    useEffect(() => {
        const loadCategories = async () => {
            const user = getCurrentUser();
            if (user) {
                const cats = await getCategories(user.uid);
                setCategories(cats);
            }
        };
        loadCategories();
    }, []);

    const form = useForm<TransactionFormData>(transactionSchema, {
        type: initialValues?.type || 'expense',
        category: initialValues?.category || '',
        description: initialValues?.description || '',
        amountString: initialValues?.amountString || '',
        date: initialValues?.date || Date.now(),
    });

    const isFormFilled = form.values.category !== '' && form.values.amountString !== '';
    const filteredCategories = categories.filter(c => c.type === form.values.type);

    return (
        <View style={styles.container}>
            {/* Type Toggle */}
            <View style={styles.typeToggle}>
                <Pressable
                    style={[styles.typeButton, form.values.type === 'income' && styles.typeButtonActiveIncome]}
                    onPress={() => {
                        form.handleChange('type')('income');
                        form.handleChange('category')(''); // reset category on type change
                    }}
                >
                    <Text style={[styles.typeText, form.values.type === 'income' && styles.typeTextActive]}>Income</Text>
                </Pressable>
                <Pressable
                    style={[styles.typeButton, form.values.type === 'expense' && styles.typeButtonActiveExpense]}
                    onPress={() => {
                        form.handleChange('type')('expense');
                        form.handleChange('category')(''); // reset category on type change
                    }}
                >
                    <Text style={[styles.typeText, form.values.type === 'expense' && styles.typeTextActive]}>Expense</Text>
                </Pressable>
            </View>

            {/* Amount */}
            <View style={styles.field}>
                <Text style={styles.label}>Amount (₹)</Text>
                <TextInput
                    placeholder="0.00"
                    value={form.values.amountString}
                    onChangeText={form.handleChange('amountString')}
                    onBlur={form.handleBlur('amountString')}
                    keyboardType="decimal-pad"
                />
                {form.touched.amountString && form.errors.amountString && (
                    <Text style={styles.errorText}>{form.errors.amountString}</Text>
                )}
            </View>

            {/* Category */}
            <View style={styles.field}>
                <Text style={styles.label}>Category</Text>
                <View style={[styles.pickerContainer, form.touched.category && form.errors.category ? { borderColor: COLORS.error } : {}]}>
                    <Picker
                        selectedValue={form.values.category}
                        onValueChange={form.handleChange('category')}
                        onBlur={() => form.handleBlur('category')()}
                    >
                        <Picker.Item label="Select Category..." value="" color={COLORS['text-light']} />
                        {filteredCategories.map(c => (
                            <Picker.Item key={c.id} label={c.title} value={c.id} />
                        ))}
                    </Picker>
                </View>
                {form.touched.category && form.errors.category && (
                    <Text style={styles.errorText}>{form.errors.category}</Text>
                )}
            </View>

            {/* Description */}
            <View style={styles.field}>
                <Text style={styles.label}>Description (Optional)</Text>
                <TextInput
                    placeholder="Enter description"
                    value={form.values.description || ''}
                    onChangeText={form.handleChange('description')}
                    onBlur={form.handleBlur('description')}
                />
                {form.touched.description && form.errors.description && (
                    <Text style={styles.errorText}>{form.errors.description}</Text>
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
    pickerContainer: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: SPACING.md,
        backgroundColor: COLORS.surface,
        overflow: 'hidden',
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
