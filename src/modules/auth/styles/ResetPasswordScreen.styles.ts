// src/modules/auth/screens/LoginScreen.styles.ts
// ============================================
// RESPONSIBILITY: Login screen styling
// - Advanced color system
// - Platform-specific shadows
// - Responsive spacing
// ============================================

import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { TYPOGRAPHY } from '../../../constants/typography';

export const brand = StyleSheet.create({
    google: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    appleWrap: {
        width: 14,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    appleBody: {
        width: 10,
        height: 12,
        borderRadius: 3,
        backgroundColor: '#000',
    },
    appleLeaf: {
        position: 'absolute',
        top: -2,
        right: -1,
        width: 4,
        height: 5,
        backgroundColor: '#000',
        borderRadius: 1,
        transform: [{ rotate: '45deg' }],
    },
});

export const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    container: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.xl,
    },

    // Brand Header
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        marginBottom: SPACING.xl,
    },

    logoMark: {
        width: 42,
        height: 42,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: COLORS.primary,
                shadowOpacity: 0.3,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
            },
            android: {
                elevation: 4,
            },
        }),
    },

    logoInner: {
        width: 26,
        height: 26,
        borderRadius: 6,
        backgroundColor: 'rgba(255,255,255,0.25)',
    },

    brandName: {
        fontSize: TYPOGRAPHY.sizes.lg,
        fontWeight: '800',
        color: COLORS.text,
        fontFamily: TYPOGRAPHY.fonts.heading,
    },

    // Heading
    headingBlock: {
        marginBottom: SPACING.xl,
    },

    title: {
        fontSize: TYPOGRAPHY.sizes['2xl'],
        fontWeight: '800',
        color: COLORS.text,
        fontFamily: TYPOGRAPHY.fonts.heading,
        marginBottom: SPACING.sm,
    },

    subtitle: {
        fontSize: TYPOGRAPHY.sizes.base,
        color: COLORS['text-light'],
        fontFamily: TYPOGRAPHY.fonts.body,
        lineHeight: 20,
    },

    // Demo Box
    demoBox: {
        backgroundColor: 'rgba(37, 133, 240, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(37, 133, 240, 0.2)',
        borderRadius: SPACING.lg,
        padding: SPACING.md,
        marginBottom: SPACING.xl,
    },

    demoLabel: {
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: '700',
        color: COLORS.primary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: SPACING.xs,
        fontFamily: TYPOGRAPHY.fonts.body,
    },

    demoText: {
        fontSize: TYPOGRAPHY.sizes.sm,
        color: COLORS['text-light'],
        fontFamily: TYPOGRAPHY.fonts.body,
        lineHeight: 18,
    },

    demoValue: {
        fontWeight: '700',
        color: COLORS.primary,
        fontFamily: TYPOGRAPHY.fonts.body,
    },

    // Form
    form: {
        marginBottom: SPACING.lg,
        gap: SPACING.md,
    },

    forgotRow: {
        alignSelf: 'flex-end',
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.sm,
    },

    forgotText: {
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: '600',
        color: COLORS.primary,
        fontFamily: TYPOGRAPHY.fonts.body,
        textDecorationLine: 'underline',
    },

    // Error Banner
    errorBanner: {
        backgroundColor: 'rgba(186, 26, 26, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(186, 26, 26, 0.3)',
        borderRadius: SPACING.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        marginVertical: SPACING.md,
    },

    errorBannerText: {
        fontSize: TYPOGRAPHY.sizes.sm,
        color: COLORS.error,
        fontFamily: TYPOGRAPHY.fonts.body,
        fontWeight: '500',
    },

    // Divider
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        marginVertical: SPACING.lg,
    },

    divider: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.border,
    },

    dividerText: {
        fontSize: TYPOGRAPHY.sizes.sm,
        color: COLORS['text-light'],
        fontFamily: TYPOGRAPHY.fonts.body,
        fontWeight: '500',
    },

    // Signup Row
    signupRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: SPACING.xs,
    },

    signupText: {
        fontSize: TYPOGRAPHY.sizes.sm,
        color: COLORS['text-light'],
        fontFamily: TYPOGRAPHY.fonts.body,
    },

    signupLink: {
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: '700',
        color: COLORS.primary,
        fontFamily: TYPOGRAPHY.fonts.body,
        textDecorationLine: 'underline',
    },
});