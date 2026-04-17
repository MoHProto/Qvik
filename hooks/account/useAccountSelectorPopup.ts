import {
  AccountSelectorModal,
  type AccountSelectorModalOwnProps,
} from 'components/account/AccountSelectorModal';
import { useCallback } from 'react';
import { usePopupManager } from 'react-popup-manager';

export function useAccountSelectorPopup() {
  const popupManager = usePopupManager();

  return useCallback(
    (params: AccountSelectorModalOwnProps) => {
      popupManager.open(AccountSelectorModal, params);
    },
    [popupManager],
  );
}
