import { ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { AppToast } from 'components/ui/toast';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nProvider, useI18n } from 'hooks/i18n/I18nProvider';
import { queryClient } from 'lib/react-query/queryClient';
import { getAppNavigationTheme } from 'lib/unistyles/utils';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';
import { PopupProvider } from 'react-popup-manager';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootNavigation() {
  const colorScheme = useColorScheme();
  const theme = getAppNavigationTheme(colorScheme);
  const { theme: appTheme } = useUnistyles();
  const { t } = useI18n();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={theme}>
        <PopupProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(onboarding)/index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="threads/[threadId]/index"
              options={{
                title: t('nav.thread'),
                headerBackTitle: t('nav.back'),
                headerTitleAlign: 'center',
                contentStyle: {
                  backgroundColor: appTheme.colors.background,
                },
              }}
            />
            <Stack.Screen
              name="threads/[threadId]/messages"
              options={{
                title: t('nav.messages'),
                headerBackTitle: t('nav.threadsBack'),
                headerTitleAlign: 'center',
                contentStyle: {
                  backgroundColor: appTheme.colors.background,
                },
              }}
            />
          </Stack>
          <StatusBar style="auto" />
          <AppToast />
        </PopupProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <I18nProvider>
          <RootNavigation />
        </I18nProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
