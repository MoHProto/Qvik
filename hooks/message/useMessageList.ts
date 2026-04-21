import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "lib/react-query/queryKeys";
import { messageService } from "services";

export function useMessageList(threadId: string | undefined | null) {
  return useQuery({
    queryKey: queryKeys.messages.byThread(threadId!),
    queryFn: () => messageService.listByThread(threadId!),
    enabled: !!threadId,
  });
}
