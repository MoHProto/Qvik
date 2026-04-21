import {
  ThreadUrlModal,
  type ThreadUrlModalData,
  type ThreadUrlModalResult,
} from 'components/thread/ThreadUrlModal';
import { useCallback } from 'react';
import { usePopupManager } from 'react-popup-manager';

export type { ThreadUrlModalResult };

export function useThreadUrlModal() {
  const popupManager = usePopupManager();

  return useCallback(
    (params?: { data?: ThreadUrlModalData }) => {
      const { response } = popupManager.open(ThreadUrlModal, {
        data: params?.data ?? {},
      });
      return response as Promise<ThreadUrlModalResult>;
    },
    [popupManager],
  );
}
