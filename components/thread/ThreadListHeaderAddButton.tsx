import Ionicons from '@expo/vector-icons/Ionicons';
import { useI18n } from 'hooks/i18n/I18nProvider';
import React from 'react';
import { Pressable } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export type ThreadListHeaderAddButtonProps = {
  onPress: () => void;
  disabled?: boolean;
};

export function ThreadListHeaderAddButton({ onPress, disabled }: ThreadListHeaderAddButtonProps) {
  const { theme } = useUnistyles();
  const { t } = useI18n();
  return (
    <Pressable
      accessibilityLabel={t('threads.header.addA11y')}
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      hitSlop={12}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.headerButton,
        pressed && !disabled && styles.headerButtonPressed,
        disabled && styles.headerButtonDisabled,
      ]}
    >
      <Ionicons name="add" size={24} color={theme.colors.text} style={styles.headerIcon} />
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  headerButton: {
    height: 44,
    paddingHorizontal: theme.spacing[2],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonPressed: {
    opacity: 0.5,
  },
  headerButtonDisabled: {
    opacity: 0.35,
  },
  headerIcon: {
    transform: [{ translateY: -4 }],
  },
}));
