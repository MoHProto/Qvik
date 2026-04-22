import { MessageBubble } from 'components/message/MessageBubble';
import { useMinimumPendingDisplay } from 'hooks/message/useMinimumPendingDisplay';
import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { formatBubbleTime, type MessageItemProps } from './messageItemShared';

export type { MessageItemData, MessageItemProps } from './messageItemShared';

export function MessageItem({ data, onRetry }: MessageItemProps) {
  const isPending = data.status === 'pending';
  const isError = data.status === 'error';
  const showPending = useMinimumPendingDisplay(data.id, isPending, isError);

  if (data.isOutgoing) {
    const text = showPending ? '' : data.body.trim();
    return (
      <View style={styles.row}>
        <MessageBubble
          variant="outgoing"
          pending={showPending}
          data={{
            text,
            time: showPending ? undefined : formatBubbleTime(data.timestamp),
          }}
        />
      </View>
    );
  }

  const incomingText = isError && data.body.trim().length === 0 ? 'Something went wrong.' : data.body;

  return (
    <View style={styles.row}>
      <MessageBubble
        variant="incoming"
        data={{
          text: incomingText,
          time: showPending ? undefined : formatBubbleTime(data.timestamp),
        }}
        error={isError}
        pending={showPending}
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
