import { AppToast } from 'components/ui/toast';
import { queryClient } from 'lib/queryClient';
import { getAppNavigationTheme } from 'lib/navigationTheme';
import { PopupProvider } from 'react-popup-manager';
import { ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { warmTabBarIonRasterSources } from 'lib/tabBarIonRasterSources';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = getAppNavigationTheme(colorScheme);

  useEffect(() => {
    void warmTabBarIonRasterSources();
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={theme}>
          <PopupProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="threads/[threadId]/index"
                options={{
                  title: 'Thread',
                  headerBackTitle: 'Back',
                  headerTitleAlign: 'center',
                }}
              />
              <Stack.Screen
                name="threads/[threadId]/messages"
                options={{
                  title: 'Messages',
                  headerBackTitle: 'Threads',
                  headerTitleAlign: 'center',
                }}
              />
            </Stack>
            <StatusBar style="auto" />
            <AppToast />
          </PopupProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
