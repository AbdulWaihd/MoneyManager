import React from 'react';
import { View, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../../constants/colors';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'strong';
};

export default function GlassCard({ children, style, variant = 'default' }: Props) {
  return <View style={[styles.card, variant === 'strong' && styles.strong, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.74)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
    shadowColor: '#4c5b79',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
    overflow: 'hidden',
  },
  strong: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderColor: 'rgba(0,87,191,0.16)',
  },
});
