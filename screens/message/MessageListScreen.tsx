import {
  getMessageFormListInsetBottom,
  MessageForm,
} from 'components/message/MessageForm';
import { MessageList } from 'components/message/MessageList';
import type { MessageItemData } from 'components/message/MessageItem';
import { ThreadTitleButton } from 'components/thread/ThreadTitleButton';
import { getExampleThreadById } from 'lib/exampleThreads';
import type { Href } from 'expo-router';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useLayoutEffect, useMemo } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

function buildExampleMessages(threadId: string): MessageItemData[] {
  const now = Date.now();
  return [
    {
      id: 'm-1',
      threadId,
      createdAt: now - 1000 * 60 * 12,
      label: 'Summarize this thread',
      body: 'Here is a **short summary** of the discussion:\n\n- Navigation\n- Lists\n- Empty states',
      status: 'success',
    },
    {
      id: 'm-2',
      threadId,
      createdAt: now - 1000 * 60 * 8,
      input: 'What is the release date?',
      body: '',
      status: 'pending',
    },
    {
      id: 'm-3',
      threadId,
      createdAt: now - 1000 * 60 * 5,
      label: 'Draft reply',
      body: 'We are targeting **next Friday** for the mobile build.',
      status: 'success',
    },
    {
      id: 'm-4',
      threadId,
      createdAt: now - 1000 * 60 * 2,
      input: 'Run compliance check',
      body: '',
      error: 'The compliance service timed out. Please try again.',
      status: 'error',
      onRetry: () => {
        // Example only — wire to real retry when available
      },
    },
  ];
}

export default function MessageListScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const id = threadId ?? '';

  const thread = useMemo(() => getExampleThreadById(id), [id]);
  const data = useMemo(() => buildExampleMessages(id), [id]);
  const listBottomInset = useMemo(
    () => getMessageFormListInsetBottom(insets.bottom),
    [insets.bottom],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      // Native stack defaults to left-aligned titles on Android; center like iOS.
      headerTitleAlign: 'center',
      headerTitle: () => (
        <ThreadTitleButton
          data={thread}
          onPress={() =>
            router.push(`/threads/${thread.id}` as Href)
          }
        />
      ),
    });
  }, [navigation, router, thread]);

  return (
    <View style={styles.screen}>
      <MessageList
        data={data}
        contentPaddingBottom={listBottomInset}
        emptyMessage={{
          icon: 'chatbubble-ellipses-outline',
          message: 'No messages in this thread.',
        }}
      />
      <MessageForm />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));
