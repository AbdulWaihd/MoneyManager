import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert, TouchableOpacity } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import BottomSheetModal from '../../../components/common/BottomSheetModal';
import SegmentedControl from '../../../components/common/SegmentedControl';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { TYPOGRAPHY } from '../../../constants/typography';
import { addCategory } from '../services/categoryService';
import { getCurrentUser } from '../../auth';
import {
    CATEGORY_COLORS,
    CATEGORY_ICON_OPTIONS,
    CategoryIconKey,
    getIconComponent,
} from '../../../utils/categoryPresentation';

type Props = {
    visible: boolean;
    onClose: () => void;
    onCreated: () => Promise<void> | void;
};

export default function CategoryModal({ visible, onClose, onCreated }: Props) {
    const [type, setType] = useState<'expense' | 'income'>('expense');
    const [title, setTitle] = useState('');
    const [icon, setIcon] = useState<CategoryIconKey>('shopping');
    const [color, setColor] = useState(CATEGORY_COLORS[0].color);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const reset = () => {
        setType('expense');
        setTitle('');
        setIcon('shopping');
        setColor(CATEGORY_COLORS[0].color);
        setError(null);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSave = async () => {
        const user = getCurrentUser();
        const cleanedTitle = title.trim();

        if (!user) {
            setError('Please sign in again.');
            return;
        }

        if (cleanedTitle.length < 2) {
            setError('Category name must be at least 2 characters.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await addCategory(user.uid, {
                type,
                title: cleanedTitle,
                icon,
                color,
            });
            await onCreated();
            handleClose();
        } catch (err: any) {
            if (err.message === 'CATEGORY_DUPLICATE') {
                setError('That category already exists for this type.');
            } else {
                console.error('Failed to save category', err);
                Alert.alert('Could not save', 'Please try again in a moment.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedPalette = CATEGORY_COLORS.find((item) => item.color === color) || CATEGORY_COLORS[0];

    return (
        <BottomSheetModal visible={visible} title="New Category" onClose={handleClose}>
            {/* Segmented Control */}
                <SegmentedControl
                    value={type}
                    onChange={setType}
                    options={[
                        { label: 'Expense', value: 'expense' },
                        { label: 'Income', value: 'income' },
                    ]}
                />

                {/* Preview Section */}
                <View style={styles.previewRow}>
                    <View style={[styles.previewIcon, { backgroundColor: selectedPalette.backgroundColor }]}>
                        {React.createElement(getIconComponent(icon), {
                            color,
                            size: 34,
                            strokeWidth: 2.2,
                        })}
                    </View>
                    <View style={styles.previewText}>
                        <Text style={styles.previewLabel}>Category</Text>
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Food & Dining"
                            placeholderTextColor="#9aa0aa"
                            maxLength={30}
                            style={styles.titleInput}
                        />
                    </View>
                </View>

                {/* Icon Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Icon</Text>
                    <View style={styles.iconGrid}>
                        {CATEGORY_ICON_OPTIONS.map((option) => {
                            const active = option.key === icon;
                            const Icon = getIconComponent(option.key);

                            return (
                                <Pressable
                                    key={option.key}
                                    onPress={() => setIcon(option.key)}
                                    style={[styles.iconOption, active && styles.activeIconOption]}
                                >
                                    <Icon color={active ? COLORS.surface : color} size={22} />
                                    <Text style={[styles.iconLabel, active && styles.activeIconLabel]}>
                                        {option.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {/* Color Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Color</Text>
                    <View style={styles.colorRow}>
                        {CATEGORY_COLORS.map((item) => (
                            <Pressable
                                key={item.key}
                                onPress={() => setColor(item.color)}
                                style={[
                                    styles.colorSwatch,
                                    { backgroundColor: item.backgroundColor, borderColor: item.color },
                                    color === item.color && styles.activeColorSwatch,
                                ]}
                            >
                                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Error Message */}
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                {/* Save Button */}
                <TouchableOpacity
                onPress={handleSave}
                disabled={isSubmitting}
                style={[styles.saveButton, isSubmitting && styles.pressed]}
                activeOpacity={0.7}
            >
                <Text style={styles.saveText}>{isSubmitting ? 'Saving...' : 'Save Category'}</Text>
                <CheckCircle2 color={COLORS.surface} size={24} />
            </TouchableOpacity>

                {/* Bottom Spacing */}
                <View style={{ height: SPACING.xl }} />
        </BottomSheetModal>
    );
}

const styles = StyleSheet.create({
    previewRow: {
        minHeight: 96,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.lg,
        paddingHorizontal: SPACING.lg,
        backgroundColor: '#eef3ff',
        borderRadius: 12,
        marginBottom: SPACING.lg,
    },
    previewIcon: {
        width: 62,
        height: 62,
        borderRadius: 31,
        alignItems: 'center',
        justifyContent: 'center',
    },
    previewText: {
        flex: 1,
    },
    previewLabel: {
        color: '#31384a',
        fontSize: TYPOGRAPHY.sizes.base,
        fontWeight: '800',
        marginBottom: SPACING.xs,
    },
    titleInput: {
        color: COLORS.text,
        fontSize: 20,
        lineHeight: 28,
        paddingVertical: 0,
    },
    section: {
        gap: SPACING.md,
        marginBottom: SPACING.lg,
    },
    sectionTitle: {
        color: COLORS.text,
        fontSize: TYPOGRAPHY.sizes.base,
        fontWeight: '800',
    },
    iconGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    iconOption: {
        width: '31%',
        minHeight: 72,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.xs,
        backgroundColor: '#eef3ff',
    },
    activeIconOption: {
        backgroundColor: COLORS.primary,
    },
    iconLabel: {
        color: '#31384a',
        fontSize: TYPOGRAPHY.sizes.xs,
        fontWeight: '700',
    },
    activeIconLabel: {
        color: COLORS.surface,
    },
    colorRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.md,
    },
    colorSwatch: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    activeColorSwatch: {
        borderWidth: 3,
    },
    colorDot: {
        width: 28,
        height: 28,
        borderRadius: 14,
    },
    errorText: {
        color: COLORS.error,
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: '700',
        marginBottom: SPACING.md,
        textAlign: 'center',
    },
    saveButton: {
        height: 68,
        borderRadius: 34,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.22,
        shadowRadius: 14,
        elevation: 8,
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