import { AccountSettings } from 'components/account/AccountSettings';
import { useAccountFormModal } from 'hooks/account/useAccountFormModal';
import { useAccountSelectorModal } from 'hooks/account/useAccountSelectorModal';
import { useExampleAccountSettings } from 'hooks/account/useExampleAccountSettings';
import { useI18n } from 'hooks/i18n/I18nProvider';
import { useLanguagePickerModal } from 'hooks/i18n/useLanguagePickerModal';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { createPrefilledNewAccountFormData } from 'utils/account/createPrefilledNewAccountFormData';

export function AccountSettingsScreen() {
  const {
    accounts,
    activeAccountId,
    setActiveAccountId,
    addAccount,
    updateAccount,
    languageLabel,
    currentAccount,
  } = useExampleAccountSettings();
  const { locale, setLocale } = useI18n();
  const openAccountSelectorModal = useAccountSelectorModal();
  const openAccountFormModal = useAccountFormModal();
  const openLanguagePickerModal = useLanguagePickerModal();

  const onLanguagePress = useCallback(() => {
    void (async () => {
      const result = await openLanguagePickerModal({
        data: { currentLocale: locale },
      });
      if (result !== undefined && result !== null) {
        setLocale(result.locale);
      }
    })();
  }, [locale, openLanguagePickerModal, setLocale]);

  const openPicker = useCallback(() => {
    void (async () => {
      const selectorResult = await openAccountSelectorModal({
        data: { accounts, activeAccountId },
      });
      if (selectorResult === undefined || selectorResult === null) {
        return;
      }
      if (selectorResult.action === 'select') {
        setActiveAccountId(selectorResult.accountId);
        return;
      }
      const created = await openAccountFormModal({
        data: { initialAccount: createPrefilledNewAccountFormData(locale) },
      });
      if (created !== undefined && created !== null) {
        addAccount(created);
      }
    })();
  }, [
    accounts,
    activeAccountId,
    locale,
    addAccount,
    openAccountFormModal,
    openAccountSelectorModal,
    setActiveAccountId,
  ]);

  const onAccountSettingPress = useCallback(() => {
    void (async () => {
      const saved = await openAccountFormModal({
        data: { initialAccount: currentAccount },
      });
      if (saved !== undefined && saved !== null) {
        updateAccount(saved);
      }
    })();
  }, [currentAccount, openAccountFormModal, updateAccount]);

  return (
    <View style={styles.fill}>
      <AccountSettings
        account={currentAccount}
        languageLabel={languageLabel}
        onAccountHeaderPress={openPicker}
        onLanguagePress={onLanguagePress}
        onAccountSettingPress={onAccountSettingPress}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  fill: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));
