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
import { Mail, Lock, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import TextInput from '../../../components/ui/TextInput';
import Button from '../../../components/ui/Button';
import { useForm } from '../../../hooks/useForm';
import { useLoading } from '../../../contexts/LoadingContext';
import { signup } from '../authService';
import { signupSchema, SignupFormData } from '../authSchemas';
import { styles } from '../styles/SignupScreen.styles';

export default function SignupScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { setIsLoading } = useLoading();
    const [signupError, setSignupError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form setup — Zod schema + initial values
    const form = useForm<SignupFormData>(signupSchema, {
        displayName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const isFormFilled =
        form.values.displayName.trim().length > 0 &&
        form.values.email.trim().length > 0 &&
        form.values.password.length > 0 &&
        form.values.confirmPassword.length > 0;

    // Handle signup
    const handleSignup = async () => {
        setSignupError('');

        if (!form.validateAll()) return;

        setIsSubmitting(true);
        setIsLoading(true);

        try {
            await signup(form.values.email, form.values.password, form.values.displayName);

            // Navigate to Verify Email screen with email as param
            router.push({
                pathname: '/(auth)/verify-email',
                params: { email: form.values.email },
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Signup failed';

            if (errorMessage.includes('email-already-in-use')) {
                setSignupError('This email is already in use.');
            } else if (errorMessage.includes('weak-password')) {
                setSignupError('Password is too weak.');
            } else {
                setSignupError(errorMessage);
            }

            console.error('Signup error:', error);
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
                            <Text style={styles.title}>Create Account</Text>
                            <Text style={styles.subtitle}>
                                Sign up to start managing your finances
                            </Text>
                        </View>

                        {/* Form */}
                        <View style={styles.form}>
                            {/* Display Name Input */}
                            <TextInput
                                label="Full Name"
                                icon={<User size={18} color={COLORS['text-light']} />}
                                placeholder="John Doe"
                                value={form.values.displayName}
                                onChangeText={form.handleChange('displayName')}
                                onBlur={form.handleBlur('displayName')}
                                error={form.errors.displayName}
                                touched={form.touched.displayName}
                            />

                            {/* Email Input */}
                            <TextInput
                                label="Email address"
                                icon={<Mail size={18} color={COLORS['text-light']} />}
                                placeholder="you@example.com"
                                value={form.values.email}
                                onChangeText={form.handleChange('email')}
                                onBlur={form.handleBlur('email')}
                                keyboardType="email-address"
                                error={form.errors.email}
                                touched={form.touched.email}
                            />

                            {/* Password Input */}
                            <TextInput
                                label="Password"
                                icon={<Lock size={18} color={COLORS['text-light']} />}
                                placeholder="Create a password"
                                value={form.values.password}
                                onChangeText={form.handleChange('password')}
                                onBlur={form.handleBlur('password')}
                                secureTextEntry
                                error={form.errors.password}
                                touched={form.touched.password}
                            />

                            {/* Confirm Password Input */}
                            <TextInput
                                label="Confirm Password"
                                icon={<Lock size={18} color={COLORS['text-light']} />}
                                placeholder="Confirm your password"
                                value={form.values.confirmPassword}
                                onChangeText={form.handleChange('confirmPassword')}
                                onBlur={form.handleBlur('confirmPassword')}
                                secureTextEntry
                                error={form.errors.confirmPassword}
                                touched={form.touched.confirmPassword}
                            />

                            {/* Error Banner */}
                            {signupError ? (
                                <View style={styles.errorBanner}>
                                    <Text style={styles.errorBannerText}>{signupError}</Text>
                                </View>
                            ) : null}

                            {/* Signup Button */}
                            <Button
                                label="Create Account"
                                onPress={handleSignup}
                                loading={isSubmitting}
                                disabled={!isFormFilled || isSubmitting}
                            />
                        </View>

                        {/* Login Link */}
                        <View style={styles.signupRow}>
                            <Text style={styles.signupText}>Already have an account? </Text>
                            <Pressable onPress={() => router.push('/(auth)/login')} hitSlop={8}>
                                <Text style={styles.signupLink}>Sign in</Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </LinearGradient>
        </SafeAreaView>
    );
}
