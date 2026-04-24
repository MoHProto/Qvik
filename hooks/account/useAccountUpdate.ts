import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from 'lib/react-query/queryKeys';
import { accountService } from 'services';

export function useAccountUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { id: string; name: string }) => accountService.update(variables),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    },
  });
}

