import type { PopupProps } from 'react-popup-manager';
import Ionicons from '@expo/vector-icons/Ionicons';
import { OverlaySheetModal } from 'components/ui/Modal';
import { APP_LOCALES, type AppLocale } from 'lib/i18n/locales';
import { useI18n } from 'hooks/i18n/I18nProvider';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export type LanguagePickerModalData = {
  currentLocale: AppLocale;
};

export type LanguagePickerModalResult = undefined | null | { locale: AppLocale };

export type LanguagePickerModalProps = {
  data: LanguagePickerModalData;
} & PopupProps;

export function LanguagePickerModal({ isOpen: _isOpen, onClose, data }: LanguagePickerModalProps) {
  const { theme } = useUnistyles();
  const { t } = useI18n();
  const { currentLocale } = data;

  return (
    <OverlaySheetModal<LanguagePickerModalResult>
      maxSheetHeight={580}
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
              style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
            >
              <Ionicons name="close" size={18} color={theme.colors.text} />
            </Pressable>
          </View>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.listWrap}
            bounces={false}
            showsVerticalScrollIndicator
          >
            {APP_LOCALES.map((code, index) => {
              const selected = currentLocale === code;
              return (
                <React.Fragment key={code}>
                  {index > 0 ? <View style={styles.separator} /> : null}
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => finish({ locale: code })}
                    style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
                  >
                    <Text style={styles.rowLabel} numberOfLines={1}>
                      {t(`language.name.${code}`)}
                    </Text>
                    {selected ? (
                      <Ionicons
                        name="checkmark"
                        size={22}
                        color={theme.colors.primary}
                        style={styles.trailingIcon}
                      />
                    ) : null}
                  </Pressable>
                </React.Fragment>
              );
            })}
          </ScrollView>
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
    paddingBottom: theme.spacing[3],
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
  scroll: {
    maxHeight: 520,
  },
  listWrap: {
    paddingBottom: theme.spacing[4],
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border,
    marginLeft: theme.spacing[4],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    minHeight: 56,
  },
  rowPressed: {
    opacity: 0.65,
  },
  rowLabel: {
    flex: 1,
    minWidth: 0,
    fontSize: 17,
    fontWeight: '400',
    color: theme.colors.text,
  },
  trailingIcon: {
    marginLeft: theme.spacing[1],
  },
}));
