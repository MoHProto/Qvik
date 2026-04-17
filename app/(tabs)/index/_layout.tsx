import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router';
import React from 'react';
import { Alert, Platform, Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export default function IndexTabLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: 'Home',
        headerTintColor: Platform.select({ ios: styles.headerButtonText.color, default: undefined }),
      }}>
      <Stack.Screen
        name="index"
        options={{
          headerRight: () => (
            <Pressable
              accessibilityLabel="Add"
              accessibilityRole="button"
              hitSlop={12}
              onPress={() => Alert.alert('Home', 'Save')}
              style={({ pressed }) => [styles.headerButton, pressed && styles.headerButtonPressed]}>
              <Ionicons
                name="add"
                size={24}
                color={styles.headerButtonText.color}
                style={styles.headerIcon}
              />
            </Pressable>
          ),
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
  headerButtonText: {
    ...theme.typography.headerButton,
    color: theme.colors.primary,
  },
}));

