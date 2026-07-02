import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Mail } from 'lucide-react-native';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { TYPOGRAPHY } from '../../../constants/typography';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../../../lib/firebase';

export default function VerifyEmailScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams<{ email: string }>();
    const email = params.email || auth.currentUser?.email || 'your email';
    const { reloadUser, currentUser } = useAuth();

    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);

    // Auto-polling effect to detect when the user verifies their email externally
    useEffect(() => {
        const interval = setInterval(async () => {
            if (auth.currentUser) {
                await auth.currentUser.reload();
                if (auth.currentUser.emailVerified) {
                    clearInterval(interval);
                    await reloadUser();
                    // Routing is handled automatically by the auth guards in layouts
                    // (They will allow access to (app) once currentUser.emailVerified is true)
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [reloadUser]);

    const handleManualVerify = async () => {
        setIsVerifying(true);
        if (auth.currentUser) {
            await auth.currentUser.reload();
            if (auth.currentUser.emailVerified) {
                await reloadUser();
                // Auth guards take over
            } else {
                Alert.alert('Not Verified', 'Your email is not verified yet. Please check your inbox and click the verification link.');
            }
        }
        setIsVerifying(false);
    };

    const handleResend = async () => {
        if (!auth.currentUser) return;
        setIsResending(true);
        try {
            await sendEmailVerification(auth.currentUser);
            Alert.alert('Email Resent', `A new verification email has been sent to ${email}.`);
        } catch (error: any) {
            if (error.message.includes('too-many-requests')) {
                Alert.alert('Too many requests', 'Please wait a moment before trying again.');
            } else {
                Alert.alert('Error', error.message || 'Failed to resend email.');
            }
        } finally {
            setIsResending(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={[
                        styles.container,
                        { paddingTop: insets.top + SPACING.xl, paddingBottom: insets.bottom + SPACING.xl },
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Icon */}
                    <View style={styles.iconWrap}>
                        <Mail size={40} color={COLORS.primary} />
                    </View>

                    {/* Heading */}
                    <Text style={styles.title}>Verify your email</Text>
                    <Text style={styles.subtitle}>
                        We sent a verification link to{'\n'}
                        <Text style={styles.email}>{email}</Text>
                    </Text>

                    <Text style={styles.instruction}>
                        Click the link in the email to verify your account. This screen will automatically update when you're verified.
                    </Text>

                    {/* Verify Button (Manual fallback) */}
                    <Button
                        label="I've verified my email"
                        onPress={handleManualVerify}
                        loading={isVerifying}
                        style={styles.button}
                    />

                    {/* Resend */}
                    <View style={styles.resendRow}>
                        <Text style={styles.resendText}>Didn't receive the email? </Text>
                        <TouchableOpacity onPress={handleResend} disabled={isResending} hitSlop={8}>
                            <Text style={[styles.resendLink, isResending && { opacity: 0.5 }]}>Resend</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Back to login */}
                    <TouchableOpacity onPress={() => router.replace('/(auth)/login')} hitSlop={8} style={styles.backRow}>
                        <Text style={styles.backText}>← Back to Login</Text>
                    </TouchableOpacity>
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
        flexGrow: 1,
        paddingHorizontal: SPACING.lg,
        alignItems: 'center',
    },
    iconWrap: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(37,133,240,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: TYPOGRAPHY.sizes['2xl'],
        fontWeight: '800',
        color: COLORS.text,
        fontFamily: TYPOGRAPHY.fonts.heading,
        marginBottom: SPACING.sm,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: TYPOGRAPHY.sizes.base,
        color: COLORS['text-light'],
        fontFamily: TYPOGRAPHY.fonts.body,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: SPACING.lg,
    },
    email: {
        fontWeight: '700',
        color: COLORS.text,
    },
    instruction: {
        fontSize: TYPOGRAPHY.sizes.sm,
        color: '#64748B',
        textAlign: 'center',
        paddingHorizontal: SPACING.lg,
        lineHeight: 20,
        marginBottom: SPACING['2xl'],
    },
    button: {
        width: '100%',
        marginBottom: SPACING.lg,
    },
    resendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    resendText: {
        fontSize: TYPOGRAPHY.sizes.sm,
        color: COLORS['text-light'],
        fontFamily: TYPOGRAPHY.fonts.body,
    },
    resendLink: {
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: '700',
        color: COLORS.primary,
        fontFamily: TYPOGRAPHY.fonts.body,
        textDecorationLine: 'underline',
    },
    backRow: {
        marginTop: SPACING.sm,
    },
    backText: {
        fontSize: TYPOGRAPHY.sizes.sm,
        color: COLORS['text-light'],
        fontFamily: TYPOGRAPHY.fonts.body,
    },
});
