import { getSystemAccentColor } from 'utils/color';
import { StyleSheet } from 'react-native-unistyles';

const systemAccent = getSystemAccentColor();

const colorsLight = {
  background: '#f2f2f7',
  /** Alternative page/sheet surface (e.g. onboarding, message thread). */
  backgroundAlt: '#d4e0b8',
  surface: '#ffffff',
  text: '#111827',
  muted: '#6b7280',
  /** Default fill for Avatar (and similar) when no custom background is set */
  avatarFallback: '#e5e7eb',
  /** Large icon wells (e.g. onboarding) — lighter than `avatarFallback`. */
  onboardingIconCircle: '#f9fafb',
  border: '#e5e7eb',
  /** Slightly stronger border for form fields / inputs. */
  inputBorder: '#d1d5db',
  /** Links, tab accents, controls — follows system / Material primary. */
  primary: systemAccent,
  /** Translucent primary wash for small chips (e.g. bubble actions). */
  primaryMuted: 'rgba(0, 122, 255, 0.14)',
  error: '#b91c1c',
  outgoingBubble: '#dbeafe',
  incomingBubble: '#f3f4f6',
  /** Reply bubble: same warm tint family as `incomingBubbleError`, but lighter / airier. */
  incomingBubbleReply: '#f5ebe8',
  /** Failed incoming bubble — pale red wash (near-white) so it reads softer on `backgroundAlt`. */
  incomingBubbleError: '#fee2e2',
} as const;

const colorsDark = {
  background: '#0b1220',
  backgroundAlt: '#121f14',
  surface: '#111827',
  text: '#f9fafb',
  muted: '#9ca3af',
  avatarFallback: '#ececec',
  onboardingIconCircle: 'rgba(255, 255, 255, 0.16)',
  border: '#1f2937',
  inputBorder: '#374151',
  primary: systemAccent,
  primaryMuted: 'rgba(10, 132, 255, 0.22)',
  error: '#f87171',
  outgoingBubble: '#1e3a8a',
  incomingBubble: '#1f2937',
  /** Same red family as error bubble, lifted so it reads less heavy than `incomingBubbleError`. */
  incomingBubbleReply: '#3d302e',
  /** Failed incoming bubble — muted rose-gray, lighter / less chroma than before. */
  incomingBubbleError: '#3a3234',
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
    /** Top corners of bottom sheets / modal surfaces */
    sheet: 24,
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
