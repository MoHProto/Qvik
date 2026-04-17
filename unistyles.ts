import { StyleSheet } from 'react-native-unistyles';

const colorsLight = {
  background: '#ffffff',
  /** Grouped lists (e.g. Settings) — page tint behind inset sections */
  groupedListBackground: '#f2f2f7',
  surface: '#ffffff',
  foreground: '#ffffff',
  text: '#111827',
  muted: '#6b7280',
  /** Default fill for Avatar (and similar) when no custom background is set */
  avatarFallback: '#e5e7eb',
  border: '#e5e7eb',
  // "Text-ish" tint for headers/links (instead of iOS default blue)
  primary: 'rgba(17, 24, 39, 0.82)',
  error: '#b91c1c',
  outgoingBubble: '#dbeafe',
  incomingBubble: '#f3f4f6',
  incomingBubbleError: '#fef2f2',
} as const;

const colorsDark = {
  background: '#0b1220',
  groupedListBackground: '#0b1220',
  surface: '#111827',
  foreground: '#1f2937',
  text: '#f9fafb',
  muted: '#9ca3af',
  avatarFallback: '#ececec',
  border: '#1f2937',
  primary: 'rgba(249, 250, 251, 0.82)',
  error: '#f87171',
  outgoingBubble: '#1e3a8a',
  incomingBubble: '#1f2937',
  incomingBubbleError: '#3f1f1f',
} as const;

const lightTheme = {
  colors: colorsLight,
  spacing: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
  },
  radius: {
    pill: 999,
    card: 12,
  },
  typography: {
    title: { fontSize: 22, fontWeight: '700' as const },
    subtitle: { fontSize: 14 },
    tabLabel: { fontSize: 14, fontWeight: '600' as const, letterSpacing: 0.2 },
    headerButton: { fontSize: 17, fontWeight: '500' as const },
  },
} as const;

const darkTheme = {
  ...lightTheme,
  colors: colorsDark,
} as const;

const breakpoints = {
  xs: 0,
  sm: 360,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

type AppBreakpoints = typeof breakpoints;

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  settings: {
    adaptiveThemes: true,
  },
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  breakpoints,
});
