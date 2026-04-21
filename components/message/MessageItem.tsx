import { MessageBubble } from 'components/message/MessageBubble';
import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { formatBubbleTime, type MessageItemProps } from './messageItemShared';

export type { MessageItemData, MessageItemProps } from './messageItemShared';

export function MessageItem({ data, onRetry }: MessageItemProps) {
  if (data.isOutgoing) {
    const isPending = data.status === 'pending';
    const text = isPending ? '' : data.body.trim();
    return (
      <View style={styles.row}>
        <MessageBubble
          variant="outgoing"
          pending={isPending}
          data={{
            text,
            time: isPending ? undefined : formatBubbleTime(data.timestamp),
          }}
        />
      </View>
    );
  }

  const isError = data.status === 'error';
  const isPending = data.status === 'pending';
  const incomingText = isError && data.body.trim().length === 0 ? 'Something went wrong.' : data.body;

  return (
    <View style={styles.row}>
      <MessageBubble
        variant="incoming"
        data={{
          text: incomingText,
          time: isPending ? undefined : formatBubbleTime(data.timestamp),
        }}
        error={isError}
        pending={isPending}
        actions={isError ? ['Retry'] : []}
        onAction={(label) => {
          if (label === 'Retry') {
            onRetry?.(data);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  row: {
    gap: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
  },
}));
