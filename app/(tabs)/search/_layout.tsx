import { Stack } from 'expo-router';
import { useI18n } from 'hooks/i18n/I18nProvider';
import React from 'react';
import { Platform } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

export default function SearchTabLayout() {
  const { theme } = useUnistyles();
  const { t } = useI18n();
  return (
    <Stack
      screenOptions={{
        headerTitle: t('tabs.search'),
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
