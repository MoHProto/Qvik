import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { ThemeProvider } from '@react-navigation/native';
import { SupportUkraineBanner } from 'components/ui/SupportUkraineBanner';
import { Tabs } from 'expo-router';
import { useI18n } from 'hooks/i18n/I18nProvider';
import { getAppNavigationTheme } from 'lib/unistyles/utils';
import React from 'react';
import { Platform, View, useColorScheme } from 'react-native';
import { getSystemAccentColor } from 'utils/color';

/**
 * Bottom tabs via Expo Router `Tabs` (JS navigator) for Android, web, and iOS
 * when native tabs are disabled (see `NavigationTabs.ios.tsx`).
 */
export default function NavigationTabs() {
  const colorScheme = useColorScheme();
  const navigationTheme = getAppNavigationTheme(colorScheme);
  const tabIconColorDefault = navigationTheme.colors.text;
  const tabIconColorSelected = getSystemAccentColor();
  const { t } = useI18n();

  return (
    <ThemeProvider value={navigationTheme}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: tabIconColorSelected as string,
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
        tabBar={(props) => (
          <View>
            <SupportUkraineBanner hideBody />
            <BottomTabBar {...props} />
          </View>
        )}
      >
        <Tabs.Screen
          name="search"
          options={{
            title: t('tabs.search'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="threads"
          options={{
            title: t('tabs.threads'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubbles-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: t('tabs.settings'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
