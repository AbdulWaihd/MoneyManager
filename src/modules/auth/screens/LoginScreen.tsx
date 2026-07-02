// src/modules/auth/screens/LoginScreen.tsx
// ============================================
// RESPONSIBILITY: Advanced login screen
// - SafeAreaView with proper insets
// - Form validation with useForm hook + Zod schema
// - Custom input components
// - Social login buttons
// - Demo credentials
// - Advanced styling and animations
// ============================================

import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    Alert,
    StatusBar,
    Platform,
    KeyboardAvoidingView,
    TouchableOpacity
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, Lock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import TextInput from '../../../components/ui/TextInput';
import Button from '../../../components/ui/Button';
import Checkbox from '../../../components/ui/Checkbox';
import { useForm } from '../../../hooks/useForm';
import { useLoading } from '../../../contexts/LoadingContext';
import { login, signup } from '../authService';
import { loginSchema, LoginFormData } from '../authSchemas';
import { styles, brand } from '../styles/LoginScreen.styles';

const GoogleLogo = () => <Text style={brand.google}>G</Text>;

const AppleLogo = () => (
    <View style={brand.appleWrap}>
        <View style={brand.appleBody} />
        <View style={brand.appleLeaf} />
    </View>
);

export default function LoginScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { setIsLoading } = useLoading();
    const [loginError, setLoginError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form setup — Zod schema + initial values
    const form = useForm<LoginFormData>(loginSchema, {
        email: '',
        password: '',
        rememberMe: false,
    });

    const isFormFilled =
        form.values.email.trim().length > 0 && form.values.password.length > 0;
    // Handle login
    const handleLogin = async () => {
        setLoginError('');

        if (!form.validateAll()) return;

        setIsSubmitting(true);
        setIsLoading(true);

        try {
            // Login with email and password
            const user = await login(form.values.email, form.values.password);

            // Warn about email verification but don't block login
            if (!user.emailVerified) {
                Alert.alert(
                    'Email Not Verified',
                    'Your email is not verified yet. Some features may be restricted. Check your inbox for the verification link.',
                    [{ text: 'OK' }]
                );
            }
            // Navigation happens automatically via AuthContext
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';

            // Special case: Auto-create demo user if it doesn't exist
            if ((errorMessage.includes('user-not-found') || errorMessage.includes('invalid-credential')) && form.values.email === 'test@example.com' && form.values.password === 'password123') {
                try {
                    await signup('test@example.com', 'password123', 'Demo User');
                    // Automatically logged in after signup, navigation will happen via AuthContext
                    return;
                } catch (signupError) {
                    console.error('Auto-signup for demo user failed:', signupError);
                    setLoginError('Failed to setup demo account.');
                }
            } else if (errorMessage.includes('user-not-found') || errorMessage.includes('invalid-credential')) {
                setLoginError('Invalid email or password.');
            } else if (errorMessage.includes('wrong-password')) {
                setLoginError('Incorrect password. Try again.');
            } else if (errorMessage.includes('too-many-requests')) {
                setLoginError('Too many failed attempts. Try again later.');
            } else {
                setLoginError(errorMessage);
            }

            console.error('Login error:', error);
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
                        {/* Brand Header */}
                        <View style={styles.brandRow}>
                            <View style={styles.logoMark}>
                                <View style={styles.logoInner} />
                            </View>
                            <Text style={styles.brandName}>WealthFlow</Text>
                        </View>

                        {/* Heading */}
                        <View style={styles.headingBlock}>
                            <Text style={styles.title}>Welcome back</Text>
                            <Text style={styles.subtitle}>
                                Sign in to manage your finances
                            </Text>
                        </View>

                        {/* Demo Credentials */}
                        <TouchableOpacity
                            style={styles.demoBox}
                            onPress={() => {
                                form.setValues({
                                    ...form.values,
                                    email: 'test@example.com',
                                    password: 'password123',
                                });
                            }}
                        >
                            <Text style={styles.demoLabel}>Demo credentials (Tap to auto-fill)</Text>
                            <Text style={styles.demoText}>
                                Email: <Text style={styles.demoValue}>test@example.com</Text>
                            </Text>
                            <Text style={styles.demoText}>
                                Password:{' '}
                                <Text style={styles.demoValue}>password123</Text>
                            </Text>
                        </TouchableOpacity>

                        {/* Form */}
                        <View style={styles.form}>
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
                                placeholder="Enter your password"
                                value={form.values.password}
                                onChangeText={form.handleChange('password')}
                                onBlur={form.handleBlur('password')}
                                secureTextEntry
                                error={form.errors.password}
                                touched={form.touched.password}
                            />

                            {/* Remember Me — now uses form.values.rememberMe */}
                            <Checkbox
                                label="Remember me"
                                value={form.values.rememberMe}
                                onValueChange={form.handleChange('rememberMe')}
                            />

                            {/* Forgot Password Link */}
                            <Pressable
                                onPress={() =>
                                    router.push('/(auth)/reset-password')
                                }
                                hitSlop={8}
                                style={{ alignSelf: 'flex-end' }}
                            >
                                <Text style={styles.forgotText}>Forgot password?</Text>
                            </Pressable>

                            {/* Error Banner */}
                            {loginError && (
                                <View style={styles.errorBanner}>
                                    <Text style={styles.errorBannerText}>{loginError}</Text>
                                </View>
                            )}

                            {/* Login Button */}
                            <Button
                                label="Sign in"
                                onPress={handleLogin}
                                loading={isSubmitting}
                                disabled={!isFormFilled || isSubmitting}
                            />

                            {/* Divider */}
                            <View style={styles.dividerRow}>
                                <View style={styles.divider} />
                                <Text style={styles.dividerText}>or</Text>
                                <View style={styles.divider} />
                            </View>

                            {/* Social Buttons */}
                            <View style={{ gap: SPACING.md }}>
                                <Button
                                    label="Continue with Google"
                                    variant="secondary"
                                    onPress={() =>
                                        Alert.alert('Google', 'Not wired in this demo')
                                    }
                                />
                                <Button
                                    label="Continue with Apple"
                                    variant="secondary"
                                    onPress={() =>
                                        Alert.alert('Apple', 'Not wired in this demo')
                                    }
                                />
                            </View>
                        </View>

                        {/* Sign Up Link */}
                        <View style={styles.signupRow}>
                            <Text style={styles.signupText}>Don't have an account? </Text>
                            <Pressable onPress={() => router.push('/(auth)/signup')} hitSlop={8}>
                                <Text style={styles.signupLink}>Create one</Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </LinearGradient>
        </SafeAreaView>
    );
}