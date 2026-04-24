import { useQuery } from '@tanstack/react-query';

import { queryKeys } from 'lib/react-query/queryKeys';
import { accountService } from 'services';

export function useAccountOne(id: string | null | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.accounts.detail(id) : ['accounts', 'null'],
    queryFn: () => (id ? accountService.findById(id) : null),
    enabled: !!id,
  });
}

