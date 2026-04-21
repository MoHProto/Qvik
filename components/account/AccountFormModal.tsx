import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useMemo } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import type { PopupProps } from 'react-popup-manager';

import { OverlaySheetModal } from 'components/ui/OverlaySheetModal';
import { useI18n } from 'hooks/i18n/I18nProvider';
import { useNotifyToast } from 'hooks/notify/useNotifyToast';
import { DEFAULT_ACCOUNT_AVATAR_EMOJI } from 'utils/account/accountAvatarEmojis';
import { AccountForm } from './AccountForm';
import type { Account } from './AccountItem';

const maxSheetHeight = Math.round(Dimensions.get('window').height * 0.88);

const SHEET_CHROME_VERTICAL = 120;

export type AccountFormModalData = {
  initialAccount?: Partial<Account>;
  showSuccessToast?: boolean;
};

export type AccountFormModalOwnProps = {
  data?: AccountFormModalData;
};

export type AccountFormModalProps = AccountFormModalOwnProps & PopupProps;

const emptyAccount: Account = {
  id: '',
  name: '',
  avatarUrl: null,
};

function mergeInitial(initial?: Partial<Account>): Account {
  return {
    ...emptyAccount,
    ...initial,
    id: initial?.id != null && String(initial.id).trim() !== '' ? String(initial.id).trim() : '',
    avatarUrl: initial?.avatarUrl ?? null,
    avatarIcon: initial?.avatarIcon ?? DEFAULT_ACCOUNT_AVATAR_EMOJI,
  };
}

type AccountFormModalBodyProps = {
  finish: (result: Account | null | undefined) => void;
  formData: Account;
  showSuccessToast: boolean;
};

const AccountFormModalBody = React.memo(function AccountFormModalBody({
  finish,
  formData,
  showSuccessToast,
}: AccountFormModalBodyProps) {
  const { theme } = useUnistyles();
  const notify = useNotifyToast();
  const { t } = useI18n();

  const handleFormSubmit = useCallback(
    (values: Account) => {
      const id =
        values.id != null && String(values.id).trim().length > 0
          ? values.id.trim()
          : `acc-${Date.now()}`;
      const account = { ...values, id };
      const label = values.name.trim();
      if (showSuccessToast) {
        notify.success(t('account.toast.savedTitle'), label.length > 0 ? label : undefined);
      }
      finish(account);
    },
    [finish, notify, showSuccessToast, t],
  );

  const formMaxHeight = Math.max(200, maxSheetHeight - SHEET_CHROME_VERTICAL);

  return (
    <>
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle} numberOfLines={1}>
          {t('accountForm.title')}
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

      <View style={[styles.formHost, { maxHeight: formMaxHeight }]}>
        <AccountForm data={formData} onSubmit={handleFormSubmit} centeredText />
      </View>
    </>
  );
});

export function AccountFormModal({ isOpen: _isOpen, onClose, data }: AccountFormModalProps) {
  const formData = useMemo(() => mergeInitial(data?.initialAccount), [data?.initialAccount]);
  const showSuccessToast = data?.showSuccessToast !== false;

  return (
    <OverlaySheetModal<Account | null | undefined>
      maxSheetHeight={maxSheetHeight}
      keyboardAvoiding
      onClose={onClose}
      sheetSize="intrinsic"
    >
      {({ finish }) => (
        <AccountFormModalBody finish={finish} formData={formData} showSuccessToast={showSuccessToast} />
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
  formHost: {
    minHeight: 0,
    flexShrink: 1,
  },
}));
