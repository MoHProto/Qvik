import Ionicons from '@expo/vector-icons/Ionicons';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import {
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from 'expo-router/unstable-native-tabs';
import React from 'react';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const navigationTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const tabIconColorDefault = navigationTheme.colors.text;
  const tabIconColorSelected = navigationTheme.colors.primary;

  return (
    <ThemeProvider value={navigationTheme}>
      <NativeTabs
        iconColor={{
          default: tabIconColorDefault,
          selected: tabIconColorSelected,
        }}
      >
        <NativeTabs.Trigger name="search">
          <Icon
            src={{
              default: <VectorIcon family={Ionicons} name="search-outline" />,
              selected: <VectorIcon family={Ionicons} name="search-outline" />,
            }}
          />
          <Label>Search</Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="index">
          <Icon
            src={{
              default: (
                <VectorIcon
                  family={Ionicons}
                  name="chatbubble-ellipses-outline"
                />
              ),
              selected: (
                <VectorIcon
                  family={Ionicons}
                  name="chatbubble-ellipses-outline"
                />
              ),
            }}
          />
          <Label>Threads</Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="settings">
          <Icon
            src={{
              default: <VectorIcon family={Ionicons} name="settings-outline" />,
              selected: (
                <VectorIcon family={Ionicons} name="settings-outline" />
              ),
            }}
          />
          <Label>Settings</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </ThemeProvider>
  );
}
