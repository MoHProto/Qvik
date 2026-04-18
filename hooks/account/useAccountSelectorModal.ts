import {
  AccountSelectorModal,
  type AccountSelectorModalData,
  type AccountSelectorModalResult,
} from 'components/account/AccountSelectorModal';
import { useCallback } from 'react';
import { usePopupManager } from 'react-popup-manager';

export type { AccountSelectorModalResult };

export function useAccountSelectorModal() {
  const popupManager = usePopupManager();

  return useCallback(
    (params: { data: AccountSelectorModalData }) => {
      const { response } = popupManager.open(AccountSelectorModal, {
        data: params.data,
      });
      return response as Promise<AccountSelectorModalResult>;
    },
    [popupManager],
  );
}
