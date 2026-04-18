import type { PopupProps } from 'react-popup-manager';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { OverlaySheetModal } from 'components/ui/Modal';
import { AccountList } from './AccountList';
import type { AccountItemData } from './AccountItem';

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

export type AccountSelectorModalProps = AccountSelectorModalOwnProps &
  PopupProps;

export function AccountSelectorModal({
  isOpen: _isOpen,
  onClose,
  data,
}: AccountSelectorModalProps) {
  const { accounts, activeAccountId } = data;
  const { theme } = useUnistyles();

  return (
    <OverlaySheetModal<AccountSelectorModalResult>
      maxSheetHeight={maxSheetHeight}
      onClose={onClose}
      sheetSize="intrinsic"
    >
      {({ finish }) => (
        <>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle} numberOfLines={1}>
              Accounts
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={12}
              onPress={() => finish(null)}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
            >
              <Ionicons
                name="close"
                size={18}
                color={theme.colors.text}
              />
            </Pressable>
          </View>
          <View style={styles.listWrap}>
            <AccountList
              data={accounts}
              activeAccountId={activeAccountId}
              onItemPress={(item) =>
                finish({ action: 'select', accountId: item.id })
              }
              emptyMessage={{
                icon: 'person-outline',
                message: 'No accounts yet.',
              }}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => finish({ action: 'create' })}
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.addButtonPressed,
            ]}
          >
            <Ionicons
              name="add-circle-outline"
              size={22}
              color={theme.colors.primary}
            />
            <Text style={styles.addLabel}>Add new account</Text>
          </Pressable>
        </>
      )}
    </OverlaySheetModal>
  );
}

const styles = StyleSheet.create((theme) => ({
  sheetHeader: {
    zIndex: 2,
    elevation: 16,
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
