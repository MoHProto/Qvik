import { MessageBody } from 'components/message/MessageBody';
import React, { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

/** Mirrors persisted `Message` fields plus UI-only `status` (and optional retry handler). */
export type MessageItemData = {
  id: string;
  threadId: string;
  body: string;
  createdAt: number;
  label?: string;
  input?: string;
  error?: string;
  status: MessageStatus;
  onRetry?: () => void;
};

export type MessageStatus = 'pending' | 'success' | 'error';

export type MessageItemProps = {
  data: MessageItemData;
};

function JumpingDots() {
  const d1 = useSharedValue(0);
  const d2 = useSharedValue(0);
  const d3 = useSharedValue(0);

  useEffect(() => {
    const bounce = withRepeat(
      withSequence(
        withTiming(-5, { duration: 180 }),
        withTiming(0, { duration: 180 }),
      ),
      -1,
      false,
    );
    d1.value = bounce;
    d2.value = withDelay(120, bounce);
    d3.value = withDelay(240, bounce);
  }, [d1, d2, d3]);

  const s1 = useAnimatedStyle(() => ({
    transform: [{ translateY: d1.value }],
  }));
  const s2 = useAnimatedStyle(() => ({
    transform: [{ translateY: d2.value }],
  }));
  const s3 = useAnimatedStyle(() => ({
    transform: [{ translateY: d3.value }],
  }));

  return (
    <View style={styles.dotsRow} accessibilityLabel="Loading">
      <Animated.View style={[styles.dotCircle, s1]} />
      <Animated.View style={[styles.dotCircle, s2]} />
      <Animated.View style={[styles.dotCircle, s3]} />
    </View>
  );
}

export function MessageItem({ data }: MessageItemProps) {
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
        </View>
        {secondIsError ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retry"
            onPress={data.onRetry ?? (() => {})}
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
    paddingVertical: theme.spacing[3],
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
    paddingVertical: theme.spacing[3],
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
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
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    minHeight: 22,
    paddingVertical: 2,
  },
  dotCircle: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.colors.muted,
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
