import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Image, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Shield, Bell, Headset, Trash2, ChevronRight, Banknote, Palette, Globe } from 'lucide-react-native';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { TYPOGRAPHY } from '../../../constants/typography';
import { getCurrentUser, logout } from '../../auth';
import { useLoading } from '../../../contexts/LoadingContext';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { useTheme } from '../../../contexts/ThemeContext';

export default function SettingsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { setIsLoading } = useLoading();
    const user = getCurrentUser();

    const handleLogout = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out',
                style: 'destructive',
                onPress: async () => {
                    setIsLoading(true);
                    try {
                        await logout();
                        router.replace('/(auth)/login');
                    } catch (error) {
                        console.error('Logout failed:', error);
                        Alert.alert('Error', 'Failed to sign out');
                    } finally {
                        setIsLoading(false);
                    }
                }
            }
        ]);
    };

    const { currency, setCurrency } = useCurrency();
    const { theme, toggleTheme } = useTheme();

    const [isCurrencyModalVisible, setCurrencyModalVisible] = useState(false);

    const getCurrencySymbol = (c: string) => {
        switch (c) {
            case 'USD': return '$';
            case 'EUR': return '€';
            case 'GBP': return '£';
            case 'INR': return '₹';
            default: return '';
        }
    };

    const PickerModal = ({ visible, title, options, selectedValue, onSelect, onClose }: any) => (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    {options.map((option: any) => (
                        <Pressable
                            key={option.value}
                            style={[styles.modalOption, selectedValue === option.value && styles.modalOptionSelected]}
                            onPress={() => {
                                onSelect(option.value);
                                onClose();
                            }}
                        >
                            <Text style={[styles.modalOptionText, selectedValue === option.value && styles.modalOptionTextSelected]}>
                                {option.label}
                            </Text>
                        </Pressable>
                    ))}
                    <Pressable style={styles.modalCloseButton} onPress={onClose}>
                        <Text style={styles.modalCloseText}>Cancel</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );

    const OptionRow = ({ icon: Icon, title, value, onPress, isLast, isDestructive = false, iconColor, iconBg, disabled = false }: any) => (
        <View style={!isLast && styles.rowDivider}>
            <TouchableOpacity
                style={[styles.optionRow, disabled && { opacity: 0.5 }]}
                onPress={disabled ? undefined : onPress}
                disabled={disabled}
            >
                <View style={styles.leftSection}>
                    <View style={[
                        styles.optionIconBox,
                        isDestructive && styles.optionIconBoxDestructive,
                        !isDestructive && iconBg && { backgroundColor: iconBg }
                    ]}>
                        <Icon
                            size={20}
                            color={isDestructive ? COLORS.error : (iconColor || '#64748B')}
                        />
                    </View>
                    <Text style={[styles.optionText, isDestructive && styles.optionTextDestructive]}>{title}</Text>
                </View>

                <View style={styles.rightSection}>
                    {value && <Text style={styles.optionValue}>{value}</Text>}
                    {!isDestructive && !disabled && <ChevronRight size={20} color="#94A3B8" />}
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerAvatar}>
                    <Text style={styles.headerAvatarText}>
                        {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                    </Text>
                </View>
                <Text style={styles.headerTitle}>WealthFlow</Text>
                <Pressable onPress={() => { }}>
                    <Bell size={24} color="#475569" />
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + SPACING.xl }]}>
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                        </Text>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{user?.displayName || 'User'}</Text>
                        <Text style={styles.profileEmail}>{user?.email}</Text>
                    </View>
                    <Pressable style={styles.editButton} onPress={() => { }}>
                        <Text style={styles.editButtonText}>Edit</Text>
                    </Pressable>
                </View>

                {/* Preferences Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PREFERENCES</Text>
                    <View style={styles.card}>
                        <OptionRow
                            icon={Banknote}
                            title="Currency"
                            value={`${currency} (${getCurrencySymbol(currency)})`}
                            iconColor="#10B981"
                            iconBg="#D1FAE5"
                            onPress={() => setCurrencyModalVisible(true)}
                        />
                        <OptionRow
                            icon={Palette}
                            title="Theme"
                            value={theme === 'dark' ? 'Dark' : 'Light'}
                            iconColor="#8B5CF6"
                            iconBg="#EDE9FE"
                            onPress={toggleTheme}
                        />
                        <OptionRow
                            icon={Globe}
                            title="Language"
                            value="Coming soon"
                            iconColor="#3B82F6"
                            iconBg="#DBEAFE"
                            isLast
                            disabled
                            onPress={() => { }}
                        />
                    </View>
                </View>

                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ACCOUNT</Text>
                    <View style={styles.card}>
                        <OptionRow
                            icon={Shield}
                            title="Security"
                            iconColor="#F59E0B"
                            iconBg="#FEF3C7"
                            onPress={() => router.push('/(app)/(tabs)/settings?action=change-password')}
                        />
                        <OptionRow
                            icon={Bell}
                            title="Notifications"
                            iconColor="#EC4899"
                            iconBg="#FCE7F3"
                            onPress={() => { }}
                        />
                        <OptionRow
                            icon={Headset}
                            title="Help & Support"
                            iconColor="#06B6D4"
                            iconBg="#CFFAFE"
                            isLast
                            onPress={() => router.push('/(app)/(tabs)/settings?action=contact-us')}
                        />
                    </View>
                </View>

                {/* Delete / Logout Section */}
                <View style={styles.section}>
                    <View style={styles.card}>
                        <OptionRow
                            icon={Trash2}
                            title="Delete Account"
                            isLast
                            isDestructive
                            onPress={handleLogout}
                        />
                    </View>
                </View>

            </ScrollView>

            <PickerModal
                visible={isCurrencyModalVisible}
                title="Select Currency"
                selectedValue={currency}
                options={[
                    { label: 'USD ($)', value: 'USD' },
                    { label: 'EUR (€)', value: 'EUR' },
                    { label: 'GBP (£)', value: 'GBP' },
                    { label: 'INR (₹)', value: 'INR' },
                ]}
                onSelect={setCurrency}
                onClose={() => setCurrencyModalVisible(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: SPACING.lg,
        paddingBottom: 40,
    },
    modalTitle: {
        fontSize: TYPOGRAPHY.sizes.lg,
        fontWeight: '700',
        color: '#0F172A',
        fontFamily: TYPOGRAPHY.fonts.heading,
        marginBottom: SPACING.lg,
        textAlign: 'center',
    },
    modalOption: {
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    modalOptionSelected: {
        backgroundColor: '#F8FAFC',
    },
    modalOptionText: {
        fontSize: 16,
        color: '#475569',
        fontFamily: TYPOGRAPHY.fonts.body,
        textAlign: 'center',
    },
    modalOptionTextSelected: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    modalCloseButton: {
        marginTop: SPACING.lg,
        paddingVertical: SPACING.md,
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        alignItems: 'center',
    },
    modalCloseText: {
        fontSize: 16,
        color: '#0F172A',
        fontWeight: '600',
        fontFamily: TYPOGRAPHY.fonts.body,
    },
    container: {
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        backgroundColor: '#F8FAFC', // Or #FFFFFF depending on layout
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    headerAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerAvatarText: {
        color: '#475569',
        fontSize: 14,
        fontWeight: '600',
    },
    headerTitle: {
        flex: 1,
        fontSize: TYPOGRAPHY.sizes.lg,
        fontWeight: '700',
        color: COLORS.primary,
        fontFamily: TYPOGRAPHY.fonts.heading,
        marginLeft: SPACING.md,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: SPACING.lg,
        borderRadius: 16,
        marginBottom: SPACING.xl,
        // Drop shadow as per image
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#1E293B',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    avatarText: {
        color: '#FFF',
        fontSize: TYPOGRAPHY.sizes.xl,
        fontWeight: '600',
    },
    profileInfo: {
        flex: 1,
        marginRight: SPACING.sm,
    },
    profileName: {
        fontSize: TYPOGRAPHY.sizes.lg,
        fontWeight: '600',
        color: '#0F172A',
        fontFamily: TYPOGRAPHY.fonts.body,
        marginBottom: 2,
    },
    profileEmail: {
        fontSize: TYPOGRAPHY.sizes.sm,
        color: '#64748B',
        fontFamily: TYPOGRAPHY.fonts.body,
    },
    editButton: {
        backgroundColor: '#EFF6FF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    editButtonText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: TYPOGRAPHY.sizes.sm,
        fontFamily: TYPOGRAPHY.fonts.body,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
        fontFamily: TYPOGRAPHY.fonts.body,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: SPACING.sm,
        paddingHorizontal: 4,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 1,
    },
    rowDivider: {
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.md,
        backgroundColor: '#FFFFFF',
    },
    optionRowPressed: {
        backgroundColor: '#F8FAFC',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    optionIconBox: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionIconBoxDestructive: {
        backgroundColor: '#FEF2F2',
    },
    optionText: {
        fontSize: 16,
        color: '#0F172A',
        fontFamily: TYPOGRAPHY.fonts.body,
    },
    optionTextDestructive: {
        color: COLORS.error,
    },
    optionValue: {
        fontSize: 15,
        color: '#475569',
        fontFamily: TYPOGRAPHY.fonts.body,
    },
});
