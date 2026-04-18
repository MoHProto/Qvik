import { AccountSettings } from 'components/account/AccountSettings';
import { useAccountFormModal } from 'hooks/account/useAccountFormModal';
import { useAccountSelectorModal } from 'hooks/account/useAccountSelectorModal';
import { useExampleAccountSettings } from 'hooks/account/useExampleAccountSettings';
import { waitForPopupHandoff } from 'lib/waitForPopupHandoff';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export function AccountSettingsScreen() {
  const {
    accounts,
    activeAccountId,
    setActiveAccountId,
    addAccount,
    languageLabel,
    currentAccount,
  } = useExampleAccountSettings();
  const openAccountSelectorModal = useAccountSelectorModal();
  const openAccountFormModal = useAccountFormModal();

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
      await waitForPopupHandoff();
      const created = await openAccountFormModal({ data: {} });
      if (created !== undefined && created !== null) {
        addAccount(created);
      }
    })();
  }, [
    accounts,
    activeAccountId,
    addAccount,
    openAccountFormModal,
    openAccountSelectorModal,
    setActiveAccountId,
  ]);

  return (
    <View style={styles.fill}>
      <AccountSettings
        account={currentAccount}
        languageLabel={languageLabel}
        onAccountHeaderPress={openPicker}
        onLanguagePress={() => {}}
        onAccountSettingPress={openPicker}
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
