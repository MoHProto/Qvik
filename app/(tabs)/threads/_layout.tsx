import { Stack } from 'expo-router';
import { useI18n } from 'hooks/i18n/I18nProvider';
import React from 'react';
import { Platform } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

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
        }}
      />
    </Stack>
  );
}
