import { Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export default function SettingsTabLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: 'Settings',
        headerTintColor: Platform.select({ ios: styles.headerButtonText.color, default: undefined }),
      }}>
      <Stack.Screen
        name="index"
      />
    </Stack>
  );
}

const styles = StyleSheet.create((theme) => ({
  headerButton: {
    height: 44,
    paddingHorizontal: theme.spacing[2],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonText: {
    ...theme.typography.headerButton,
    color: theme.colors.primary,
  },
}));
