import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useI18n } from 'hooks/i18n/I18nProvider';
import { useNotifyToast } from 'hooks/notify/useNotifyToast';
import { queryKeys } from 'lib/react-query/queryKeys';
import { accountService } from 'services';
import { formatErrorMessage } from 'utils/errors';

export function useAccountAdd() {
  const queryClient = useQueryClient();
  const notify = useNotifyToast();
  const { t } = useI18n();

  return useMutation({
    mutationFn: (variables: { name: string }) => accountService.create(variables),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
      const label = variables.name.trim();
      notify.success(
        t('account.add.success.title'),
        label.length > 0 ? label : t('account.add.success.message'),
      );
    },
    onError: (error) => {
      notify.error(
        t('account.add.error.title'),
        formatErrorMessage(error, t('account.add.error.message')),
      );
    },
  });
}
