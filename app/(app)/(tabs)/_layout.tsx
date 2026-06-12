// app/(app)/(tabs)/_layout.tsx
// ============================================
// RESPONSIBILITY: Tab navigator for main features
// - 4 tabs: home, transactions, categories, settings
// - Bottom tab bar with icons and labels
// - Only visible to authenticated users
// ============================================

import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../../src/constants/colors';
import { SPACING } from '../../../src/constants/spacing';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,        // #0057bf (blue)
        tabBarInactiveTintColor: COLORS['text-light'], // #424754 (gray)
        tabBarStyle: {
          paddingBottom: SPACING.sm,
          paddingTop: SPACING.sm,
          height: 60,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          backgroundColor: COLORS.surface,
        },
      }}
    >
      {/* HOME TAB */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? 'home' : 'home-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />

      {/* TRANSACTIONS TAB */}
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? 'history' : 'history'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />

      {/* CATEGORIES TAB */}
      <Tabs.Screen
        name="category"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? 'tag-multiple' : 'tag-multiple-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />

      {/* SETTINGS TAB */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? 'cog' : 'cog-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}