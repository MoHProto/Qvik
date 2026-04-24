import { useMutation } from "@tanstack/react-query";
import { useI18n } from "hooks/i18n/I18nProvider";
import { useMessageCreate } from "hooks/message/useMessageCreate";
import { useMessageUpdate } from "hooks/message/useMessageUpdate";
import { useNotifyToast } from "hooks/notify/useNotifyToast";
import { usePlainClient } from "hooks/plain/usePlainClient";
import { MessageStatus } from "types/message";
import { formatErrorMessage } from "utils/errors";
import { useThreadOne } from "./useThreadOne";
import { useThreadUpdate } from "./useThreadUpdate";

export function useThreadVisit(threadId: string | null | undefined) {
  const { data: thread } = useThreadOne(threadId);
  const plainClient = usePlainClient(thread?.url);
  const notify = useNotifyToast();
  const { t } = useI18n();
  const { mutateAsync: updateMessage } = useMessageUpdate();
  const { mutateAsync: createMessage } = useMessageCreate();
  const { mutateAsync: updateThread } = useThreadUpdate();

  return useMutation({
    mutationFn: async (variables: { path: string; body?: string }) => {
      if (!thread) {
        throw new Error("Thread not found");
      }

      const pathText = variables.body ?? variables.path;

      await createMessage({
        threadId: thread.id,
        body: pathText,
        status: "input",
        isOutgoing: true,
      });

      const pending = await createMessage({
        threadId: thread.id,
        body: "",
        status: "pending",
        isOutgoing: false,
      });

      try {
        const response = await plainClient.request({
          path: variables.path,
        });

        const metadata = response.metadata ?? {};
        const title =
          typeof metadata.title === "string" && metadata.title.trim().length > 0
            ? metadata.title
            : undefined;
        const description =
          typeof metadata.description === "string"
            ? metadata.description
            : undefined;

        await updateThread({
          id: thread.id,
          title,
          description,
          menu: response.menu,
        });

        await updateMessage({
          id: pending.id,
          status: response.status as MessageStatus,
          body: response.body ?? t("error.unknown"),
          buttons: response.buttons,
        });

        return response;
      } catch (error) {
        await updateMessage({
          id: pending.id,
          status: "error",
          body: formatErrorMessage(error),
        });
        throw error;
      }
    },
    onError: (error: unknown) => {
      notify.error(
        formatErrorMessage(
          error instanceof Error ? error : new Error(String(error)),
        ),
      );
    },
  });
}
