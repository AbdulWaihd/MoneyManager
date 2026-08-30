import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import AnimatedAvatar from './AnimatedAvatar';
import FloatingMoney from './FloatingMoney';
import GlassCard from './GlassCard';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';

export default function LandingHero() {
  const router = useRouter();
  const [playAnimation, setPlayAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setPlayAnimation(false), 2600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.shell}>
      <View style={styles.heroCard}>
        <View style={styles.badge}>
          <Sparkles size={16} color={COLORS.primary} />
          <Text style={styles.badgeText}>Smart money, beautifully simple</Text>
        </View>

        <Text style={styles.title}>Grow your wealth with clarity.</Text>
        <Text style={styles.subtitle}>
          Track every dollar, see your momentum, and stay ahead with calm confidence.
        </Text>

        <View style={styles.avatarScene}>
          <FloatingMoney active={playAnimation} />
          <AnimatedAvatar happy={playAnimation} />
        </View>

        <GlassCard style={styles.ctaCard} variant="strong">
          <Text style={styles.ctaLabel}>Ready to take control?</Text>
          <View style={styles.actions}>
            <Pressable style={styles.primaryButton} onPress={() => router.push('/(auth)/signup')}>
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.secondaryButtonText}>Login</Text>
            </Pressable>
          </View>
        </GlassCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  heroCard: {
    padding: SPACING.xl,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#5c6b83',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.14,
    shadowRadius: 30,
    elevation: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 999,
    backgroundColor: 'rgba(0,87,191,0.12)',
    marginBottom: SPACING.md,
  },
  badgeText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: TYPOGRAPHY.sizes.sm,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.fonts.heading,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS['text-light'],
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },
  avatarScene: {
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  ctaCard: {
    padding: SPACING.lg,
  },
  ctaLabel: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 18,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'rgba(0,87,191,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 18,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
