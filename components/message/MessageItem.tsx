import { MessageBubble } from 'components/message/MessageBubble';
import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { formatBubbleTime, type MessageItemProps } from './messageItemShared';

export type { MessageItemData, MessageItemProps, MessageStatus } from './messageItemShared';

export function MessageItem({ data, onRetry }: MessageItemProps) {
  const outgoingText =
    data.label != null && data.label.length > 0
      ? data.label
      : data.input != null && data.input.length > 0
        ? data.input
        : '';
  const showOutgoing = outgoingText.length > 0;

  const secondIsError = data.status === 'error';
  const secondIsPending = data.status === 'pending';

  const incomingText = secondIsError
    ? data.error != null && data.error.length > 0
      ? data.error
      : 'Something went wrong.'
    : data.body;

  return (
    <View style={styles.row}>
      {showOutgoing ? (
        <MessageBubble
          variant="outgoing"
          data={{
            text: outgoingText,
            time: formatBubbleTime(data.createdAt),
          }}
        />
      ) : null}

      <MessageBubble
        variant="incoming"
        data={{
          text: incomingText,
          time: secondIsPending ? undefined : formatBubbleTime(data.createdAt),
        }}
        error={secondIsError}
        pending={secondIsPending}
        actions={secondIsError ? ['Retry'] : []}
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
