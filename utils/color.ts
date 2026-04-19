import { Platform, PlatformColor } from 'react-native';

/**
 * Converts a 3/6-digit hex color (`#abc` / `#aabbcc`) to an rgba() string.
 * If the input isn't a valid hex, returns it unchanged.
 */
export function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '').trim();
  const full = normalized.length === 3 ? normalized.split('').map((c) => c + c).join('') : normalized;
  if (full.length !== 6) return hex;

  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

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

