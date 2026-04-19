import type { PopupProps } from 'react-popup-manager';
import Ionicons from '@expo/vector-icons/Ionicons';
import { OverlaySheetModal } from 'components/ui/Modal';
import type { AppLocale } from 'lib/i18n/catalog';
import { useI18n } from 'hooks/i18n/I18nProvider';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export type LanguagePickerModalData = {
  currentLocale: AppLocale;
};

export type LanguagePickerModalResult =
  | undefined
  | null
  | { locale: AppLocale };

export type LanguagePickerModalProps = {
  data: LanguagePickerModalData;
} & PopupProps;

export function LanguagePickerModal({
  isOpen: _isOpen,
  onClose,
  data,
}: LanguagePickerModalProps) {
  const { theme } = useUnistyles();
  const { t } = useI18n();
  const { currentLocale } = data;

  return (
    <OverlaySheetModal<LanguagePickerModalResult>
      maxSheetHeight={360}
      onClose={onClose}
      sheetSize="intrinsic"
    >
      {({ finish }) => (
        <>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle} numberOfLines={1}>
              {t('settings.languagePicker.title')}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('a11y.close')}
              hitSlop={12}
              onPress={() => finish(null)}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
            >
              <Ionicons name="close" size={18} color={theme.colors.text} />
            </Pressable>
          </View>
          <View style={styles.options}>
            {(['en', 'uk'] as const).map((code) => {
              const selected = currentLocale === code;
              return (
                <Pressable
                  key={code}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => finish({ locale: code })}
                  style={({ pressed }) => [
                    styles.optionRow,
                    pressed && styles.optionRowPressed,
                    selected && styles.optionRowSelected,
                  ]}
                >
                  <Text style={styles.optionLabel}>{t(`language.name.${code}`)}</Text>
                  {selected ? (
                    <Ionicons
                      name="checkmark"
                      size={22}
                      color={theme.colors.primary}
                    />
                  ) : null}
                </Pressable>
              );
            })}
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
  options: {
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[4],
    gap: theme.spacing[2],
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  optionRowPressed: {
    opacity: 0.7,
  },
  optionRowSelected: {
    borderColor: theme.colors.primary,
  },
  optionLabel: {
    fontSize: 17,
    color: theme.colors.text,
  },
}));
