import { useQuery } from '@tanstack/react-query';
import type { ThreadItemData } from 'components/thread/ThreadItem';
import { queryKeys } from 'lib/react-query/queryKeys';
import { threadService } from 'services';

export type UseThreadListArgs =
  | { accountId?: undefined }
  | {
      accountId: string;
    };

function toThreadItemData(thread: { id: string; title: string; accountId: string; url: string | null }) {
  const item: ThreadItemData = {
    id: thread.id,
    title: thread.title,
    accountId: thread.accountId,
    iconUrl: thread.url,
  };
  return item;
}

export function useThreadList(args?: UseThreadListArgs) {
  const accountId = args != null && 'accountId' in args ? args.accountId : undefined;

  return useQuery({
    queryKey: accountId ? queryKeys.threads.byAccount(accountId) : queryKeys.threads.all,
    queryFn: async () => {
      const threads = accountId
        ? await threadService.listByAccount(accountId)
        : await threadService.list();
      return threads.map(toThreadItemData);
    },
  });
}
