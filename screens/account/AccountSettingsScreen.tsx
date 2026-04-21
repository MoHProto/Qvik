import { AccountSettings } from 'components/account/AccountSettings';
import { useAccountAdd } from 'hooks/account/useAccountAdd';
import { useAccountFormModal } from 'hooks/account/useAccountFormModal';
import { useAccountSelectorModal } from 'hooks/account/useAccountSelectorModal';
import { useAccountSettings } from 'hooks/account/useAccountSettings';
import { useI18n } from 'hooks/i18n/I18nProvider';
import { useLanguagePickerModal } from 'hooks/i18n/useLanguagePickerModal';
import { usePlainClient } from 'hooks/plain/usePlainClient';
import { useThreadOne } from 'hooks/thread/useThreadOne';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { createPrefilledNewAccountFormData } from 'utils/account/createPrefilledNewAccountFormData';

export function AccountSettingsScreen() {
  const {
    accounts,
    activeAccountId,
    setActiveAccountId,
    updateAccount,
    languageLabel,
    currentAccount,
  } = useAccountSettings();
  const { mutateAsync: createAccount } = useAccountAdd();
  const { locale, setLocale } = useI18n();
  const openAccountSelectorModal = useAccountSelectorModal();
  const openAccountFormModal = useAccountFormModal();
  const openLanguagePickerModal = useLanguagePickerModal();
  const { data: thread } = useThreadOne(currentAccount?.id);
  const plainClient = usePlainClient(thread?.url);
  
  const onLanguagePress = useCallback(async () => {
    const result = await openLanguagePickerModal({
      data: { currentLocale: locale },
    });

    if (result) {
      setLocale(result.locale);
    }
  }, [locale, openLanguagePickerModal, setLocale]);

  const openPicker = useCallback(async () => {
    const selectorResult = await openAccountSelectorModal({
      data: { accounts, activeAccountId },
    });
    if (!selectorResult) {
      return;
    }
    if (selectorResult.action === 'select') {
      setActiveAccountId(selectorResult.accountId);
      return;
    }
    const created = await openAccountFormModal({
      data: {
        initialAccount: createPrefilledNewAccountFormData(locale),
        showSuccessToast: false,
      },
    });
    if (created) {
      const row = await createAccount({ name: created.name.trim() });
      setActiveAccountId(row.id);
    }
  }, [
    accounts,
    activeAccountId,
    createAccount,
    locale,
    openAccountFormModal,
    openAccountSelectorModal,
    setActiveAccountId,
  ]);

  const onAccountSettingPress = useCallback(async () => {
    const saved = await openAccountFormModal({
      data: { initialAccount: currentAccount },
    });
    if (saved) {
      updateAccount(saved);
    }
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
