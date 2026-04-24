import { useQuery } from '@tanstack/react-query';
import { queryKeys } from 'lib/react-query/queryKeys';
import { accountService } from 'services';

export function useAccountList() {
  return useQuery({
    queryKey: queryKeys.accounts.all,
    queryFn: () => accountService.list(),
  });
}