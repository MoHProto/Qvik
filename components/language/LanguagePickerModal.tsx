import Ionicons from '@expo/vector-icons/Ionicons';
import { OverlaySheetModal } from 'components/ui/OverlaySheetModal';
import { useI18n } from 'hooks/i18n/I18nProvider';
import { APP_LOCALES, type AppLocale } from 'lib/i18n/locales';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import type { PopupProps } from 'react-popup-manager';

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
      header={t('settings.languagePicker.title')}
    >
      {({ finish }) => (
        <>
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
