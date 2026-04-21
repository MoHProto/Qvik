import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccountActive } from 'hooks/account/useAccountActive';
import { useI18n } from 'hooks/i18n/I18nProvider';
import { useNotifyToast } from 'hooks/notify/useNotifyToast';
import { queryKeys } from 'lib/react-query/queryKeys';
import { useCallback } from 'react';
import { threadService } from 'services';
import { formatErrorMessage } from 'utils/errors';
import { baseUrlFromUrl, titleFromUrl } from 'utils/url/normalizeUrl';
import { useThreadUrlModal } from './useThreadUrlModal';

export function useThreadCreate() {
  const accountActive = useAccountActive();
  const openThreadUrlModal = useThreadUrlModal();
  const queryClient = useQueryClient();
  const notify = useNotifyToast();
  const { t } = useI18n();

  const { mutate, isPending } = useMutation({
    mutationFn: async (variables: { url: string }) => {
      if (!accountActive) {
        throw new Error(t('threads.add.noAccount.message'));
      }
      const accountId = accountActive.id;
      const title = titleFromUrl(baseUrlFromUrl(variables.url));
      return threadService.create({ accountId, title, url: variables.url });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.threads.all });
      notify.success(t('threads.add.success.title'), t('threads.add.success.message'));
    },
    onError: (error) => {
      notify.error(
        t('threads.add.error.title'),
        formatErrorMessage(error, t('threads.add.error.message')),
      );
    },
  });

  const addThreadFromUrl = useCallback(async () => {
    const result = await openThreadUrlModal({ data: {} });
    if (result === undefined || result === null) return;
    mutate({ url: result.url });
  }, [mutate, openThreadUrlModal]);

  return {
    addThreadFromUrl,
    isAddingThread: isPending,
  };
}
