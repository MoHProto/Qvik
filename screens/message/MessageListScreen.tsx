import { HeaderBackButton } from "@react-navigation/elements";
import type { NativeStackHeaderBackProps } from "@react-navigation/native-stack";
import {
  getMessageFormListInsetBottom,
  MessageForm,
} from "components/message/MessageForm";
import { MessageItemData } from "components/message/messageItemShared";
import { MessageList } from "components/message/MessageList";
import { ThreadTitleButton } from "components/thread/ThreadTitleButton";
import type { MenuItem } from "components/ui/MenuModal";
import type { Href } from "expo-router";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useI18n } from "hooks/i18n/I18nProvider";
import { useMessageList } from "hooks/message/useMessageList";
import { useThreadOne } from "hooks/thread/useThreadOne";
import { useThreadVisit } from "hooks/thread/useThreadVisit";
import { Message } from "models";
import React, { useCallback, useLayoutEffect, useMemo } from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

function buildMessageItemData(message: Message): MessageItemData {
  return {
    id: message.id,
    threadId: message.threadId,
    status: message.status,
    body: message.body,
    timestamp: message.timestamp,
    isOutgoing: message.isOutgoing,
    buttons: message.buttons,
  };
}

export default function MessageListScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();
  const { t } = useI18n();
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const { data: thread } = useThreadOne(threadId);
  const { data: messages = [] } = useMessageList(threadId);
  const {
    mutateAsync: visitThread,
    isPending: visitInFlight,
  } = useThreadVisit(threadId);

  const replyComposer = useMemo(() => {
    if (messages.length === 0) {
      return null;
    }
    let i = messages.length - 1;
    while (i >= 0 && messages[i].isOutgoing) {
      i--;
    }
    if (i < 0) {
      return null;
    }
    const incoming = messages[i];
    if (incoming.status !== "input") {
      return null;
    }
    const path =
      typeof incoming.path === "string" ? incoming.path.trim() : "";
    if (!path) {
      return null;
    }
    return { path, key: incoming.id };
  }, [messages]);

  const listBottomInset = useMemo(
    () =>
      getMessageFormListInsetBottom(
        insets.bottom,
        Platform.OS === "web" ? theme.spacing[4] : 0,
      ),
    [insets.bottom, theme.spacing],
  );

  const handleStartPress = useCallback(() => {
    visitThread({ path: "/", body: t("messageList.startPress") });
  }, [visitThread, t]);

  const handleMenuItemPress = useCallback(
    (item: MenuItem) => {
      visitThread({ path: item.url, body: item.label });
    },
    [visitThread],
  );

  const handleVisitButton = useCallback(
    (button: { label: string; url: string }) => {
      visitThread({ path: button.url, body: button.label });
    },
    [visitThread],
  );

  const replyPath = replyComposer?.path;
  const replyComposerKey = replyComposer?.key;

  const handleSendReply = useCallback(
    async (text: string) => {
      if (!replyPath) {
        return;
      }
      await visitThread({
        path: replyPath,
        body: text,
        queryInput: text,
      });
    },
    [visitThread, replyPath],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "center",
      headerBackVisible: false,
      headerLeft: (props: NativeStackHeaderBackProps) =>
        props.canGoBack ? (
          <HeaderBackButton
            {...props}
            labelStyle={
              Platform.OS === "ios"
                ? { letterSpacing: 0, fontWeight: "500" }
                : undefined
            }
            onPress={() => router.back()}
          />
        ) : null,
      headerTitle: () =>
        thread ? (
          <View pointerEvents="box-none" style={{ alignItems: "center" }}>
            <ThreadTitleButton
              data={thread}
              onPress={() => router.push(`/threads/${thread.id}` as Href)}
            />
          </View>
        ) : null,
    });
  }, [navigation, router, thread]);

  return (
    <View style={styles.screen}>
      <MessageList
        key={threadId ?? "messages"}
        data={messages.map((message) => buildMessageItemData(message))}
        contentPaddingBottom={listBottomInset}
        onVisit={handleVisitButton}
        emptyMessage={{
          icon: "chatbubbles-outline",
          message: t("messageList.empty"),
        }}
      />
      <MessageForm
        onStartPress={handleStartPress}
        showMenuButton={messages.length > 0}
        menu={thread?.menu ?? []}
        onMenuItemPress={handleMenuItemPress}
        replyPath={replyPath}
        replyComposerKey={replyComposerKey}
        onSendReply={handleSendReply}
        visitInFlight={visitInFlight}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.backgroundAlt,
  },
}));
