// app/(app)/(tabs)/_layout.tsx
// ============================================
// RESPONSIBILITY: Tab navigator for main features
// - 4 tabs: home, transactions, categories, settings
// - Bottom tab bar with icons and labels
// - Only visible to authenticated users
// ============================================

import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { TYPOGRAPHY } from '../../../constants/typography';

type TabIconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

type TabItemProps = {
  focused: boolean;
  label: string;
  activeIcon: TabIconName;
  inactiveIcon: TabIconName;
};

function TabItem({ focused, label, activeIcon, inactiveIcon }: TabItemProps) {
  const color = focused ? COLORS.surface : '#9aa0aa';

  return (
    <View style={[styles.tabItem, focused && styles.activeTabItem]}>
      <MaterialCommunityIcons
        name={focused ? activeIcon : inactiveIcon}
        size={28}
        color={color}
      />
      <Text style={[styles.tabLabel, focused && styles.activeTabLabel]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 85,
          paddingTop: 10,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingHorizontal: SPACING.md,
          borderTopWidth: 0,
          backgroundColor: COLORS.surface,
          shadowColor: '#111c2d',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.06,
          shadowRadius: 18,
          elevation: 12,
        },
        tabBarItemStyle: {
          height: 70,
          justifyContent: 'center',
        },
      }}
    >
      {/* HOME TAB */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabItem
              focused={focused}
              label="Home"
              activeIcon="home"
              inactiveIcon="home-outline"
            />
          ),
        }}
      />

      {/* TRANSACTIONS TAB */}
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => (
            <TabItem
              focused={focused}
              label="History"
              activeIcon="history"
              inactiveIcon="history"
            />
          ),
        }}
      />

      {/* CATEGORIES TAB */}
      <Tabs.Screen
        name="category"
        options={{
          title: 'Categories',
          tabBarIcon: ({ focused }) => (
            <TabItem
              focused={focused}
              label="Categories"
              activeIcon="shape"
              inactiveIcon="shape-outline"
            />
          ),
        }}
      />

      {/* SETTINGS TAB */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <TabItem
              focused={focused}
              label="Settings"
              activeIcon="cog"
              inactiveIcon="cog-outline"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    width: 80,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  activeTabItem: {
    width: 70,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
  tabLabel: {
    color: '#9aa0aa',
    fontSize: TYPOGRAPHY.sizes.sm,
    lineHeight: 17,
    fontWeight: '800',
    fontFamily: TYPOGRAPHY.fonts.body,
  },
  activeTabLabel: {
    color: COLORS.surface,
  },
});
