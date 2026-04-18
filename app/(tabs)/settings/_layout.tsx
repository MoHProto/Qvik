import { Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

export default function SettingsTabLayout() {
  const { theme } = useUnistyles();
  return (
    <Stack
      screenOptions={{
        headerTitle: 'Settings',
        headerTintColor: Platform.select({
          ios: theme.colors.text,
          default: undefined,
        }),
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
