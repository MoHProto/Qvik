import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'lib/react-query/queryClient';
import { queryKeys } from 'lib/react-query/queryKeys';
import { threadService } from 'services';
import type { ThreadUpdateParams } from 'services/ThreadService';

export function useThreadUpdate() {
  return useMutation({
    mutationFn: async (params: ThreadUpdateParams) => {
      return threadService.update(params);
    },
    onSuccess: (thread) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.threads.byAccount(thread.accountId) });
      queryClient.invalidateQueries({ queryKey: ['threadOne'] });
    },
  });
}

