import { MessageList } from 'components/message/MessageList';
import type { MessageItemData } from 'components/message/MessageItem';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect, useMemo } from 'react';
import { View } from 'react-native';
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
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const id = threadId ?? '';

  const data = useMemo(() => buildExampleMessages(id), [id]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Messages',
    });
  }, [navigation]);

  return (
    <View style={styles.screen}>
      <MessageList
        data={data}
        emptyMessage={{
          icon: 'chatbubble-ellipses-outline',
          message: 'No messages in this thread.',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));
