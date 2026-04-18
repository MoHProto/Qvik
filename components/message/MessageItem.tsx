import { MessageBody } from 'components/message/MessageBody';
import { MessageBubbleTail } from 'components/message/MessageBubbleTail';
import { JumpingDots } from 'components/ui/jumping-dots/JumpingDots';
import React from 'react';
import {
  Platform,
  PlatformColor,
  Pressable,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { formatBubbleTime, type MessageItemProps } from './messageItemShared';

export type { MessageItemData, MessageItemProps, MessageStatus } from './messageItemShared';

const OUTGOING_TIME = 'rgba(255, 255, 255, 0.65)';

/** iOS: semantic colors. Other platforms: iOS-like hex (light/dark). */
function useIosLikeBubblePalette() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (Platform.OS === 'ios') {
    return {
      outgoingBubble: PlatformColor('systemBlue'),
      incomingTime: PlatformColor('secondaryLabel'),
    };
  }

  if (isDark) {
    return {
      outgoingBubble: '#0A84FF',
      incomingTime: 'rgba(235, 235, 245, 0.6)',
    };
  }

  return {
    outgoingBubble: '#007AFF',
    incomingTime: '#8E8E93',
  };
}

export function MessageItem({ data, onRetry }: MessageItemProps) {
  const { theme } = useUnistyles();
  const bubble = useIosLikeBubblePalette();

  const outgoingText =
    data.label != null && data.label.length > 0
      ? data.label
      : data.input != null && data.input.length > 0
        ? data.input
        : '';
  const showOutgoing = outgoingText.length > 0;

  const secondIsError = data.status === 'error';
  const secondIsPending = data.status === 'pending';

  const incomingTailColor = secondIsError
    ? theme.colors.incomingBubbleError
    : theme.colors.surface;

  return (
    <View style={styles.row}>
      {showOutgoing ? (
        <View style={styles.outgoingWrap}>
          <View style={styles.bubbleOuterOutgoing}>
            <View
              style={[
                styles.outgoingBubble,
                styles.bubbleShadow,
                { backgroundColor: bubble.outgoingBubble },
              ]}
            >
              <Text style={styles.outgoingBubbleText}>{outgoingText}</Text>
              <Text
                style={[
                  styles.bubbleTime,
                  styles.bubbleTimeOutgoing,
                  { color: OUTGOING_TIME },
                ]}
              >
                {formatBubbleTime(data.createdAt)}
              </Text>
            </View>
            <MessageBubbleTail
              bubbleColor={bubble.outgoingBubble}
              canvasColor={theme.colors.background}
              side="right"
            />
          </View>
        </View>
      ) : null}

      <View style={styles.incomingWrap}>
        <View style={styles.bubbleOuterIncoming}>
          <View
            style={[
              styles.incomingBubble,
              styles.bubbleShadow,
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
              <Text
                style={[
                  styles.bubbleTime,
                  styles.bubbleTimeIncoming,
                  { color: bubble.incomingTime },
                ]}
              >
                {formatBubbleTime(data.createdAt)}
              </Text>
            ) : null}
          </View>
          <MessageBubbleTail
            bubbleColor={incomingTailColor}
            canvasColor={theme.colors.background}
            side="left"
          />
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
  bubbleOuterOutgoing: {
    position: 'relative',
    alignSelf: 'stretch',
  },
  bubbleOuterIncoming: {
    position: 'relative',
    alignSelf: 'stretch',
    /** Tail extends below the bubble; keep clear of the next list row */
    marginBottom: 8,
  },
  /** Subtle lift; same view as fill (RN + iOS). Kept lighter than Settings cards. */
  bubbleShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.03,
        shadowRadius: 1.5,
      },
      android: {
        elevation: 0,
      },
      default: {
        boxShadow: '0 0.5px 1.5px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  outgoingBubble: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[3],
    paddingBottom: theme.spacing[2],
    borderRadius: 18,
  },
  outgoingBubbleText: {
    fontSize: 15,
    color: '#ffffff',
  },
  incomingWrap: {
    alignSelf: 'flex-start',
    maxWidth: '92%',
  },
  incomingBubble: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[3],
    paddingBottom: theme.spacing[2],
    borderRadius: 18,
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
    fontWeight: '500',
    color: theme.colors.primary,
  },
}));
