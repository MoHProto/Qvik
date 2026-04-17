import { Stack } from 'expo-router';
import React from 'react';

export default function SearchTabLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: 'Search',
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
