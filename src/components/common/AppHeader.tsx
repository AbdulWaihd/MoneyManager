import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Bell, UserRound } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { useAuth } from '../../contexts/AuthContext';

type Props = {
    compact?: boolean;
};

export default function AppHeader({ compact = false }: Props) {
    const { currentUser } = useAuth();
    const initial = currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'U';

    return (
        <View style={[styles.header, compact && styles.compactHeader]}>
            <View style={styles.identity}>
                <View style={styles.avatar}>
                    {initial ? (
                        <Text style={styles.avatarText}>{initial.toUpperCase()}</Text>
                    ) : (
                        <UserRound color={COLORS.primary} size={22} />
                    )}
                </View>
                <Text style={styles.brand}>WealthFlow</Text>
            </View>
            <Pressable style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]} hitSlop={8}>
                <Bell color={COLORS.text} size={24} strokeWidth={1.9} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        minHeight: 88,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.xl,
        backgroundColor: '#fbfbff',
        borderBottomWidth: 1,
        borderBottomColor: '#eef0f7',
    },
    compactHeader: {
        minHeight: 76,
    },
    identity: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: COLORS.surface,
        fontSize: TYPOGRAPHY.sizes.md,
        fontWeight: '700',
        fontFamily: TYPOGRAPHY.fonts.body,
    },
    brand: {
        color: COLORS.primary,
        fontSize: 28,
        lineHeight: 34,
        fontWeight: '800',
        fontFamily: TYPOGRAPHY.fonts.heading,
    },
    iconButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pressed: {
        opacity: 0.65,
    },
});
