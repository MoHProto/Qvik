import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from 'lib/react-query/queryKeys';
import { accountService } from 'services';

export function useAccountSetActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { accountId: string }) => accountService.setActive(variables.accountId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    },
  });
}

