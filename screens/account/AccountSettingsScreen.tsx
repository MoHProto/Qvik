import { AccountSettings } from 'components/account/AccountSettings';
import { useAccountSelectorPopup } from 'hooks/account/useAccountSelectorPopup';
import { useExampleAccountSettings } from 'hooks/account/useExampleAccountSettings';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export function AccountSettingsScreen() {
  const {
    accounts,
    activeAccountId,
    setActiveAccountId,
    languageLabel,
    currentAccount,
  } = useExampleAccountSettings();
  const openAccountSelector = useAccountSelectorPopup();

  const openPicker = useCallback(() => {
    openAccountSelector({
      accounts,
      activeAccountId,
      onSelectAccount: (id) => {
        setActiveAccountId(id);
      },
      onAddAccount: () => {
        // Example: wire to add-account flow when available.
      },
    });
  }, [accounts, activeAccountId, openAccountSelector, setActiveAccountId]);

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
    backgroundColor: theme.colors.groupedListBackground,
  },
}));
