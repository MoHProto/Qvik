import {
  EmojiPickerModal,
  type EmojiPickerModalData,
} from 'components/emoji/EmojiPickerModal';
import { useCallback } from 'react';
import { usePopupManager } from 'react-popup-manager';

export type EmojiPickerModalResult = string | null | undefined;

export function useEmojiPickerModal() {
  const popupManager = usePopupManager();

  return useCallback(
    (params?: { data?: EmojiPickerModalData }) => {
      const { response } = popupManager.open(EmojiPickerModal, {
        data: params?.data,
      });
      return response as Promise<EmojiPickerModalResult>;
    },
    [popupManager],
  );
}
