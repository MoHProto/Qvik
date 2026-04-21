import { useMutation } from "@tanstack/react-query";
import { queryClient } from "lib/react-query/queryClient";
import { queryKeys } from "lib/react-query/queryKeys";
import { messageService } from "services";
import { MessageUpdateParams } from "services/MessageService";

export function useMessageUpdate() {
  return useMutation({
    mutationFn: async (params: MessageUpdateParams) => {
      return messageService.update(params);
    },
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.byThread(message.threadId) });
    },
  });
}
