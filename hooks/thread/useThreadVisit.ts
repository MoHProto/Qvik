import { useMutation } from "@tanstack/react-query";
import { useAccountOne } from "hooks/account/useAccountOne";
import { useI18n } from "hooks/i18n/I18nProvider";
import { useMessageCreate } from "hooks/message/useMessageCreate";
import { useMessageUpdate } from "hooks/message/useMessageUpdate";
import { useNotifyToast } from "hooks/notify/useNotifyToast";
import { createPlainClient, usePlainClient } from "hooks/plain/usePlainClient";
import { Alert } from "react-native";
import { MessageStatus } from "types/message";
import { formatErrorMessage } from "utils/errors";
import { useThreadOne } from "./useThreadOne";
import { useThreadUpdate } from "./useThreadUpdate";

async function confirmAuthorizeWebsite(params: {
  title: string;
  message: string;
  cancelLabel: string;
  confirmLabel: string;
}): Promise<boolean> {
  return await new Promise((resolve) => {
    Alert.alert(params.title, params.message, [
      {
        text: params.cancelLabel,
        style: "cancel",
        onPress: () => resolve(false),
      },
      {
        text: params.confirmLabel,
        style: "default",
        onPress: () => resolve(true),
      },
    ]);
  });
}

export function useThreadVisit(threadId: string | null | undefined) {
  const { data: thread } = useThreadOne(threadId);
  const { data: account } = useAccountOne(thread?.accountId);
  const plainClient = usePlainClient(
    thread?.url,
    thread?.isAuthorized ? account?.privateKey : null,
  );
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

        if (response.status === "unauthorized") {
          const ok = await confirmAuthorizeWebsite({
            title: t("thread.authorize.title"),
            message: t("thread.authorize.message"),
            cancelLabel: t("common.cancel"),
            confirmLabel: t("thread.authorize.confirm"),
          });

          if (ok) {
            await updateThread({ id: thread.id, isAuthorized: true });

            const signedClient = createPlainClient(
              thread.url,
              account?.privateKey ?? null,
            );

            console.log("signedClient", signedClient);

            const signedResponse = await signedClient.request({
              path: variables.path,
            });

            const signedMetadata = signedResponse.metadata ?? {};
            const signedTitle =
              typeof signedMetadata.title === "string" &&
              signedMetadata.title.trim().length > 0
                ? signedMetadata.title
                : undefined;
            const signedDescription =
              typeof signedMetadata.description === "string"
                ? signedMetadata.description
                : undefined;

            await updateThread({
              id: thread.id,
              title: signedTitle,
              description: signedDescription,
              menu: signedResponse.menu,
            });

            await updateMessage({
              id: pending.id,
              status: signedResponse.status as MessageStatus,
              body: signedResponse.body ?? t("error.unknown"),
              buttons: signedResponse.buttons,
            });

            return signedResponse;
          }
        }

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
