import { MessageBody } from 'components/message/MessageBody';
import { JumpingDots } from 'components/ui/jumping-dots/JumpingDots';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

/** Mirrors persisted `Message` fields plus UI-only `status`. */
export type MessageItemData = {
  id: string;
  threadId: string;
  body: string;
  createdAt: number;
  label?: string;
  input?: string;
  error?: string;
  status: MessageStatus;
};

export type MessageStatus = 'pending' | 'success' | 'error';

export type MessageItemProps = {
  data: MessageItemData;
  onRetry?: (item: MessageItemData) => void;
};

function formatBubbleTime(createdAtMs: number): string {
  return new Date(createdAtMs).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

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

  return (
    <View style={styles.row}>
      {showOutgoing ? (
        <View style={styles.outgoingWrap}>
          <View style={styles.outgoingBubble}>
            <Text style={styles.outgoingText}>{outgoingText}</Text>
            <Text style={[styles.bubbleTime, styles.bubbleTimeOutgoing]}>
              {formatBubbleTime(data.createdAt)}
            </Text>
          </View>
        </View>
      ) : null}

      <View style={styles.incomingWrap}>
        <View
          style={[
            styles.incomingBubble,
            secondIsError && styles.incomingBubbleError,
          ]}
        >
          {secondIsPending ? (
            <JumpingDots />
          ) : secondIsError ? (
            <Text style={styles.errorText}>
              {data.error != null && data.error.length > 0
                ? data.error
                : 'Something went wrong.'}
            </Text>
          ) : (
            <MessageBody markdown={data.body} />
          )}
          {!secondIsPending ? (
            <Text style={[styles.bubbleTime, styles.bubbleTimeIncoming]}>
              {formatBubbleTime(data.createdAt)}
            </Text>
          ) : null}
        </View>
        {secondIsError ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retry"
            onPress={() => onRetry?.(data)}
            style={({ pressed }) => [
              styles.retryButton,
              pressed && styles.retryButtonPressed,
            ]}
          >
            <Text style={styles.retryLabel}>Retry</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  row: {
    gap: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
  },
  outgoingWrap: {
    alignSelf: 'flex-end',
    maxWidth: '88%',
  },
  outgoingBubble: {
    backgroundColor: theme.colors.outgoingBubble,
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[3],
    paddingBottom: theme.spacing[2],
    borderRadius: 18,
    borderBottomRightRadius: 4,
  },
  outgoingText: {
    fontSize: 15,
    color: theme.colors.text,
  },
  incomingWrap: {
    alignSelf: 'flex-start',
    maxWidth: '92%',
    gap: theme.spacing[2],
  },
  incomingBubble: {
    backgroundColor: theme.colors.incomingBubble,
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[3],
    paddingBottom: theme.spacing[2],
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  bubbleTime: {
    fontSize: 10,
    lineHeight: 12,
    marginTop: theme.spacing[1],
    color: theme.colors.muted,
  },
  bubbleTimeOutgoing: {
    alignSelf: 'flex-end',
  },
  bubbleTimeIncoming: {
    alignSelf: 'flex-start',
  },
  incomingBubbleError: {
    backgroundColor: theme.colors.incomingBubbleError,
    borderColor: theme.colors.error,
  },
  errorText: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.error,
  },
  retryButton: {
    alignSelf: 'flex-start',
    paddingVertical: theme.spacing[1],
    paddingHorizontal: theme.spacing[2],
  },
  retryButtonPressed: {
    opacity: 0.6,
  },
  retryLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.primary,
  },
}));
