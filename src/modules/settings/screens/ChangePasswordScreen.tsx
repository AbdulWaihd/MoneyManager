import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, Alert, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { TYPOGRAPHY } from '../../../constants/typography';
import TextInput from '../../../components/ui/TextInput';
import Button from '../../../components/ui/Button';
import { useForm } from '../../../hooks/useForm';
import { changePasswordSchema, ChangePasswordFormData } from '../settingsSchemas';
import { updateUserPassword } from '../services/settingsService';
import { useLoading } from '../../../contexts/LoadingContext';

export default function ChangePasswordScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { setIsLoading } = useLoading();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<ChangePasswordFormData>(changePasswordSchema, {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const isFormFilled = 
        form.values.currentPassword.length > 0 && 
        form.values.newPassword.length > 0 && 
        form.values.confirmPassword.length > 0;

    const handleSubmit = async () => {
        if (!form.validateAll()) return;

        setIsSubmitting(true);
        setIsLoading(true);
        setError(null);

        try {
            await updateUserPassword(form.values);
            Alert.alert('Success', 'Your password has been updated successfully.', [
                { text: 'OK', onPress: () => router.setParams({ action: '' }) }
            ]);
        } catch (err: any) {
            console.error('Change password error:', err);
            setError(err.message || 'Failed to change password. Please try again.');
        } finally {
            setIsSubmitting(false);
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView 
                    contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + SPACING.xl }]}
                    showsVerticalScrollIndicator={false}
                >
                    <Pressable onPress={() => router.setParams({ action: '' })} style={styles.backButton}>
                        <ArrowLeft size={24} color={COLORS.text} />
                        <Text style={styles.backButtonText}>Back to Settings</Text>
                    </Pressable>

                    <Text style={styles.title}>Change Password</Text>
                    
                    {error && (
                        <View style={styles.errorBanner}>
                            <Text style={styles.errorBannerText}>{error}</Text>
                        </View>
                    )}

                    <View style={styles.form}>
                        {/* Current Password */}
                        <View style={styles.field}>
                            <Text style={styles.label}>Current Password</Text>
                            <TextInput
                                placeholder="Enter current password"
                                value={form.values.currentPassword}
                                onChangeText={form.handleChange('currentPassword')}
                                onBlur={form.handleBlur('currentPassword')}
                                secureTextEntry
                            />
                            {form.touched.currentPassword && form.errors.currentPassword && (
                                <Text style={styles.errorText}>{form.errors.currentPassword}</Text>
                            )}
                        </View>

                        {/* New Password */}
                        <View style={styles.field}>
                            <Text style={styles.label}>New Password</Text>
                            <TextInput
                                placeholder="Enter new password"
                                value={form.values.newPassword}
                                onChangeText={form.handleChange('newPassword')}
                                onBlur={form.handleBlur('newPassword')}
                                secureTextEntry
                            />
                            {form.touched.newPassword && form.errors.newPassword && (
                                <Text style={styles.errorText}>{form.errors.newPassword}</Text>
                            )}
                        </View>

                        {/* Confirm Password */}
                        <View style={styles.field}>
                            <Text style={styles.label}>Confirm New Password</Text>
                            <TextInput
                                placeholder="Confirm new password"
                                value={form.values.confirmPassword}
                                onChangeText={form.handleChange('confirmPassword')}
                                onBlur={form.handleBlur('confirmPassword')}
                                secureTextEntry
                            />
                            {form.touched.confirmPassword && form.errors.confirmPassword && (
                                <Text style={styles.errorText}>{form.errors.confirmPassword}</Text>
                            )}
                        </View>

                        <View style={styles.actions}>
                            <Button
                                label="Cancel"
                                variant="secondary"
                                onPress={() => router.setParams({ action: '' })}
                                disabled={isSubmitting}
                                style={{ flex: 1, marginRight: SPACING.md }}
                            />
                            <Button
                                label="Update"
                                onPress={handleSubmit}
                                loading={isSubmitting}
                                disabled={!isFormFilled || isSubmitting}
                                style={{ flex: 2 }}
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        padding: SPACING.lg,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
        paddingVertical: SPACING.xs,
    },
    backButtonText: {
        fontSize: TYPOGRAPHY.sizes.md,
        color: COLORS.text,
        fontFamily: TYPOGRAPHY.fonts.body,
        fontWeight: '500',
        marginLeft: SPACING.xs,
    },
    title: {
        fontSize: TYPOGRAPHY.sizes.xl,
        fontWeight: '800',
        color: COLORS.text,
        fontFamily: TYPOGRAPHY.fonts.heading,
        marginBottom: SPACING.xl,
    },
    errorBanner: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: SPACING.md,
        borderRadius: SPACING.sm,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    errorBannerText: {
        color: COLORS.error,
        fontSize: TYPOGRAPHY.sizes.sm,
        fontFamily: TYPOGRAPHY.fonts.body,
    },
    form: {
        gap: SPACING.lg,
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
