import Ionicons from '@expo/vector-icons/Ionicons';
import {
  emojiData,
  EmojiPicker as LibraryEmojiPicker,
  type EmojiData,
  type PartialTheme,
} from '@hiraku-ai/react-native-emoji-picker';
import { OverlaySheetModal } from 'components/ui/OverlaySheetModal';
import React, { useMemo } from 'react';
import { Dimensions, Pressable, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import type { PopupProps } from 'react-popup-manager';

const maxSheetHeight = Math.round(Dimensions.get('window').height * 0.78);

export type EmojiPickerModalData = {
  title?: string;
};

export type EmojiPickerModalOwnProps = {
  data?: EmojiPickerModalData;
};

export type EmojiPickerModalProps = EmojiPickerModalOwnProps & PopupProps;

const EMOJIS = emojiData as EmojiData[];

function colorString(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback;
}

export function EmojiPickerModal({ isOpen: _isOpen, onClose, data }: EmojiPickerModalProps) {
  const title = data?.title ?? 'Choose emoji';
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();
  const colorScheme = useColorScheme();
  const darkMode = colorScheme === 'dark';

  const pickerTheme = useMemo<PartialTheme>(
    () => ({
      colors: {
        background: theme.colors.surface,
        backgroundSecondary: theme.colors.background,
        searchBackground: theme.colors.incomingBubble,
        tabBackground: theme.colors.surface,
        tabActiveBackground: theme.colors.incomingBubble,
        emojiButtonBackground: 'transparent',
        text: theme.colors.text,
        textSecondary: theme.colors.muted,
        textTertiary: theme.colors.muted,
        categoryTitle: theme.colors.muted,
        placeholder: theme.colors.muted,
        noResults: theme.colors.muted,
        border: theme.colors.border,
        borderLight: theme.colors.border,
        tabsBorder: theme.colors.border,
        categoryDivider: theme.colors.border,
        accent: colorString(theme.colors.primary, '#007AFF'),
        accentSecondary: colorString(theme.colors.primary, '#007AFF'),
        icon: theme.colors.muted,
        iconActive: colorString(theme.colors.primary, '#007AFF'),
        headerTitle: theme.colors.text,
        skinToneButtonBorder: theme.colors.border,
        modalBackground: theme.colors.surface,
        headerBackground: theme.colors.surface,
        headerBorder: theme.colors.border,
        closeIcon: theme.colors.text,
        modalOverlay: 'rgba(0,0,0,0.45)',
      },
    }),
    [theme],
  );

  const bottomPad = Math.max(insets.bottom, theme.spacing[4]);
  const headerBlock = theme.spacing[3] * 2 + 24;
  const pickerMinHeight = maxSheetHeight - headerBlock - bottomPad;

  return (
    <OverlaySheetModal<string | null | undefined>
      maxSheetHeight={maxSheetHeight}
      onClose={onClose}
      sheetSize="fill"
    >
      {({ finish }) => (
        <>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle} numberOfLines={1}>
              {title}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={12}
              onPress={() => finish(null)}
              style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
            >
              <Ionicons name="close" size={18} color={theme.colors.text} />
            </Pressable>
          </View>

          <View style={[styles.pickerHost, { minHeight: pickerMinHeight }]}>
            <LibraryEmojiPicker
              emojis={EMOJIS}
              onEmojiSelect={(emoji) => finish(emoji)}
              darkMode={darkMode}
              theme={pickerTheme}
              columns={8}
              showSearchBar
              showTabs
              showHistoryTab
              showSkinToneSelector
              searchMinChars={1}
              searchPlaceholder="Search emoji"
              containerStyle={styles.pickerFlex}
            />
          </View>
        </>
      )}
    </OverlaySheetModal>
  );
}

const styles = StyleSheet.create((theme) => ({
  sheetHeader: {
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[3],
    paddingBottom: theme.spacing[2],
    backgroundColor: theme.colors.surface,
  },
  sheetTitle: {
    flex: 1,
    minWidth: 0,
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'left',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.incomingBubble,
  },
  closeButtonPressed: {
    opacity: 0.65,
  },
  pickerHost: {
    flex: 1,
    minHeight: 0,
  },
  pickerFlex: {
    flex: 1,
  },
}));
