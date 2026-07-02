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

export default function ContactUsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isFormFilled = message.trim().length > 0;

    const handleSubmit = async () => {
        if (!isFormFilled) return;

        setIsSubmitting(true);
        
        // Mock send message
        setTimeout(() => {
            setIsSubmitting(false);
            Alert.alert('Message Sent', 'Thank you for reaching out. We will get back to you soon.', [
                { text: 'OK', onPress: () => router.setParams({ action: '' }) }
            ]);
        }, 1500);
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

                    <Text style={styles.title}>Contact Us</Text>
                    
                    <Text style={styles.description}>
                        Have a question, feedback, or need support? Let us know below.
                    </Text>

                    <View style={styles.form}>
                        <View style={styles.field}>
                            <Text style={styles.label}>Message</Text>
                            <View style={styles.textAreaContainer}>
                                <TextInput
                                    placeholder="Type your message here..."
                                    value={message}
                                    onChangeText={setMessage}
                                    multiline
                                    numberOfLines={6}
                                    style={styles.textArea}
                                />
                            </View>
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
                                label="Send Message"
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
        marginBottom: SPACING.sm,
    },
    description: {
        fontSize: TYPOGRAPHY.sizes.base,
        color: COLORS['text-light'],
        fontFamily: TYPOGRAPHY.fonts.body,
        lineHeight: 22,
        marginBottom: SPACING.xl,
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
    textAreaContainer: {
        height: 150,
    },
    textArea: {
        height: '100%',
        textAlignVertical: 'top',
        paddingTop: SPACING.md,
    },
    actions: {
        flexDirection: 'row',
        marginTop: SPACING.xl,
    }
});
