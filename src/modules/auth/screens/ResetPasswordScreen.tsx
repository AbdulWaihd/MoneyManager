import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    StatusBar,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import TextInput from '../../../components/ui/TextInput';
import Button from '../../../components/ui/Button';
import { useForm } from '../../../hooks/useForm';
import { useLoading } from '../../../contexts/LoadingContext';
import { sendResetPasswordEmail } from '../authService';
import { resetPasswordSchema, ResetPasswordFormData } from '../authSchemas';
import { styles } from '../styles/ResetPasswordScreen.styles';

export default function ResetPasswordScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { setIsLoading } = useLoading();
    const [resetError, setResetError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Form setup — Zod schema + initial values
    const form = useForm<ResetPasswordFormData>(resetPasswordSchema, {
        email: '',
    });

    const isFormFilled = form.values.email.trim().length > 0;

    // Handle reset password
    const handleResetPassword = async () => {
        setResetError('');

        if (!form.validateAll()) return;

        setIsSubmitting(true);
        setIsLoading(true);

        try {
            await sendResetPasswordEmail(form.values.email);
            setIsSuccess(true);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';

            if (errorMessage.includes('user-not-found')) {
                setResetError('No account found with this email address.');
            } else {
                setResetError(errorMessage);
            }

            console.error('Reset password error:', error);
        } finally {
            setIsSubmitting(false);
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
            <LinearGradient
                colors={[COLORS.background, 'rgba(207,230,255,0.1)']}
                style={{ flex: 1 }}
            >
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor={COLORS.background}
                    translucent={false}
                />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? SPACING.lg : 0}
                >
                    <ScrollView
                        contentContainerStyle={[
                            styles.container,
                            {
                                paddingTop: insets.top + SPACING.lg,
                                paddingBottom: insets.bottom + SPACING.xl,
                            },
                        ]}
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={16}
                    >
                        {/* Heading */}
                        <View style={styles.headingBlock}>
                            <Text style={styles.title}>Reset Password</Text>
                            <Text style={styles.subtitle}>
                                Enter your email to receive a password reset link
                            </Text>
                        </View>

                        {isSuccess ? (
                            <View style={{ alignItems: 'center', marginTop: SPACING.xl }}>
                                <CheckCircle size={64} color={COLORS.success || '#10B981'} style={{ marginBottom: SPACING.md }} />
                                <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm, textAlign: 'center' }}>
                                    Check your email
                                </Text>
                                <Text style={{ fontSize: 14, color: COLORS['text-light'], textAlign: 'center', marginBottom: SPACING.xl, lineHeight: 22 }}>
                                    We've sent password reset instructions to {'\n'}
                                    <Text style={{ fontWeight: '700', color: COLORS.text }}>{form.values.email}</Text>
                                </Text>
                                
                                <Button
                                    label="Return to Sign In"
                                    onPress={() => router.push('/(auth)/login')}
                                    style={{ width: '100%' }}
                                />
                            </View>
                        ) : (
                            <View style={styles.form}>
                                {/* Email Input */}
                                <View>
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            fontWeight: '600',
                                            color: COLORS.text,
                                            marginBottom: SPACING.xs,
                                        }}
                                    >
                                        Email address
                                    </Text>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            borderWidth: 1,
                                            borderColor: form.touched.email && form.errors.email
                                                ? COLORS.error
                                                : COLORS.border,
                                            borderRadius: SPACING.md,
                                            paddingHorizontal: SPACING.md,
                                            backgroundColor: COLORS.surface,
                                        }}
                                    >
                                        <Mail size={18} color={COLORS['text-light']} />
                                        <TextInput
                                            placeholder="you@example.com"
                                            value={form.values.email}
                                            onChangeText={form.handleChange('email')}
                                            onBlur={form.handleBlur('email')}
                                            keyboardType="email-address"
                                        />
                                    </View>
                                    {form.touched.email && form.errors.email && (
                                        <Text
                                            style={{
                                                color: COLORS.error,
                                                fontSize: 12,
                                                marginTop: SPACING.xs,
                                            }}
                                        >
                                            {form.errors.email}
                                        </Text>
                                    )}
                                </View>

                                {/* Error Banner */}
                                {resetError ? (
                                    <View style={styles.errorBanner}>
                                        <Text style={styles.errorBannerText}>{resetError}</Text>
                                    </View>
                                ) : null}

                                {/* Reset Button */}
                                <Button
                                    label="Send Reset Link"
                                    onPress={handleResetPassword}
                                    loading={isSubmitting}
                                    disabled={!isFormFilled || isSubmitting}
                                />

                                <View style={{ marginTop: SPACING.lg }}>
                                    <Button
                                        label="Back to Sign In"
                                        variant="secondary"
                                        onPress={() => router.push('/(auth)/login')}
                                        disabled={isSubmitting}
                                    />
                                </View>
                            </View>
                        )}
                    </ScrollView>
                </KeyboardAvoidingView>
            </LinearGradient>
        </SafeAreaView>
    );
}
