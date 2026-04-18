import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, Pressable, StyleSheet as RNStyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

/** Vertical padding inside the floating footer (excluding safe area). */
const FOOTER_VERTICAL_PADDING = 12;

/** Min height of the primary control (pill). */
const CONTROL_MIN_HEIGHT = 48;

/** Fade from `transparent` uses black RGB; interpolate from same hue at α=0 to avoid a dark band. */
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * Floating footer over message content: transparent chrome, no border.
 * Primary action is a full-width pill with primary background.
 */
export function MessageForm({ onStartPress }: { onStartPress?: () => void }) {
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();
  const paddingBottom =
    insets.bottom +
    (Platform.OS === 'web' ? theme.spacing[4] : 0);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { paddingBottom }]}
    >
      <LinearGradient
        colors={[
          hexToRgba(theme.colors.backgroundAlt, 0),
          theme.colors.backgroundAlt,
        ]}
        end={{ x: 0.5, y: 1 }}
        pointerEvents="none"
        start={{ x: 0.5, y: 0 }}
        style={RNStyleSheet.absoluteFill}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Start"
        android_ripple={
          Platform.OS === 'android'
            ? { color: 'rgba(255, 255, 255, 0.25)', borderless: false }
            : undefined
        }
        onPress={onStartPress}
        style={[styles.control, { backgroundColor: theme.colors.primary }]}
      >
        <Text style={styles.controlLabel}>Start</Text>
      </Pressable>
    </View>
  );
}

/**
 * Extra bottom padding for scroll content so rows clear the floating footer.
 * Pass `theme.spacing[4]` as `additionalBottom` on web so it matches the footer’s bottom inset.
 */
export function getMessageFormListInsetBottom(
  safeBottom: number,
  additionalBottom = 0,
): number {
  return (
    FOOTER_VERTICAL_PADDING * 2 +
    CONTROL_MIN_HEIGHT +
    safeBottom +
    additionalBottom
  );
}

const styles = StyleSheet.create((theme) => ({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    paddingHorizontal: theme.spacing[4],
    paddingTop: FOOTER_VERTICAL_PADDING,
    borderWidth: 0,
    overflow: 'visible',
  },
  control: {
    minHeight: CONTROL_MIN_HEIGHT,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[4],
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.22,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      default: {},
    }),
  },
  controlLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
  },
}));
