import { Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

export default function SearchTabLayout() {
  const { theme } = useUnistyles();
  return (
    <Stack
      screenOptions={{
        headerTitle: 'Search',
        headerTintColor: Platform.select({
          ios: theme.colors.text,
          default: undefined,
        }),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerBackVisible: false,
          headerLeft: () => null,
        }}
      />
    </Stack>
  );
}
