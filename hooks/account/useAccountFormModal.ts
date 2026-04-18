import {
  AccountFormModal,
  type AccountFormModalData,
} from 'components/account/AccountFormModal';
import type { Account } from 'components/account/AccountItem';
import { useCallback } from 'react';
import { usePopupManager } from 'react-popup-manager';

export type AccountFormModalResult = Account | null | undefined;

export function useAccountFormModal() {
  const popupManager = usePopupManager();

  return useCallback(
    (params: { data?: AccountFormModalData }) => {
      const { response } = popupManager.open(AccountFormModal, {
        data: params.data,
      });
      return response as Promise<AccountFormModalResult>;
    },
    [popupManager],
  );
}
