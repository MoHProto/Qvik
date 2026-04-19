import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router';
import { useI18n } from 'hooks/i18n/I18nProvider';
import { useNotifyToast } from 'hooks/notify/useNotifyToast';
import React from 'react';
import { Platform, Pressable } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

function ThreadsHeaderAddButton() {
  const notify = useNotifyToast();
  const { theme } = useUnistyles();
  const { t } = useI18n();
  return (
    <Pressable
      accessibilityLabel={t('threads.header.addA11y')}
      accessibilityRole="button"
      hitSlop={12}
      onPress={() =>
        notify.success(t('threads.toast.saved.title'), t('threads.toast.saved.message'))
      }
      style={({ pressed }) => [
        styles.headerButton,
        pressed && styles.headerButtonPressed,
      ]}
    >
      <Ionicons
        name="add"
        size={24}
        color={theme.colors.text}
        style={styles.headerIcon}
      />
    </Pressable>
  );
}

export default function ThreadsTabLayout() {
  const { theme } = useUnistyles();
  const { t } = useI18n();
  return (
    <Stack
      screenOptions={{
        headerTitle: t('tabs.threads'),
        headerTintColor: Platform.select({
          ios: theme.colors.text,
          default: undefined,
        }),
        // Match `HeaderBackButton` horizontal inset on non-iOS (`marginHorizontal: 11`).
        ...(Platform.OS === 'web' || Platform.OS === 'android'
          ? { headerRightContainerStyle: { paddingEnd: 11 } }
          : {}),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerBackVisible: false,
          headerLeft: () => null,
          headerRight: () => <ThreadsHeaderAddButton />,
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
