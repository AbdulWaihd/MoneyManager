// app/(auth)/_layout.tsx
// ============================================
// RESPONSIBILITY: Public auth routes (no auth guard)
// - Routes: login, signup, reset-password
// - Expo Router auto-reads these files
// - No need to manually list them
// ============================================

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}