import Ionicons from '@expo/vector-icons/Ionicons';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, useColorScheme } from 'react-native';

/**
 * Classic bottom tabs (JS navigator) for Android and web — avoids NativeTabs +
 * VectorIcon, which relies on expo-font rendering that is not available on web.
 * iOS uses `NavigationTabs.ios.tsx` (native tabs) instead.
 */
export default function NavigationTabs() {
  const colorScheme = useColorScheme();
  const navigationTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const tabIconColorDefault = navigationTheme.colors.text;
  const tabIconColorSelected = navigationTheme.colors.primary;

  return (
    <ThemeProvider value={navigationTheme}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: tabIconColorSelected,
          tabBarInactiveTintColor: tabIconColorDefault,
          // Web: default tab logic uses "beside-icon" for wide viewports (≥768px), which
          // packs icon + label into a 49px-tall bar and often clips labels on RN-web.
          ...(Platform.OS === 'web' && { tabBarLabelPosition: 'below-icon' as const }),
          tabBarStyle: {
            backgroundColor: navigationTheme.colors.card,
            borderTopColor: navigationTheme.colors.border,
            borderTopWidth: 1,
            paddingTop: 2,
            ...(Platform.OS === 'android' && { elevation: 8 }),
            // Default is 49px; icon + label needs more vertical space on RN-web or descenders clip.
            ...(Platform.OS === 'web' && { height: 58 }),
          },
          tabBarLabelStyle: Platform.select({
            web: {
              fontSize: 11,
              lineHeight: 15,
              paddingBottom: 1,
            },
            default: { fontSize: 11 },
          }),
        }}
      >
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="threads"
          options={{
            title: 'Threads',
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
