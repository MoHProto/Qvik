import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router';
import { useNotifyToast } from 'hooks/notify/useNotifyToast';
import React from 'react';
import { Platform, Pressable } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

function IndexHeaderAddButton() {
  const notify = useNotifyToast();
  const { theme } = useUnistyles();
  return (
    <Pressable
      accessibilityLabel="Add"
      accessibilityRole="button"
      hitSlop={12}
      onPress={() => notify.success('Saved', 'Your change was recorded.')}
      style={({ pressed }) => [styles.headerButton, pressed && styles.headerButtonPressed]}>
      <Ionicons name="add" size={24} color={theme.colors.primary} style={styles.headerIcon} />
    </Pressable>
  );
}

export default function IndexTabLayout() {
  const { theme } = useUnistyles();
  return (
    <Stack
      screenOptions={{
        headerTitle: 'Threads',
        headerTintColor: Platform.select({ ios: theme.colors.primary, default: undefined }),
      }}>
      <Stack.Screen
        name="index"
        options={{
          headerRight: () => <IndexHeaderAddButton />,
        }}
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
  headerButtonPressed: {
    opacity: 0.5,
  },
  headerIcon: {
    transform: [{ translateY: -4 }],
  },
}));

