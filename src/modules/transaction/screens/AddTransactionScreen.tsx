import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { TYPOGRAPHY } from '../../../constants/typography';
import TransactionForm from '../components/TransactionForm';
import { TransactionFormData } from '../transactionSchemas';
import { addTransaction } from '../services/transactionService';
import { getCurrentUser } from '../../auth';
import { useLoading } from '../../../contexts/LoadingContext';

export default function AddTransactionScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { setIsLoading } = useLoading();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (data: TransactionFormData) => {
        const user = getCurrentUser();
        if (!user) return;

        setIsSubmitting(true);
        setIsLoading(true);
        setError(null);

        try {
            // Convert amountString to integer (paise)
            const amountInPaise = Math.round(parseFloat(data.amountString) * 100);
            
            await addTransaction(user.uid, {
                type: data.type,
                category: data.category,
                description: data.description || '',
                amount: amountInPaise,
                date: data.date,
            });
            
            router.back();
        } catch (err) {
            console.error('Failed to add transaction', err);
            setError('Failed to add transaction. Please try again.');
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
                    <Text style={styles.title}>New Transaction</Text>
                    
                    {error && (
                        <View style={styles.errorBanner}>
                            <Text style={styles.errorBannerText}>{error}</Text>
                        </View>
                    )}

                    <TransactionForm 
                        onSubmit={handleSubmit}
                        onCancel={() => router.back()}
                        isSubmitting={isSubmitting}
                    />
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
});
