import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';

type Props = {
    visible: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
};

export default function BottomSheetModal({ visible, title, onClose, children }: Props) {
    const insets = useSafeAreaInsets();

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Pressable style={styles.backdrop} onPress={onClose} />
                <SafeAreaView style={styles.safe} edges={['bottom']}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.keyboard}
                    >
                        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, SPACING.sm) }]}>
                            <View style={styles.grabber} />
                            <View style={styles.header}>
                                <Pressable
                                    onPress={onClose}
                                    style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
                                    hitSlop={8}
                                >
                                    <X color={COLORS.text} size={28} strokeWidth={2} />
                                </Pressable>
                                <Text style={styles.title}>{title}</Text>
                                <View style={styles.headerSpacer} />
                            </View>
                            <ScrollView
                                style={{ flexShrink: 1 }}
                                keyboardShouldPersistTaps="handled"
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.content}
                            >
                                {children}
                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(17, 28, 45, 0.24)',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    safe: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    keyboard: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    sheet: {
        maxHeight: '92%',
        flexShrink: 1,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        backgroundColor: COLORS.surface,
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.md,
    },
    grabber: {
        alignSelf: 'center',
        width: 74,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#dce1ea',
        marginBottom: SPACING.md,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    closeButton: {
        width: 54,
        height: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f3fb',
    },
    title: {
        flex: 1,
        textAlign: 'center',
        color: COLORS.text,
        fontSize: 29,
        lineHeight: 36,
        fontWeight: '800',
        fontFamily: TYPOGRAPHY.fonts.heading,
    },
    headerSpacer: {
        width: 54,
    },
    content: {
        paddingBottom: SPACING.sm,
        gap: SPACING.md,
    },
    pressed: {
        opacity: 0.7,
    },
});
