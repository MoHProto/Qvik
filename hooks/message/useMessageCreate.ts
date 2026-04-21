import { useMutation } from "@tanstack/react-query";
import { useNotifyToast } from "hooks/notify/useNotifyToast";
import { queryClient } from "lib/react-query/queryClient";
import { queryKeys } from "lib/react-query/queryKeys";
import { messageService } from "services";
import { MessageCreateParams } from "services/MessageService";
import { formatErrorMessage } from "utils/errors";

export function useMessageCreate() {
  const notify = useNotifyToast();

  return useMutation({
    mutationFn: (params: MessageCreateParams) => {
      return messageService.create(params);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.byThread(data.threadId) });
    },
    onError: (error) => {
      notify.error(formatErrorMessage(error));
    },
  });
}
