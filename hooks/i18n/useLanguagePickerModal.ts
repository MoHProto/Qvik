import {
  LanguagePickerModal,
  type LanguagePickerModalData,
  type LanguagePickerModalResult,
} from 'components/language/LanguagePickerModal';
import { useCallback } from 'react';
import { usePopupManager } from 'react-popup-manager';

export type { LanguagePickerModalResult };

export function useLanguagePickerModal() {
  const popupManager = usePopupManager();

  return useCallback(
    (params: { data: LanguagePickerModalData }) => {
      const { response } = popupManager.open(LanguagePickerModal, {
        data: params.data,
      });
      return response as Promise<LanguagePickerModalResult>;
    },
    [popupManager],
  );
}
