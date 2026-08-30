import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert, TouchableOpacity } from 'react-native';
import { CalendarDays, CheckCircle2, ChevronRight, FilePenLine, ForkKnife, Plus, Sparkles } from 'lucide-react-native';
import BottomSheetModal from '../../../components/common/BottomSheetModal';
import CategoryModal from '../../category/components/CategoryModal';
import SegmentedControl from '../../../components/common/SegmentedControl';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { TYPOGRAPHY } from '../../../constants/typography';
import { Category } from '../../category/category.types';
import { addTransaction } from '../services/transactionService';
import { getCurrentUser } from '../../auth';
import { formatAmountInput, parseAmountToCents } from '../../../utils/finance';
import { getCategoryPresentation } from '../../../utils/categoryPresentation';

type Props = {
    visible: boolean;
    categories: Category[];
    onClose: () => void;
    onCreated: () => Promise<void> | void;
};

export default function TransactionModal({ visible, categories, onClose, onCreated }: Props) {
    const [type, setType] = useState<'expense' | 'income'>('expense');
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [date, setDate] = useState(Date.now());
    const [note, setNote] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const filteredCategories = useMemo(
        () => categories.filter((category) => category.type === type),
        [categories, type]
    );

    const selectedCategory = useMemo(
        () => filteredCategories.find((category) => category.id === categoryId) || filteredCategories[0],
        [categoryId, filteredCategories]
    );
    const presentation = getCategoryPresentation(selectedCategory);
    const parsedAmount = useMemo(() => parseAmountToCents(amount), [amount]);
    const canSave = useMemo(() => Boolean(amount.trim()) && parsedAmount > 0 && Boolean(selectedCategory), [amount, parsedAmount, selectedCategory]);
    const dateOptions = useMemo(() => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);

        return [
            { label: 'Today', value: today.getTime() },
            { label: 'Yesterday', value: yesterday.getTime() },
            { label: 'Last Week', value: lastWeek.getTime() },
        ];
    }, [visible]);

    const resetForm = () => {
        setType('expense');
        setAmount('');
        setCategoryId('');
        setNote('');
        setDate(Date.now());
        setError(null);
        setShowCategoryPicker(false);
        setShowDatePicker(false);
        setIsCategoryModalVisible(false);
    };

    useEffect(() => {
        if (!visible) return;
        resetForm();
    }, [visible]);

    useEffect(() => {
        if (!visible) return;
        if (!filteredCategories.length) {
            setCategoryId('');
            return;
        }

        setCategoryId((currentCategoryId) => {
            if (currentCategoryId && filteredCategories.some((category) => category.id === currentCategoryId)) {
                return currentCategoryId;
            }
            return filteredCategories[0].id;
        });
    }, [filteredCategories, visible]);

    const handleSave = async () => {
        const user = getCurrentUser();
        const cents = parseAmountToCents(amount);

        if (!user) {
            setError('Please sign in again.');
            return;
        }

        if (!amount.trim() || Number.isNaN(cents) || cents <= 0) {
            setError('Enter a valid amount greater than zero.');
            return;
        }

        if (!selectedCategory) {
            setError(`Create a ${type} category first.`);
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await addTransaction(user.uid, {
                type,
                amount: cents,
                category: selectedCategory.id,
                description: note.trim(),
                date,
            });
            await onCreated();
            resetForm();
            onClose();
        } catch (err) {
            console.error('Failed to save transaction', err);
            Alert.alert('Could not save', 'Please try again in a moment.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <BottomSheetModal visible={visible} title="New Transaction" onClose={() => {
            resetForm();
            onClose();
        }}>
            <View style={styles.summaryCard}>
                <View style={styles.summaryIconWrap}>
                    <Sparkles size={18} color={COLORS.primary} />
                </View>
                <View style={styles.summaryTextWrap}>
                    <Text style={styles.summaryTitle}>Quick entry</Text>
                    <Text style={styles.summarySubtitle}>
                        {canSave ? `Ready to save ${amount || '0.00'} for ${selectedCategory?.title || 'your category'}.` : 'Pick a category and enter an amount to continue.'}
                    </Text>
                </View>
            </View>

            <SegmentedControl
                value={type}
                onChange={(nextType) => {
                    setType(nextType);
                    setCategoryId('');
                    setError(null);
                }}
                options={[
                    { label: 'Expense', value: 'expense' },
                    { label: 'Income', value: 'income' },
                ]}
            />

            <View style={styles.amountBlock}>
                <Text style={styles.amountLabel}>Amount</Text>
                <View style={styles.amountRow}>
                    <Text style={styles.currency}>$</Text>
                    <TextInput
                        value={amount}
                        onChangeText={(value) => setAmount(formatAmountInput(value))}
                        placeholder="0.00"
                        placeholderTextColor="#7b818d"
                        keyboardType="decimal-pad"
                        style={styles.amountInput}
                    />
                </View>
                <Text style={styles.amountHint}>Amounts are stored in cents for precise tracking.</Text>
            </View>

            <Pressable
                onPress={() => {
                    setShowCategoryPicker((current) => !current);
                    setShowDatePicker(false);
                }}
                style={styles.detailCard}
            >
                <View style={[styles.detailIcon, { backgroundColor: presentation.backgroundColor }]}>
                    {selectedCategory ? (
                        <presentation.Icon color={presentation.color} size={26} strokeWidth={2.2} />
                    ) : (
                        <ForkKnife color="#b91c1c" size={26} />
                    )}
                </View>
                <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Category</Text>
                    <Text style={styles.detailValue}>{selectedCategory?.title || 'No matching category yet'}</Text>
                </View>
                <ChevronRight color={COLORS.text} size={24} />
            </Pressable>

            {showCategoryPicker && (
                <View style={styles.categoryGrid}>
                    {filteredCategories.length > 0 ? (
                        filteredCategories.map((category) => {
                            const active = category.id === selectedCategory?.id;
                            const itemPresentation = getCategoryPresentation(category);
                            const Icon = itemPresentation.Icon;

                            return (
                                <Pressable
                                    key={category.id}
                                    onPress={() => {
                                        setCategoryId(category.id);
                                        setShowCategoryPicker(false);
                                        setError(null);
                                    }}
                                    style={[styles.categoryChip, active && styles.activeCategoryChip]}
                                >
                                    <View style={[styles.categoryIcon, { backgroundColor: itemPresentation.backgroundColor }]}>
                                        <Icon color={itemPresentation.color} size={20} strokeWidth={2.2} />
                                    </View>
                                    <Text style={[styles.categoryChipText, active && styles.activeCategoryChipText]} numberOfLines={1}>
                                        {category.title}
                                    </Text>
                                </Pressable>
                            );
                        })
                    ) : (
                        <View style={styles.emptyCategoryState}>
                            <Text style={styles.emptyCategoryTitle}>No {type} categories yet</Text>
                            <Text style={styles.emptyCategoryText}>Create one to start logging transactions.</Text>
                        </View>
                    )}

                    <Pressable
                        onPress={() => {
                            setIsCategoryModalVisible(true);
                            setShowCategoryPicker(false);
                        }}
                        style={styles.categoryChip}
                    >
                        <View style={[styles.categoryIcon, { backgroundColor: '#e2e8f0' }]}>
                            <Plus color="#475569" size={20} strokeWidth={2.2} />
                        </View>
                        <Text style={styles.categoryChipText}>Create New</Text>
                    </Pressable>
                </View>
            )}

            <Pressable
                onPress={() => {
                    setShowDatePicker((current) => !current);
                    setShowCategoryPicker(false);
                }}
                style={styles.detailCard}
            >
                <View style={styles.detailIcon}>
                    <CalendarDays color="#b92a2a" size={26} strokeWidth={2.2} />
                </View>
                <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Date</Text>
                    <Text style={styles.detailValue}>
                        {date === dateOptions[0].value
                            ? `Today, ${new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                            : new Date(date).toLocaleDateString()}
                    </Text>
                </View>
                <ChevronRight color={COLORS.text} size={24} />
            </Pressable>

            {showDatePicker && (
                <View style={styles.dateRow}>
                    {dateOptions.map((option) => {
                        const active = Math.abs(option.value - date) < 1000 * 60;
                        return (
                            <Pressable
                                key={option.label}
                                onPress={() => {
                                    setDate(option.value);
                                    setShowDatePicker(false);
                                }}
                                style={[styles.dateChip, active && styles.activeDateChip]}
                            >
                                <CalendarDays color={active ? COLORS.surface : '#596170'} size={17} />
                                <Text style={[styles.dateChipText, active && styles.activeDateChipText]}>
                                    {option.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            )}

            <View style={styles.detailCard}>
                <View style={styles.detailIcon}>
                    <FilePenLine color="#596170" size={25} strokeWidth={2} />
                </View>
                <TextInput
                    value={note}
                    onChangeText={setNote}
                    placeholder="Add details..."
                    placeholderTextColor="#9aa0aa"
                    maxLength={100}
                    style={styles.noteInput}
                />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
                onPress={handleSave}
                disabled={isSubmitting || !canSave}
                style={[styles.saveButton, (isSubmitting || !canSave) && styles.disabledButton]}
                activeOpacity={0.7}
            >
                <Text style={styles.saveText}>{isSubmitting ? 'Saving...' : 'Save Transaction'}</Text>
                <CheckCircle2 color={COLORS.surface} size={24} />
            </TouchableOpacity>

            <CategoryModal
                visible={isCategoryModalVisible}
                onClose={() => setIsCategoryModalVisible(false)}
                onCreated={async () => {
                    if (onCreated) await onCreated();
                    setIsCategoryModalVisible(false);
                }}
            />
        </BottomSheetModal>
    );
}

const styles = StyleSheet.create({
    summaryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderRadius: 18,
        backgroundColor: 'rgba(0,87,191,0.08)',
        marginBottom: SPACING.sm,
    },
    summaryIconWrap: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    summaryTextWrap: {
        flex: 1,
    },
    summaryTitle: {
        color: COLORS.text,
        fontSize: TYPOGRAPHY.sizes.base,
        fontWeight: '700',
    },
    summarySubtitle: {
        marginTop: 2,
        color: '#6b7280',
        fontSize: TYPOGRAPHY.sizes.sm,
        lineHeight: 20,
    },
    amountBlock: {
        alignItems: 'center',
        paddingVertical: SPACING.md,
    },
    amountLabel: {
        color: '#31384a',
        fontSize: TYPOGRAPHY.sizes.base,
        fontWeight: '700',
    },
    amountRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.lg,
    },
    currency: {
        color: '#4b5563',
        fontSize: 42,
        fontWeight: '600',
    },
    amountInput: {
        minWidth: 150,
        borderBottomWidth: 2,
        borderBottomColor: '#dce4f5',
        color: '#6b7280',
        fontSize: 48,
        lineHeight: 56,
        fontWeight: '800',
        textAlign: 'center',
        paddingVertical: SPACING.xs,
    },
    amountHint: {
        marginTop: SPACING.sm,
        color: '#4b5563',
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: '600',
    },
    amountArrows: {
        marginLeft: SPACING.xs,
        justifyContent: 'center',
        gap: 4,
    },
    upArrow: {
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderBottomWidth: 8,
        borderStyle: 'solid',
        backgroundColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#6b7280',
    },
    downArrow: {
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 8,
        borderStyle: 'solid',
        backgroundColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#6b7280',
    },
    section: {
        gap: SPACING.md,
    },
    sectionTitle: {
        color: COLORS.text,
        fontSize: TYPOGRAPHY.sizes.base,
        fontWeight: '800',
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    categoryChip: {
        maxWidth: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderRadius: 22,
        backgroundColor: '#eef3ff',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeCategoryChip: {
        borderColor: COLORS.primary,
        backgroundColor: '#f7faff',
    },
    categoryIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryChipText: {
        flexShrink: 1,
        color: '#31384a',
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: '700',
    },
    activeCategoryChipText: {
        color: COLORS.primary,
    },
    detailCard: {
        minHeight: 74,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        backgroundColor: '#f7f9fc',
        borderRadius: 18,
        marginBottom: SPACING.sm,
    },
    detailIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dfe4ed',
    },
    detailText: {
        flex: 1,
    },
    detailLabel: {
        color: '#6b7280',
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: '700',
    },
    detailValue: {
        color: COLORS.text,
        fontSize: 18,
        lineHeight: 26,
    },
    dateRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
        marginBottom: SPACING.sm,
    },
    dateChip: {
        flex: 1,
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.xs,
        borderRadius: 22,
        backgroundColor: '#eef3ff',
    },
    activeDateChip: {
        backgroundColor: COLORS.primary,
    },
    dateChipText: {
        color: '#596170',
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: '700',
    },
    activeDateChipText: {
        color: COLORS.surface,
    },
    noteInput: {
        flex: 1,
        color: COLORS.text,
        fontSize: 21,
        paddingVertical: 0,
    },
    emptyCategoryState: {
        width: '100%',
        padding: SPACING.md,
        borderRadius: 16,
        backgroundColor: '#f7f9fc',
        marginBottom: SPACING.sm,
    },
    emptyCategoryTitle: {
        color: COLORS.text,
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: '700',
    },
    emptyCategoryText: {
        marginTop: 4,
        color: '#6b7280',
        fontSize: TYPOGRAPHY.sizes.sm,
    },
    errorText: {
        color: COLORS.error,
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: '700',
    },
    saveButton: {
        height: 62,
        borderRadius: 31,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        backgroundColor: COLORS.primary,
        marginTop: SPACING.xs,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.22,
        shadowRadius: 14,
        elevation: 8,
    },
    disabledButton: {
        opacity: 0.6,
    },
    saveText: {
        color: COLORS.surface,
        fontSize: 20,
        fontWeight: '800',
    },
    pressed: {
        opacity: 0.72,
    },
});
