import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import type { PopupProps } from 'react-popup-manager';

import { OverlaySheetModal } from 'components/ui/OverlaySheetModal';
import { useI18n } from 'hooks/i18n/I18nProvider';
import type { AccountItemData } from './AccountItem';
import { AccountList } from './AccountList';

const maxSheetHeight = Math.round(Dimensions.get('window').height * 0.78);

export type AccountSelectorModalData = {
  accounts: AccountItemData[];
  activeAccountId: string;
};

export type AccountSelectorModalResult =
  | undefined
  | null
  | { action: 'select'; accountId: string }
  /** Selector closed; caller should open create-account flow (e.g. `AccountFormModal`). */
  | { action: 'create' };

export type AccountSelectorModalOwnProps = {
  data: AccountSelectorModalData;
};

export type AccountSelectorModalProps = AccountSelectorModalOwnProps & PopupProps;

export function AccountSelectorModal({
  isOpen: _isOpen,
  onClose,
  data,
}: AccountSelectorModalProps) {
  const { accounts, activeAccountId } = data;
  const { theme } = useUnistyles();
  const { t } = useI18n();

  return (
    <OverlaySheetModal<AccountSelectorModalResult>
      maxSheetHeight={maxSheetHeight}
      onClose={onClose}
      sheetSize="intrinsic"
      header={t('accountSelector.title')}
    >
      {({ finish }) => (
        <>
          <View style={styles.listWrap}>
            <AccountList
              data={accounts}
              activeAccountId={activeAccountId}
              onItemPress={(item) => finish({ action: 'select', accountId: item.id })}
              emptyMessage={{
                icon: 'person-outline',
                message: t('accountSelector.empty'),
              }}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => finish({ action: 'create' })}
            style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
          >
            <Ionicons name="add-circle-outline" size={22} color={theme.colors.primary} />
            <Text style={styles.addLabel}>{t('accountSelector.addNew')}</Text>
          </Pressable>
        </>
      )}
    </OverlaySheetModal>
  );
}

const styles = StyleSheet.create((theme) => ({
  listWrap: {
    maxHeight: maxSheetHeight - 160,
    minHeight: 120,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
    paddingVertical: theme.spacing[4],
    marginHorizontal: theme.spacing[4],
    marginTop: theme.spacing[1],
  },
  addButtonPressed: {
    opacity: 0.55,
  },
  addLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.primary,
  },
}));
