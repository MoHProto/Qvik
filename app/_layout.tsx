import { AppToast } from 'components/ui/toast';
import { queryClient } from 'lib/queryClient';
import { PopupProvider } from 'react-popup-manager';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={theme}>
          <PopupProvider>
            <Stack>
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
