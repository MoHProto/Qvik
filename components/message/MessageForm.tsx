import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

/** Vertical padding inside the floating footer (excluding safe area). */
const FOOTER_VERTICAL_PADDING = 12;

/** Min height of the primary control (pill). */
const CONTROL_MIN_HEIGHT = 48;

/**
 * Floating footer over message content: transparent chrome, no border.
 * Primary action is a full-width pill with primary background.
 */
export function MessageForm({ onStartPress }: { onStartPress?: () => void }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { theme } = useUnistyles();
  const paddingBottom =
    insets.bottom +
    (Platform.OS === 'web' ? theme.spacing[4] : 0);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { paddingBottom }]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Start"
        android_ripple={
          Platform.OS === 'android'
            ? { color: 'rgba(255, 255, 255, 0.25)', borderless: false }
            : undefined
        }
        onPress={onStartPress}
        style={[
          styles.control,
          styles.controlShadow,
          { backgroundColor: colors.primary },
        ]}
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
    backgroundColor: 'transparent',
    borderWidth: 0,
    overflow: 'visible',
  },
  /**
   * Shadow/elevation must sit on the same view as the opaque fill (RN + iOS).
   * Values align with `IosToastBanner` shadowWrap.
   */
  controlShadow: {
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
      default: {
        // Web / fallback
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.18)',
      },
    }),
  },
  control: {
    minHeight: CONTROL_MIN_HEIGHT,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[4],
  },
  controlLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
  },
}));
