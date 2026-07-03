// Purpose: Routes for authenticated users. Includes auth guard that redirects if NOT logged in.
// route gaurd
// app/(app)/_layout.tsx
// ============================================
// RESPONSIBILITY: Protected app routes
// - AUTH GUARD: Only authenticated users can access
// - If not logged in → redirected to landing page
// - Routes: tabs (main), change-password, contact-us
// ============================================

import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function AppLayout() {
  const { currentUser, isLoading } = useAuth();

  // Still loading auth state
  if (isLoading) {
    return null;  // Don't render anything while loading
  }

  // AUTH GUARD: User NOT logged in
  // Redirect to landing page (index.tsx)
  if (!currentUser?.uid) {
    return <Redirect href="/" />;
  }

  // AUTH GUARD: User is logged in but email is not verified
  // Redirect to verification screen
  if (!currentUser.emailVerified) {
    return <Redirect href="/(auth)/verify-email" />;
  }

  // User IS authenticated
  // Show protected routes
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'default',
      }}
    >
      {/* Main tabs: home, transactions, settings */}
      <Stack.Screen 
        name="(tabs)"
        options={{
          title: 'Home',
        }}
      />

      {/* Change password screen (stack, above tabs) */}
      <Stack.Screen 
        name="change-password"
        options={{
          title: 'Change Password',
          presentation: 'modal',  // Slides up as modal
        }}
      />

      {/* Contact us screen (stack, above tabs) */}
      <Stack.Screen 
        name="contact-us"
        options={{
          title: 'Contact Us',
          presentation: 'modal',  // Slides up as modal
        }}
      />
    </Stack>
  );
}