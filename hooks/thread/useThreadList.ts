import { useQuery } from '@tanstack/react-query';
import type { ThreadItemData } from 'components/thread/ThreadItem';
import { queryKeys } from 'lib/react-query/queryKeys';
import { Thread } from 'models';
import { threadService } from 'services';
import { baseUrlFromUrl } from 'utils/url/normalizeUrl';

export type UseThreadListArgs =
  | { accountId?: undefined }
  | {
      accountId: string;
    };

function toThreadItemData(thread: Thread) {
  const item: ThreadItemData = {
    id: thread.id,
    title: thread.title,
    accountId: thread.accountId,
    url: baseUrlFromUrl(thread.url),
    description: thread.description,
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
      return threads.map((thread) => toThreadItemData(thread));
    },
  });
}
