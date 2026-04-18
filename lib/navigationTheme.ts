import type { Theme } from '@react-navigation/native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

/**
 * React Navigation `colors.primary` drives default stack header tint (back, title).
 * Keep it text-like; use `getSystemAccentColor()` + Unistyles `theme.colors.primary` for accents.
 */
const headerChromePrimary = {
  light: 'rgba(17, 24, 39, 0.82)',
  dark: 'rgba(249, 250, 251, 0.82)',
} as const;

export function getAppNavigationTheme(
  colorScheme: 'light' | 'dark' | null | undefined,
): Theme {
  const base = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const primary =
    colorScheme === 'dark'
      ? headerChromePrimary.dark
      : headerChromePrimary.light;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary,
    },
  };
}
