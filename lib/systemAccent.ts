import { Platform, PlatformColor } from 'react-native';

/**
 * OS tint / Material primary — Unistyles `theme.colors.primary`, tab selection, accent buttons.
 * Stack headers use text-like nav `colors.primary` from `getAppNavigationTheme`.
 */
export function getSystemAccentColor() {
  if (Platform.OS === 'web') {
    return '#007AFF';
  }
  if (Platform.OS === 'ios') {
    return PlatformColor('systemBlue');
  }
  return PlatformColor('?attr/colorPrimary');
}
