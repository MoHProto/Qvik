import { LinearGradient } from 'expo-linear-gradient';
import { useI18n } from 'hooks/i18n/I18nProvider';
import React from 'react';
import { Platform, Pressable, StyleSheet as RNStyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { hexToRgba } from 'utils/color';
import Ionicons from '@expo/vector-icons/Ionicons';
import { usePopupManager } from 'react-popup-manager';
import { MenuModal, type MenuItem } from 'components/ui/MenuModal';

/** Vertical padding inside the floating footer (excluding safe area). */
const FOOTER_VERTICAL_PADDING = 12;

/** Min height of the primary control (pill). */
const CONTROL_MIN_HEIGHT = 48;

/**
 * Floating footer over message content: transparent chrome, no border.
 * Primary action is a full-width pill with primary background.
 */
export function MessageForm({
  onStartPress,
  showMenuButton = false,
  menu = [],
  onMenuItemPress,
}: {
  onStartPress?: () => void;
  showMenuButton?: boolean;
  menu?: MenuItem[];
  onMenuItemPress?: (item: MenuItem) => void;
}) {
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();
  const paddingBottom = insets.bottom + (Platform.OS === 'web' ? theme.spacing[4] : 0);
  const { t } = useI18n();
  const popupManager = usePopupManager();

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom }]}>
      <LinearGradient
        colors={[hexToRgba(theme.colors.backgroundAlt, 0), theme.colors.backgroundAlt]}
        end={{ x: 0.5, y: 1 }}
        pointerEvents="none"
        start={{ x: 0.5, y: 0 }}
        style={RNStyleSheet.absoluteFill}
      />
      {showMenuButton ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('a11y.menu')}
          onPress={() => {
            const { response } = popupManager.open(MenuModal, {
              data: menu,
              onPress: onMenuItemPress,
            });

            response.then((result) => {
              if (result && typeof result === 'object') {
                onMenuItemPress?.(result);
              }
            });
          }}
          style={({ pressed }) => [styles.menuControl, pressed && styles.controlPressed]}
        >
          <Ionicons name="menu" size={18} color={theme.colors.text} />
          <Text style={styles.menuLabel}>Menu</Text>
        </Pressable>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('messageForm.startPress')}
          android_ripple={
            Platform.OS === 'android'
              ? { color: 'rgba(255, 255, 255, 0.25)', borderless: false }
              : undefined
          }
          onPress={onStartPress}
          style={({ pressed }) => [
            styles.control,
            { backgroundColor: theme.colors.primary },
            pressed && styles.controlPressed,
          ]}
        >
          <Text style={styles.controlLabel}>{t('messageForm.startPress')}</Text>
        </Pressable>
      )}
    </View>
  );
}

/**
 * Extra bottom padding for scroll content so rows clear the floating footer.
 * Pass `theme.spacing[4]` as `additionalBottom` on web so it matches the footer’s bottom inset.
 */
export function getMessageFormListInsetBottom(safeBottom: number, additionalBottom = 0): number {
  return FOOTER_VERTICAL_PADDING * 2 + CONTROL_MIN_HEIGHT + safeBottom + additionalBottom;
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
  menuControl: {
    minHeight: CONTROL_MIN_HEIGHT,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[4],
    flexDirection: 'row',
    gap: theme.spacing[2],
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.inputBorder,
  },
  controlPressed: {
    opacity: 0.85,
  },
  controlLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
}));
